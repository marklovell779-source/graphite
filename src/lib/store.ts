import { create } from "zustand";
import { uid } from "@/lib/utils";
import type {
  CadDocument,
  CadFeature,
  ChatMessage,
  FeatureKind,
  FeaturePatch,
  Phase,
  PipelineStep,
  Units,
} from "@/lib/cad/types";
import { KIND_DEFAULTS } from "@/lib/cad/types";
import { applyPatch, applyThickness } from "@/lib/cad/intent";
import { scaleDoc } from "@/lib/cad/geometry";
import { DEFAULT_SLICER, type SlicerSettings } from "@/lib/cad/printers";
import type { SliceResult } from "@/lib/cad/slicer";

type CaptureMode = "photo" | "draw" | "voice" | "camera" | "gesture" | "describe" | null;

export type NavTab = "project" | "issues" | "search" | "capture" | "run";
export type ReportTab = "problems" | "output" | "gcode";


type AppState = {
  phase: Phase;
  doc: CadDocument | null;
  parts: CadDocument[];
  activeId: string | null;
  thumbs: Record<string, string | null>;
  chats: Record<string, ChatMessage[]>;
  selectedId: string | null;
  messages: ChatMessage[];
  pipeline: PipelineStep[];
  busy: boolean;
  error: string | null;
  captureMode: CaptureMode;
  sourceThumb: string | null;
  mobileTab: "capture" | "model" | "talk" | "slice";
  kitView: boolean;
  slicerOpen: boolean;
  slicerSettings: SlicerSettings;
  sliceResult: SliceResult | null;
  sliceLayer: number;
  slicerProgress: number;
  navTab: NavTab;
  navOpen: boolean;
  inspectorOpen: boolean;
  commandOpen: boolean;
  searchQuery: string;
  reportOpen: boolean;
  reportTab: ReportTab;
  setPhase: (p: Phase) => void;
  setBusy: (b: boolean) => void;
  setError: (e: string | null) => void;
  setCaptureMode: (m: CaptureMode) => void;
  setMobileTab: (t: AppState["mobileTab"]) => void;
  setPipeline: (s: PipelineStep[]) => void;
  patchPipeline: (id: string, patch: Partial<PipelineStep>) => void;
  loadDoc: (doc: CadDocument, opts?: { thumb?: string | null; message?: string }) => void;
  setActive: (id: string) => void;
  removePart: (id: string) => void;
  setKitView: (v: boolean) => void;
  setSlicerOpen: (v: boolean) => void;
  patchSlicer: (p: Partial<SlicerSettings>) => void;
  setSliceResult: (r: SliceResult | null) => void;
  setSliceLayer: (n: number) => void;
  setSlicerProgress: (n: number) => void;
  setNavTab: (t: NavTab) => void;
  toggleActivity: (t: NavTab) => void;
  setNavOpen: (v: boolean) => void;
  setInspectorOpen: (v: boolean) => void;
  setCommandOpen: (v: boolean) => void;
  setSearchQuery: (q: string) => void;
  setReportOpen: (v: boolean) => void;
  setReportTab: (t: ReportTab) => void;
  select: (id: string | null) => void;
  updateParam: (featureId: string, key: string, value: number) => void;
  applyQuestionPatch: (patch: FeaturePatch, reply: string, questionId: string) => void;
  setUnits: (u: Units) => void;
  addMessage: (m: Omit<ChatMessage, "id"> & { id?: string }) => void;
  addFeature: (kind: FeatureKind) => void;
  removeFeature: (id: string) => void;
  toggleHidden: (id: string) => void;
  reset: () => void;
};

const emptyPipeline: PipelineStep[] = [
  { id: "route", label: "Media router", status: "pending" },
  { id: "trace", label: "Trace edges", status: "pending" },
  { id: "features", label: "Classify features", status: "pending" },
  { id: "param", label: "Parametric model", status: "pending" },
];

function writeDoc(
  parts: CadDocument[],
  next: CadDocument,
): CadDocument[] {
  return parts.map((p) => (p.id === next.id ? next : p));
}

