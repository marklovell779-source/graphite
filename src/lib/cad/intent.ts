import { uid } from "@/lib/utils";
import type { CadDocument, CadFeature, FeaturePatch } from "./types";
import { PARAM_META } from "./types";
import { TEMPLATES } from "./templates";
import { decideYield, trustOfUtterance } from "./trust";

const BOX_RE =
  /(\d+(?:\.\d+)?)\s*(?:mm|in)?\s*[x×*]+\s*(\d+(?:\.\d+)?)\s*(?:mm|in)?\s*[x×*]+\s*(\d+(?:\.\d+)?)/i;
const HOLE_COUNT_RE = /(\d+)\s*(?:×\s*)?(?:mm\s+)?holes?\b/i;
const M_HOLE_RE = /\bm\s*([3-8])\b/i;
const DIA_RE = /(?:ø|od|diameter)\s*(\d+(?:\.\d+)?)/i;
const ID_RE = /(?:id|bore|inner)\s*(\d+(?:\.\d+)?)/i;
const HEIGHT_RE = /(?:h(?:eight)?|thick(?:ness)?)\s*(?:of\s*)?(\d+(?:\.\d+)?)/i;

function box(
  length: number,
  width: number,
  height: number,
  name = "Body",
): CadFeature {
  return {
    id: uid("f"),
    kind: "box",
    name,
    op: "add",
    params: { length, width, height, fillet: 0 },
    position: { x: 0, y: height / 2, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
  };
}

function hole(x: number, z: number, r: number, depth: number, name: string): CadFeature {
  return {
    id: uid("f"),
    kind: "hole",
    name,
    op: "subtract",
    params: { radius: r, depth: depth + 1 },
    position: { x, y: depth / 2, z },
    rotation: { x: 0, y: 0, z: 0 },
    axis: "y",
  };
}

function cornerHoles(length: number, width: number, height: number, n: number, r: number) {
  const insetX = Math.min(8, length * 0.18);
  const insetZ = Math.min(8, width * 0.18);
  const pts = [
    { x: -length / 2 + insetX, z: -width / 2 + insetZ },
    { x: length / 2 - insetX, z: -width / 2 + insetZ },
    { x: -length / 2 + insetX, z: width / 2 - insetZ },
    { x: length / 2 - insetX, z: width / 2 - insetZ },
  ];
  return pts.slice(0, Math.min(4, Math.max(1, n))).map((p, i) => hole(p.x, p.z, r, height, `Hole ${i + 1}`));
}

export function parseIntent(text: string): CadDocument | null {
  const raw = text.trim();
  if (!raw) return null;
  const lower = raw.toLowerCase();

  if (/bracket|angle iron|l-?shape/.test(lower)) return TEMPLATES.bracket.build();
  if (/phone|stand|wedge/.test(lower)) return TEMPLATES.stand.build();
  if (/enclos|project box|housing|case/.test(lower)) return TEMPLATES.enclosure.build();
  if (/bushing|spacer|standoff/.test(lower)) return TEMPLATES.bushing.build();

  const dim = raw.match(BOX_RE);
  const dia = raw.match(DIA_RE);
  const idm = raw.match(ID_RE);
  const ht = raw.match(HEIGHT_RE);
  const holeCount = raw.match(HOLE_COUNT_RE);
  const mHole = raw.match(M_HOLE_RE);

  if (/cylinder|tube|pipe|rod|disc|disk|washer/.test(lower) || (dia && !dim)) {
    const od = dia ? Number(dia[1]) : 20;
    const id = idm ? Number(idm[1]) : od * 0.4;
    const height = ht ? Number(ht[1]) : 12;
    const features: CadFeature[] = [
      {
        id: uid("f"),
        kind: "cylinder",
        name: "Body",
        op: "add",
        params: { radius: od / 2, height },
        position: { x: 0, y: height / 2, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        axis: "y",
      },
    ];
    if (id > 0 && id < od) {
      features.push(hole(0, 0, id / 2, height, "Bore"));
    }
    return wrap(raw, "Turned part", features, "voice");
  }

  if (dim) {
    const length = Number(dim[1]);
    const width = Number(dim[2]);
    const height = Number(dim[3]);
    const features = [box(length, width, height, "Plate")];
    const n = holeCount ? Number(holeCount[1]) : /holes?/.test(lower) ? 4 : 0;
    const r = mHole ? (Number(mHole[1]) + 0.2) / 2 : 1.7;
    if (n) features.push(...cornerHoles(length, width, height, n, r));
    return wrap(raw, "Plate", features, "voice");
  }

  if (/plate|block|bar|cube/.test(lower)) {
    return wrap(raw, "Plate", [box(40, 40, 6)], "voice");
  }
  return null;
}

function wrap(
  source: string,
  name: string,
  features: CadFeature[],
  media: CadDocument["media"],
): CadDocument {
  return {
    id: uid("doc"),
    name,
    units: "mm",
    media,
    pipelineNote: `Speech-to-intent · “${source.slice(0, 80)}”`,
    confidence: 0.55,
    trust: trustOfUtterance(source),
    notes: "Parsed from language, not a drawing. Confirm every number.",
    sourceLabel: "Spoken description",
    features,
    questions: [
      {
        id: uid("q"),
        prompt: "I treated the units as millimetres. Is that right?",
        why: "An inch-mode part scaled in mm is 25× too small.",
        options: [
          { label: "Millimetres", reply: "Units are millimetres", patch: { units: "mm" } },
          { label: "Inches", reply: "Units are inches", patch: { units: "in" } },
        ],
      },
    ],
  };
}

export function applyPatch(doc: CadDocument, patch: FeaturePatch): CadDocument {
  let features = doc.features.map((f) => ({ ...f, params: { ...f.params } }));
  const target = patch.featureId
    ? features.filter((f) => f.id === patch.featureId || f.name.toLowerCase().includes(patch.featureId!.toLowerCase()))
    : features;

  if (patch.deleteFeature && patch.featureId) {
    features = features.filter(
      (f) => f.id !== patch.featureId && !f.name.toLowerCase().includes(patch.featureId!.toLowerCase()),
    );
  } else {
    const applyTo = target.length ? target : features;
    for (const f of applyTo) {
      if (patch.params) {
        const allowed = new Set(PARAM_META[f.kind].map((p) => p.key));
        for (const [k, v] of Object.entries(patch.params)) {
          if (allowed.has(k)) f.params[k] = v;
        }
      }
      if (patch.position) f.position = { ...f.position, ...patch.position };
      if (patch.rotation) f.rotation = { ...f.rotation, ...patch.rotation };
      if (patch.name) f.name = patch.name;
      if (patch.hidden !== undefined) f.hidden = patch.hidden;
    }
  }
  if (patch.addFeatures?.length) features = features.concat(patch.addFeatures);

  if (patch.params?.height) {
    for (const f of features) {
      if (f.op === "add" && (f.kind === "box" || f.kind === "cylinder" || f.kind === "wedge")) {
        if (patch.featureId && f.id !== patch.featureId && !f.name.toLowerCase().includes(patch.featureId.toLowerCase())) {
          continue;
        }
        f.position = { ...f.position, y: (f.params.height ?? patch.params.height) / 2 };
      }
      if (f.kind === "hole" && patch.params.height) {
        f.params.depth = patch.params.height + 1;
        f.position = { ...f.position, y: (patch.params.height ?? f.position.y) / 2 };
      }
    }
  }

  return {
    ...doc,
    name: patch.docName ?? doc.name,
    units: patch.units ?? doc.units,
    features,
    questions: doc.questions.map((q) =>
      patch && q.options.some((o) => o.patch === patch) ? { ...q, answered: "applied" } : q,
    ),
  };
}

export function applyThickness(doc: CadDocument, height: number): CadDocument {
  return {
    ...doc,
    features: doc.features.map((f) => {
      if (f.kind === "hole" || f.kind === "slot" || f.kind === "pocket") {
        if ((f.axis ?? "y") === "y") {
          return {
            ...f,
            params: { ...f.params, depth: height + 1 },
            position: { ...f.position, y: height / 2 },
          };
        }
        return f;
      }
      if (f.op !== "add") return f;
      if (f.kind === "cylinder" && (f.axis ?? "y") === "y") {
        return {
          ...f,
          params: { ...f.params, height },
          position: { ...f.position, y: height / 2 },
        };
      }
      if (f.kind === "extrude") {
        return { ...f, params: { ...f.params, height } };
      }
      if (f.kind === "box") {
        const l = f.params.length ?? 0;
        const w = f.params.width ?? 0;
        const h = f.params.height ?? 0;
        const min = Math.min(l, w, h);
        if (Math.abs(h - min) <= 0.25) {
          return {
            ...f,
            params: { ...f.params, height },
            position: { ...f.position, y: height / 2 },
          };
        }
        if (Math.abs(w - min) <= 0.25) {
          const sign = f.position.z >= 0 ? 1 : -1;
          return {
            ...f,
            params: { ...f.params, width: height },
            position: { ...f.position, z: sign * (height / 2) },
          };
        }
        if (Math.abs(l - min) <= 0.25) {
          const sign = f.position.x >= 0 ? 1 : -1;
          return {
            ...f,
            params: { ...f.params, length: height },
            position: { ...f.position, x: sign * (height / 2) },
          };
        }
      }
      return f;
    }),
  };
}

export function applySpokenDims(doc: CadDocument, note: string): CadDocument {
  const raw = note.trim();
  if (!raw) return doc;
  const decision = decideYield(doc.trust ?? "guesswork", trustOfUtterance(raw));
  if (decision.yielded) {
    return {
      ...doc,
      trust: "knowing",
      pipelineNote: `${doc.pipelineNote} · yielded`,
      notes: `${doc.notes} ${decision.reason}`.trim(),
    };
  }
  let next: CadDocument = {
    ...doc,
    trust: decision.trust,
    features: doc.features.map((f) => ({ ...f, params: { ...f.params }, position: { ...f.position } })),
    pipelineNote: `${doc.pipelineNote} · note: “${raw.slice(0, 80)}”`,
    notes: `${doc.notes} Typed/spoken: “${raw}”.`.trim(),
    confidence: Math.min(1, doc.confidence + 0.12),
  };

  const named = parseIntent(raw);
  if (named && /bracket|stand|enclos|bushing|spacer|phone/.test(raw.toLowerCase()) && named.name !== "Plate") {
    return {
      ...named,
      id: next.id,
      media: next.media,
      sourceLabel: next.sourceLabel,
      pipelineNote: `${next.pipelineNote} · matched “${named.name}” from the note`,
      notes: `${named.notes} Identity from the note, confirm the sketch still matches.`,
      confidence: Math.min(1, Math.max(next.confidence, named.confidence) + 0.08),
      trust: decision.trust,
    };
  }

  const dim = raw.match(BOX_RE);
  const dia = raw.match(DIA_RE);
  const idm = raw.match(ID_RE);
  const ht = raw.match(HEIGHT_RE);
  const mHole = raw.match(M_HOLE_RE);

  if (dim) {
    const length = Number(dim[1]);
    const width = Number(dim[2]);
    const height = Number(dim[3]);
    const turned = /cylinder|bushing|spacer|ø|od|diameter/.test(raw.toLowerCase());
    next = {
      ...next,
      features: next.features.map((f) => {
        if (f.op === "add" && (f.kind === "box" || (f.kind === "cylinder" && !turned))) {
          return {
            ...f,
            kind: "box" as const,
            name: f.name === "Body" ? "Plate" : f.name,
            params: { length, width, height, fillet: f.params.fillet ?? 0 },
            position: { x: 0, y: height / 2, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            axis: undefined,
          };
        }
        if (f.op === "add" && f.kind === "cylinder") {
          return {
            ...f,
            params: { ...f.params, radius: Math.min(length, width) / 2, height },
            position: { ...f.position, y: height / 2 },
          };
        }
        if (f.kind === "hole" && (f.axis ?? "y") === "y") {
          return {
            ...f,
            params: { ...f.params, depth: height + 1 },
            position: { ...f.position, y: height / 2 },
          };
        }
        return f;
      }),
      name: turned ? next.name : next.name === "Turned part" ? "Plate" : next.name,
    };
    next = applyThickness(next, height);
  } else if (ht) {
    next = applyThickness(next, Number(ht[1]));
  }

  if (dia) {
    const od = Number(dia[1]);
    next = {
      ...next,
      features: next.features.map((f) =>
        f.kind === "cylinder" && f.op === "add" ? { ...f, params: { ...f.params, radius: od / 2 } } : f,
      ),
    };
  }
  if (idm) {
    const id = Number(idm[1]);
    next = {
      ...next,
      features: next.features.map((f) =>
        f.kind === "hole" ? { ...f, params: { ...f.params, radius: id / 2 } } : f,
      ),
    };
  }
  if (mHole || /holes?/.test(raw.toLowerCase())) {
    const r = mHole ? (Number(mHole[1]) + 0.2) / 2 : 1.7;
    const words: Record<string, number> = { two: 2, three: 3, four: 4, six: 6, eight: 8 };
    const word = raw.toLowerCase().match(/\b(two|three|four|six|eight)\b/);
    const counted = raw.match(/(?<![mM])\b([2-8])\s+(?:x\s*)?holes?\b/i);
    const count = counted ? Number(counted[1]) : word ? words[word[1]] : 4;
    const body = next.features.find((f) => f.op === "add" && f.kind === "box");
    if (body) {
      const length = body.params.length ?? 40;
      const width = body.params.width ?? 40;
      const height = body.params.height ?? 6;
      next = {
        ...next,
        features: [
          ...next.features.filter((f) => f.kind !== "hole"),
          ...cornerHoles(length, width, height, count, r),
        ],
      };
    } else {
      next = {
        ...next,
        features: next.features.map((f) =>
          f.kind === "hole" ? { ...f, params: { ...f.params, radius: r } } : f,
        ),
      };
    }
  }

  return next;
}
