import { createServerFn } from "@tanstack/react-start";
import { uid } from "@/lib/utils";
import type {
  CadDocument,
  CadFeature,
  ChatMessage,
  ClarifyingQuestion,
  FeatureKind,
  MediaKind,
} from "@/lib/cad/types";

export type InterpretInput = {
  mode: "interpret" | "refine";
  image?: string;
  text?: string;
  mediaHint?: MediaKind;
  pipelineNote?: string;
  current?: CadDocument;
  history?: { role: "user" | "assistant"; text: string }[];
};

export type InterpretResult =
  | { ok: true; doc: CadDocument; assistantMessage: string }
  | { ok: false; error: string; unavailable?: boolean };

const KINDS: FeatureKind[] = [
  "box",
  "cylinder",
  "sphere",
  "cone",
  "wedge",
  "extrude",
  "hole",
  "slot",
  "pocket",
];

const SYSTEM = `You are Graphite, a senior parametric CAD interpreter.
A sketch is always a guess until the user confirms it. Never invent a dimension you cannot see — put it in questions instead.

Return ONLY a JSON object with this shape:
{
  "name": string,
  "units": "mm" | "in",
  "media": "graph-paper" | "napkin" | "whiteboard" | "coaster" | "photo" | "voice" | "gesture" | "describe",
  "pipelineNote": string,
  "confidence": number,
  "notes": string,
  "assistantMessage": string,
  "features": [
    {
      "id": string,
      "kind": "box"|"cylinder"|"sphere"|"cone"|"wedge"|"extrude"|"hole"|"slot"|"pocket",
      "name": string,
      "op": "add"|"subtract",
      "params": { ...numbers },
      "position": { "x": number, "y": number, "z": number },
      "rotation": { "x": number, "y": number, "z": number },
      "axis": "x"|"y"|"z",
      "profile": [{ "x": number, "z": number }]
    }
  ],
  "questions": [
    {
      "id": string,
      "prompt": string,
      "why": string,
      "options": [
        { "label": string, "reply": string, "patch": { "featureId"?: string, "params"?: object, "units"?: "mm"|"in", "deleteFeature"?: boolean } }
      ]
    }
  ]
}

Coordinate system (Three.js, millimetres unless units=in):
- +Y is up. Parts sit on the Y=0 bed.
- +X right, +Z toward the viewer (depth).
- position is the feature CENTER.
- A box of length×width×height occupies X×Z×Y. So params.length is X, params.width is Z, params.height is Y.
- Cylinders/holes default axis Y (through the bed). Use axis "z" or "x" for sideways holes.
- rotation is Euler XYZ in degrees.
- Subtractive features (hole, slot, pocket) must use op="subtract" and overshoot depth by ~0.5 so they punch through.
- Prefer 2–12 features. Union of additive boxes/cylinders plus boolean cuts. Do not emit mesh vertices.

Questions (mandatory when anything is unlabeled):
- Always ask thickness if the source is 2D.
- Always ask hole fit if diameter is unmarked (M3/M4 clearance vs tap).
- Every option MUST include a patch that can be applied without another round trip.
- Ask at most 3 questions. Short, concrete prompts.

assistantMessage: 1–3 sentences, spoken like a machinist checking a print. No fluff, no emoji.`;

function asNum(v: unknown, fallback: number) {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

function asVec(v: unknown): { x: number; y: number; z: number } {
  if (!v || typeof v !== "object") return { x: 0, y: 0, z: 0 };
  const o = v as Record<string, unknown>;
  return { x: asNum(o.x, 0), y: asNum(o.y, 0), z: asNum(o.z, 0) };
}

function sanitizeFeature(raw: unknown, i: number): CadFeature | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const kind = KINDS.includes(o.kind as FeatureKind) ? (o.kind as FeatureKind) : "box";
  const op = o.op === "subtract" || kind === "hole" || kind === "slot" || kind === "pocket" ? "subtract" : "add";
  const params: Record<string, number> = {};
  if (o.params && typeof o.params === "object") {
    for (const [k, v] of Object.entries(o.params as Record<string, unknown>)) {
      const n = asNum(v, NaN);
      if (Number.isFinite(n)) params[k] = n;
    }
  }
  const profile = Array.isArray(o.profile)
    ? o.profile
        .map((p) => {
          if (!p || typeof p !== "object") return null;
          const pt = p as Record<string, unknown>;
          return { x: asNum(pt.x, 0), z: asNum(pt.z ?? pt.y, 0) };
        })
        .filter((p): p is { x: number; z: number } => p !== null)
    : undefined;
  const axis = o.axis === "x" || o.axis === "z" || o.axis === "y" ? o.axis : op === "subtract" ? "y" : undefined;
  return {
    id: typeof o.id === "string" && o.id ? o.id : uid("f"),
    kind,
    name: typeof o.name === "string" && o.name ? o.name : `${kind} ${i + 1}`,
    op,
    params,
    position: asVec(o.position),
    rotation: asVec(o.rotation),
    axis,
    profile: profile && profile.length >= 3 ? profile : undefined,
  };
}