export const useApp = create<AppState>((set, get) => ({
  phase: "intake",
  doc: null,
  parts: [],
  activeId: null,
  thumbs: {},
  chats: {},
  selectedId: null,
  messages: [],
  pipeline: emptyPipeline,
  busy: false,
  error: null,
  captureMode: null,
  sourceThumb: null,
  mobileTab: "capture",
  kitView: true,
  slicerOpen: false,
  slicerSettings: DEFAULT_SLICER,
  sliceResult: null,
  sliceLayer: 0,
  slicerProgress: -1,
  navTab: "project",
  navOpen: true,
  inspectorOpen: false,
  commandOpen: false,
  searchQuery: "",
  reportOpen: false,
  reportTab: "output",
  setPhase: (phase) => set({ phase }),
  setBusy: (busy) => set({ busy }),
  setError: (error) => set({ error }),
  setCaptureMode: (captureMode) => set({ captureMode }),
  setMobileTab: (mobileTab) => set({ mobileTab }),
  setKitView: (kitView) => set({ kitView }),
  setSlicerOpen: (slicerOpen) =>
    set({
      slicerOpen,
      mobileTab: slicerOpen ? "slice" : get().mobileTab === "slice" ? "talk" : get().mobileTab,
    }),
  patchSlicer: (p) =>
    set({
      slicerSettings: { ...get().slicerSettings, ...p },
      sliceResult: null,
      slicerProgress: -1,
    }),
  setSliceResult: (sliceResult) =>
    set({
      sliceResult,
      sliceLayer: sliceResult ? Math.max(0, sliceResult.layers.length - 1) : 0,
      slicerProgress: sliceResult ? 1 : -1,
      reportOpen: sliceResult ? true : get().reportOpen,
      reportTab: sliceResult ? "output" : get().reportTab,
    }),
  setSliceLayer: (sliceLayer) => set({ sliceLayer }),
  setSlicerProgress: (slicerProgress) => set({ slicerProgress }),
  setNavTab: (navTab) => set({ navTab, navOpen: true }),
  toggleActivity: (tab) => {
    const s = get();
    if (s.navOpen && s.navTab === tab) {
      set({ navOpen: false });
      return;
    }
    set({ navTab: tab, navOpen: true });
  },
  setNavOpen: (navOpen) => set({ navOpen }),
  setInspectorOpen: (inspectorOpen) => set({ inspectorOpen }),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setReportOpen: (reportOpen) => set({ reportOpen }),
  setReportTab: (reportTab) => set({ reportTab }),
  setPipeline: (pipeline) => set({ pipeline }),
  patchPipeline: (id, patch) =>
    set({
      pipeline: get().pipeline.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }),
  loadDoc: (doc, opts) => {
    const state = get();
    const exists = state.parts.some((p) => p.id === doc.id);
    const chats = { ...state.chats };
    if (state.activeId && state.activeId !== doc.id) {
      chats[state.activeId] = state.messages;
    }
    let messages = exists
      ? state.activeId === doc.id
        ? state.messages
        : (chats[doc.id] ?? [])
      : [];
    if (opts?.message) {
      messages = [
        ...messages,
        {
          id: uid("m"),
          role: "assistant",
          text: opts.message,
          questions: doc.questions.filter((q) => !q.answered),
        },
      ];
    }
    chats[doc.id] = messages;
    const thumbs = { ...state.thumbs };
    if (opts?.thumb !== undefined) thumbs[doc.id] = opts.thumb;
    const parts = exists ? writeDoc(state.parts, doc) : [...state.parts, doc];
    set({
      doc,
      parts,
      activeId: doc.id,
      thumbs,
      chats,
      messages,
      phase: "refine",
      selectedId: doc.features[0]?.id ?? null,
      sourceThumb: thumbs[doc.id] ?? null,
      error: null,
      busy: false,
      inspectorOpen: true,
      pipeline: state.pipeline.map((s) => ({ ...s, status: "done" as const })),
      mobileTab: "talk",
      kitView: parts.length > 1 ? true : state.kitView,
      sliceResult: null,
      slicerProgress: -1,
    });
  },
  setActive: (id) => {
    const state = get();
    const part = state.parts.find((p) => p.id === id);
    if (!part || state.activeId === id) return;
    const chats = { ...state.chats };
    if (state.activeId) chats[state.activeId] = state.messages;
    set({
      chats,
      activeId: id,
      doc: part,
      messages: chats[id] ?? [],
      sourceThumb: state.thumbs[id] ?? null,
      selectedId: part.features[0]?.id ?? null,
      mobileTab: "model",
      sliceResult: null,
    });
  },
  removePart: (id) => {
    const state = get();
    const parts = state.parts.filter((p) => p.id !== id);
    if (!parts.length) {
      get().reset();
      return;
    }
    const chats = { ...state.chats };
    if (state.activeId) chats[state.activeId] = state.messages;
    delete chats[id];
    const thumbs = { ...state.thumbs };
    delete thumbs[id];
    const next = state.activeId === id ? parts[0] : state.doc;
    const nextId = next?.id ?? parts[0].id;
    const part = parts.find((p) => p.id === nextId) ?? parts[0];
    set({
      parts,
      chats,
      thumbs,
      doc: part,
      activeId: part.id,
      messages: chats[part.id] ?? [],
      sourceThumb: thumbs[part.id] ?? null,
      selectedId: part.features[0]?.id ?? null,
      sliceResult: null,
    });
  },
  select: (selectedId) => set({ selectedId }),
  updateParam: (featureId, key, value) => {
    const doc = get().doc;
    if (!doc) return;
    const next = {
      ...doc,
      features: doc.features.map((f) =>
        f.id === featureId ? { ...f, params: { ...f.params, [key]: value } } : f,
      ),
    };
    set({ doc: next, parts: writeDoc(get().parts, next), sliceResult: null });
  },
  applyQuestionPatch: (patch, reply, questionId) => {
    const doc = get().doc;
    if (!doc) return;
    const thickness = !patch.featureId ? patch.params?.height : undefined;
    const rest: FeaturePatch =
      thickness !== undefined
        ? { ...patch, params: Object.fromEntries(Object.entries(patch.params ?? {}).filter(([k]) => k !== "height")) }
        : patch;
    let next = Object.keys(rest.params ?? {}).length || rest.featureId || rest.deleteFeature || rest.addFeatures || rest.units
      ? applyPatch(doc, rest)
      : { ...doc, features: doc.features.map((f) => ({ ...f, params: { ...f.params } })) };
    if (thickness !== undefined) next = applyThickness(next, thickness);
    next = {
      ...next,
      questions: next.questions.map((q) =>
        q.id === questionId ? { ...q, answered: reply } : q,
      ),
      confidence: Math.min(1, next.confidence + 0.12),
    };
    const messages = [
      ...get().messages.map((m) => ({
        ...m,
        questions: m.questions?.map((q) =>
          q.id === questionId ? { ...q, answered: reply } : q,
        ),
      })),
      { id: uid("m"), role: "user" as const, text: reply },
      {
        id: uid("m"),
        role: "assistant" as const,
        text: "Locked in. Anything else off?",
        questions: next.questions.filter((q) => !q.answered),
      },
    ];
    const chats = { ...get().chats, [next.id]: messages };
    set({
      doc: next,
      parts: writeDoc(get().parts, next),
      messages,
      chats,
      sliceResult: null,
    });
  },
  setUnits: (u) => {
    const doc = get().doc;
    if (!doc) return;
    if (doc.units === u) {
      const next = { ...doc, units: u };
      set({ doc: next, parts: writeDoc(get().parts, next), sliceResult: null });
      return;
    }
    const factor = u === "in" ? 1 / 25.4 : 25.4;
    const scaled = { ...scaleDoc(doc, factor), units: u };
    set({ doc: scaled, parts: writeDoc(get().parts, scaled), sliceResult: null });
  },
  addMessage: (m) => {
    const messages = [...get().messages, { id: m.id ?? uid("m"), ...m }];
    const id = get().activeId;
    set({
      messages,
      chats: id ? { ...get().chats, [id]: messages } : get().chats,
    });
  },
  addFeature: (kind) => {
    const doc = get().doc;
    if (!doc) return;
    const subtract = kind === "hole" || kind === "slot" || kind === "pocket";
    const f: CadFeature = {
      id: uid("f"),
      kind,
      name: kind.charAt(0).toUpperCase() + kind.slice(1),
      op: subtract ? "subtract" : "add",
      params: { ...KIND_DEFAULTS[kind] },
      position: { x: 0, y: subtract ? 5 : 10, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      axis: "y",
    };
    const next = { ...doc, features: [...doc.features, f] };
    set({
      doc: next,
      parts: writeDoc(get().parts, next),
      selectedId: f.id,
      sliceResult: null,
    });
  },
  removeFeature: (id) => {
    const doc = get().doc;
    if (!doc) return;
    const features = doc.features.filter((f) => f.id !== id);
    const next = { ...doc, features };
    set({
      doc: next,
      parts: writeDoc(get().parts, next),
      selectedId: get().selectedId === id ? (features[0]?.id ?? null) : get().selectedId,
      sliceResult: null,
    });
  },
  toggleHidden: (id) => {
    const doc = get().doc;
    if (!doc) return;
    const next = {
      ...doc,
      features: doc.features.map((f) => (f.id === id ? { ...f, hidden: !f.hidden } : f)),
    };
    set({ doc: next, parts: writeDoc(get().parts, next), sliceResult: null });
  },
  reset: () =>
    set({
      phase: "intake",
      doc: null,
      parts: [],
      activeId: null,
      thumbs: {},
      chats: {},
      selectedId: null,
      messages: [],
      pipeline: emptyPipeline,
      busy: false,
      error: null,
      captureMode: null,
      sourceThumb: null,
      mobileTab: "capture",
      kitView: true,
      slicerOpen: false,
      sliceResult: null,
      sliceLayer: 0,
      slicerProgress: -1,
      navTab: "project",
      navOpen: true,
      inspectorOpen: false,
      commandOpen: false,
      searchQuery: "",
      reportOpen: false,
      reportTab: "output",
    }),
}));
