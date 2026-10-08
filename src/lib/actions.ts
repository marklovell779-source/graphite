import { interpretSketch } from "@/lib/ai/interpret";
import { parseIntent, applySpokenDims } from "@/lib/cad/intent";
import {
  canvasToJpeg,
  classifyCanvas,
  fileToCanvas,
  recognizeStrokes,
  type Stroke,
} from "@/lib/cad/recognize";
import { TEMPLATES, type TemplateId } from "@/lib/cad/templates";
import type { CadDocument, MediaKind, PipelineStep } from "@/lib/cad/types";
import { useApp } from "@/lib/store";
import { uid } from "@/lib/utils";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function baseSteps(): PipelineStep[] {
  return [
    { id: "route", label: "Media router", status: "pending" },
    { id: "trace", label: "Trace edges", status: "pending" },
    { id: "features", label: "Classify features", status: "pending" },
    { id: "param", label: "Parametric model", status: "pending" },
  ];
}

async function runSteps(
  details: Record<string, string>,
  work: () => Promise<{ doc: CadDocument; message: string; thumb?: string | null }>,
) {
  const { setPhase, setBusy, setPipeline, patchPipeline, setError, loadDoc } = useApp.getState();
  setError(null);
  setBusy(true);
  setPhase("recognize");
  const steps = baseSteps();
  setPipeline(steps);
  const order = ["route", "trace", "features", "param"] as const;
  try {
    for (const id of order) {
      patchPipeline(id, { status: "active", detail: details[id] });
      if (id !== "param") await sleep(id === "route" ? 420 : 280);
      if (id === "param") {
        const result = await work();
        patchPipeline(id, {
          status: "done",
          detail: `${result.doc.features.length} features · ${Math.round(result.doc.confidence * 100)}%`,
        });
        loadDoc(result.doc, { thumb: result.thumb, message: result.message });
        return;
      }
      patchPipeline(id, { status: "done", detail: details[id] });
    }
  } catch (err) {
    setBusy(false);
    setPhase("intake");
    setError(err instanceof Error ? err.message : "Could not read that input");
  }
}

export async function ingestTemplate(id: TemplateId) {
  const t = TEMPLATES[id];
  const doc = t.build();
  const existing = useApp.getState().parts.length;
  await runSteps(
    {
      route: existing ? `Adding ${t.mediaLabel} as part ${existing + 1}` : `${t.mediaLabel} detected`,
      trace: "Sample sketch, using calibrated template",
      features: `${doc.features.length} features from the drawing`,
      param: doc.name,
    },
    async () => ({
      doc,
      thumb: t.image,
      message:
        existing > 0
          ? `${doc.name} added beside the other part${existing === 1 ? "" : "s"}. Confirm this one, or switch in the tree.`
          : `${doc.notes} ${doc.questions.length} questions still open — a sketch is a guess until you confirm it.`,
    }),
  );
}

export async function ingestKit(ids: TemplateId[] = ["bracket", "bushing"]) {
  const built = ids.map((id) => {
    const t = TEMPLATES[id];
    return { t, doc: t.build() };
  });
  const first = built[0];
  if (!first) return;
  const names = built.map((b) => b.doc.name).join(" + ");
  await runSteps(
    {
      route: built.map((b) => b.t.mediaLabel).join(" + "),
      trace: `${built.length} calibrated sketches`,
      features: `${built.reduce((n, b) => n + b.doc.features.length, 0)} features across ${built.length} parts`,
      param: names,
    },
    async () => ({
      doc: first.doc,
      thumb: first.t.image,
      message: `${first.doc.notes} ${built.length} parts on the bed. Confirm this one, then switch to the next.`,
    }),
  );
  for (const extra of built.slice(1)) {
    useApp.getState().loadDoc(extra.doc, {
      thumb: extra.t.image,
      message: `${extra.doc.name} added. Two parts — print (STL) and mill (G-code) for each, or export the kit.`,
    });
  }
}