function sanitizeQuestion(raw: unknown): ClarifyingQuestion | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const prompt = typeof o.prompt === "string" ? o.prompt : "";
  if (!prompt) return null;
  const options = Array.isArray(o.options)
    ? o.options.slice(0, 4).map((opt, i) => {
        const x = (opt && typeof opt === "object" ? opt : {}) as Record<string, unknown>;
        const patch = x.patch && typeof x.patch === "object" ? (x.patch as ClarifyingQuestion["options"][0]["patch"]) : undefined;
        return {
          label: typeof x.label === "string" ? x.label : `Option ${i + 1}`,
          reply: typeof x.reply === "string" ? x.reply : String(x.label ?? ""),
          patch,
        };
      })
    : [];
  return {
    id: typeof o.id === "string" && o.id ? o.id : uid("q"),
    prompt,
    why: typeof o.why === "string" ? o.why : "",
    options,
  };
}

function sanitizeDoc(raw: unknown, fallback?: CadDocument): { doc: CadDocument; assistantMessage: string } {
  const o = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const features = Array.isArray(o.features)
    ? o.features.map(sanitizeFeature).filter((f): f is CadFeature => f !== null)
    : fallback?.features ?? [];
  const questions = Array.isArray(o.questions)
    ? o.questions.map(sanitizeQuestion).filter((q): q is ClarifyingQuestion => q !== null).slice(0, 3)
    : fallback?.questions ?? [];
  const media = (o.media as MediaKind) || fallback?.media || "photo";
  const doc: CadDocument = {
    id: fallback?.id ?? uid("doc"),
    name: typeof o.name === "string" && o.name ? o.name : fallback?.name ?? "Untitled part",
    units: o.units === "in" ? "in" : "mm",
    media,
    pipelineNote: typeof o.pipelineNote === "string" ? o.pipelineNote : fallback?.pipelineNote ?? "",
    confidence: Math.max(0, Math.min(1, asNum(o.confidence, fallback?.confidence ?? 0.5))),
    notes: typeof o.notes === "string" ? o.notes : fallback?.notes ?? "",
    sourceLabel: fallback?.sourceLabel,
    features: features.length ? features : fallback?.features ?? [],
    questions,
  };
  const assistantMessage =
    typeof o.assistantMessage === "string" && o.assistantMessage
      ? o.assistantMessage
      : "Here's a first pass. Confirm the marked questions before you export.";
  return { doc, assistantMessage };
}

function extractJson(text: string): unknown {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fence ? fence[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("Model did not return JSON");
  return JSON.parse(raw.slice(start, end + 1));
}

type ContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string; detail: "high" | "low" } };

export const interpretSketch = createServerFn({ method: "POST" })
  .validator((input: InterpretInput) => input)
  .handler(async ({ data }): Promise<InterpretResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false, error: "AI is not available in this environment", unavailable: true };
    }

    const userParts: ContentPart[] = [];
    if (data.image && data.image.startsWith("data:image")) {
      userParts.push({
        type: "image_url",
        image_url: { url: data.image, detail: "high" },
      });
    }

    const brief: string[] = [];
    if (data.mode === "interpret") {
      brief.push("Interpret this input as a single manufacturable part.");
      if (data.mediaHint) brief.push(`Media router hint: ${data.mediaHint}.`);
      if (data.pipelineNote) brief.push(`Router notes: ${data.pipelineNote}.`);
      if (data.text) brief.push(`User description: ${data.text}`);
      if (!data.image && !data.text) brief.push("No image. Invent nothing — ask what they meant.");
    } else {
      brief.push("Refine the existing parametric model from the user's instruction. Keep feature ids stable when you can.");
      if (data.text) brief.push(`User: ${data.text}`);
      if (data.current) brief.push(`Current model JSON:\n${JSON.stringify(data.current)}`);
    }

    userParts.push({ type: "text", text: brief.join("\n") });

    const messages: { role: string; content: unknown }[] = [
      { role: "system", content: SYSTEM },
    ];
    if (data.history?.length) {
      for (const m of data.history.slice(-6)) {
        messages.push({ role: m.role, content: m.text });
      }
    }
    messages.push({ role: "user", content: userParts });

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          messages,
          response_format: { type: "json_object" },
          max_tokens: 2500,
        }),
      });
      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        return { ok: false, error: `xAI API error ${res.status}${errText ? `: ${errText.slice(0, 180)}` : ""}` };
      }
      const body = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = body.choices?.[0]?.message?.content ?? "";
      const parsed = extractJson(content);
      const { doc, assistantMessage } = sanitizeDoc(parsed, data.current);
      if (!doc.features.length) {
        return { ok: false, error: "No features could be read from that input." };
      }
      return { ok: true, doc, assistantMessage };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Interpret failed";
      return { ok: false, error: message };
    }
  });

export type ChatTurn = ChatMessage;