export async function ingestImage(file: Blob, sourceLabel = "Uploaded sketch", note?: string) {
  const canvas = await fileToCanvas(file);
  const guess = classifyCanvas(canvas);
  const jpeg = canvasToJpeg(canvas);
  const caption = note?.trim();
  await runSteps(
    {
      route: guess.detail,
      trace: guess.media === "napkin" ? "Correcting perspective, inferring proportion" : "Tracing high-contrast edges",
      features: caption ? `Sketch + note: “${caption.slice(0, 48)}”` : "Holes, fillets, pockets",
      param: "Building the solid",
    },
    async () => {
      const result = await interpretSketch({
        data: {
          mode: "interpret",
          image: jpeg,
          text: caption,
          mediaHint: guess.media,
          pipelineNote: caption ? `${guess.detail}. User note: ${caption}` : guess.detail,
        },
      });
      if (!result.ok) {
        const fallback = parseIntent(caption || "40x40x6 plate with 4 holes");
        if (fallback && (result.unavailable || caption)) {
          fallback.notes = result.unavailable
            ? "AI is offline. Parsed the note onto a first-pass solid."
            : fallback.notes;
          fallback.media = guess.media;
          fallback.sourceLabel = sourceLabel;
          return {
            doc: fallback,
            thumb: jpeg,
            message: result.unavailable
              ? "Vision is unavailable. I used the written dimensions on a generic plate — confirm them."
              : `Couldn't read the photo (${result.error}). Used the note instead.`,
          };
        }
        throw new Error(result.error);
      }
      result.doc.sourceLabel = sourceLabel;
      result.doc.media = guess.media;
      return { doc: result.doc, thumb: jpeg, message: result.assistantMessage };
    },
  );
}

export async function ingestStrokes(
  strokes: Stroke[],
  w: number,
  h: number,
  note?: string,
  jpeg?: string,
) {
  const caption = note?.trim();
  if ((!strokes.length || strokes.flat().length < 8) && caption) {
    await ingestText(caption, "describe");
    return;
  }
  const local = applySpokenDims(recognizeStrokes(strokes, w, h), caption ?? "");
  await runSteps(
    {
      route: caption ? "Hand sketch + description" : "Live hand sketch (gesture pad)",
      trace: `${strokes.length} stroke${strokes.length === 1 ? "" : "s"}${caption ? " · dimensions from the note" : ""}`,
      features: local.pipelineNote,
      param: local.name,
    },
    async () => ({
      doc: local,
      thumb: jpeg ?? null,
      message: caption
        ? `Shape from the sketch, numbers from “${caption}”. Confirm anything I still guessed.`
        : `${local.notes} Confirm thickness before you trust the solid.`,
    }),
  );
}

export async function ingestText(text: string, media: MediaKind = "describe") {
  await runSteps(
    {
      route: media === "voice" ? "Speech-to-intent" : "Text-to-intent",
      trace: "No raster — parsing dimensions from language",
      features: "Matching primitives to the description",
      param: "Drafting the solid",
    },
    async () => {
      const result = await interpretSketch({
        data: { mode: "interpret", text, mediaHint: media, pipelineNote: text.slice(0, 240) },
      });
      if (result.ok) {
        result.doc.media = media;
        result.doc.sourceLabel = media === "voice" ? "Spoken description" : "Written description";
        return { doc: result.doc, thumb: null, message: result.assistantMessage };
      }
      const local = parseIntent(text);
      if (local) {
        local.media = media;
        return {
          doc: local,
          thumb: null,
          message: result.unavailable
            ? "AI is offline, so I parsed the numbers locally. Confirm them."
            : `Couldn't reach the model (${result.error}). Parsed a first pass locally.`,
        };
      }
      throw new Error(result.error);
    },
  );
}

export async function refineChat(text: string) {
  const { doc, messages, addMessage, loadDoc, setBusy, setError } = useApp.getState();
  if (!text.trim()) return;
  addMessage({ role: "user", text });
  if (!doc) {
    await ingestText(text, "describe");
    return;
  }
  setBusy(true);
  setError(null);
  const result = await interpretSketch({
    data: {
      mode: "refine",
      text,
      current: doc,
      history: messages.slice(-6).map((m) => ({ role: m.role, text: m.text })),
    },
  });
  setBusy(false);
  if (!result.ok) {
    const lower = text.toLowerCase();
    if (/\b(\d+(?:\.\d+)?)\s*mm\b/.test(lower) && /thick/.test(lower)) {
      const n = Number(lower.match(/(\d+(?:\.\d+)?)\s*mm/)?.[1]);
      if (n) {
        const { applyQuestionPatch } = useApp.getState();
        applyQuestionPatch({ params: { height: n } }, text, uid("q"));
        return;
      }
    }
    setError(result.error);
    addMessage({
      role: "assistant",
      text: result.unavailable
        ? "AI is offline. Use the sliders on the left, or pick a question chip."
        : `Couldn't apply that (${result.error}). Try a question chip or a slider.`,
    });
    return;
  }
  loadDoc(result.doc, { message: result.assistantMessage });
}
