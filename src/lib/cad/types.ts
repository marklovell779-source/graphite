export type Units = "mm" | "in";

export type FeatureKind =
  | "box"
  | "cylinder"
  | "sphere"
  | "cone"
  | "wedge"
  | "extrude"
  | "hole"
  | "slot"
  | "pocket";

export type FeatureOp = "add" | "subtract";

export type Axis = "x" | "y" | "z";

export type Vec3 = { x: number; y: number; z: number };

export type ProfilePt = { x: number; z: number };

export type CadFeature = {
  id: string;
  kind: FeatureKind;
  name: string;
  op: FeatureOp;
  params: Record<string, number>;
  position: Vec3;
  rotation: Vec3;
  axis?: Axis;
  profile?: ProfilePt[];
  hidden?: boolean;
};

export type FeaturePatch = {
  featureId?: string;
  params?: Record<string, number>;
  position?: Partial<Vec3>;
  rotation?: Partial<Vec3>;
  name?: string;
  hidden?: boolean;
  deleteFeature?: boolean;
  addFeatures?: CadFeature[];
  units?: Units;
  docName?: string;
};

export type ClarifyingOption = {
  label: string;
  reply: string;
  patch?: FeaturePatch;
};

export type ClarifyingQuestion = {
  id: string;
  prompt: string;
  why: string;
  options: ClarifyingOption[];
  answered?: string;
};

export type MediaKind =
  | "graph-paper"
  | "napkin"
  | "whiteboard"
  | "coaster"
  | "photo"
  | "voice"
  | "gesture"
  | "describe"
  | "template";

export type PipelineStep = {
  id: string;
  label: string;
  status: "pending" | "active" | "done" | "skip";
  detail?: string;
};

export type CadDocument = {
  id: string;
  name: string;
  units: Units;
  media: MediaKind;
  pipelineNote: string;
  features: CadFeature[];
  questions: ClarifyingQuestion[];
  confidence: number;
  notes: string;
  sourceLabel?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  questions?: ClarifyingQuestion[];
};

export type Phase = "intake" | "recognize" | "refine";

export const PARAM_META: Record<
  FeatureKind,
  { key: string; label: string; min: number; max: number; step: number }[]
> = {
  box: [
    { key: "length", label: "Length X", min: 1, max: 400, step: 0.5 },
    { key: "width", label: "Width Z", min: 1, max: 400, step: 0.5 },
    { key: "height", label: "Height Y", min: 0.5, max: 400, step: 0.1 },
    { key: "fillet", label: "Fillet", min: 0, max: 40, step: 0.1 },
  ],
  cylinder: [
    { key: "radius", label: "Radius", min: 0.5, max: 200, step: 0.1 },
    { key: "height", label: "Height", min: 0.5, max: 400, step: 0.1 },
  ],
  sphere: [{ key: "radius", label: "Radius", min: 0.5, max: 200, step: 0.1 }],
  cone: [
    { key: "radiusBottom", label: "Base R", min: 0, max: 200, step: 0.1 },
    { key: "radiusTop", label: "Top R", min: 0, max: 200, step: 0.1 },
    { key: "height", label: "Height", min: 0.5, max: 400, step: 0.1 },
  ],
  wedge: [
    { key: "length", label: "Length X", min: 1, max: 400, step: 0.5 },
    { key: "width", label: "Base Z", min: 1, max: 400, step: 0.5 },
    { key: "height", label: "Height Y", min: 1, max: 400, step: 0.5 },
  ],
  extrude: [{ key: "height", label: "Height", min: 0.5, max: 400, step: 0.1 }],
  hole: [
    { key: "radius", label: "Radius", min: 0.4, max: 80, step: 0.05 },
    { key: "depth", label: "Depth", min: 0.5, max: 400, step: 0.1 },
  ],
  slot: [
    { key: "length", label: "Length", min: 1, max: 400, step: 0.5 },
    { key: "width", label: "Width", min: 0.5, max: 80, step: 0.1 },
    { key: "depth", label: "Depth", min: 0.5, max: 400, step: 0.1 },
  ],
  pocket: [
    { key: "length", label: "Length", min: 1, max: 400, step: 0.5 },
    { key: "width", label: "Width", min: 1, max: 400, step: 0.5 },
    { key: "depth", label: "Depth", min: 0.5, max: 400, step: 0.1 },
  ],
};

export const KIND_DEFAULTS: Record<FeatureKind, Record<string, number>> = {
  box: { length: 40, width: 40, height: 10, fillet: 0 },
  cylinder: { radius: 10, height: 20 },
  sphere: { radius: 12 },
  cone: { radiusBottom: 12, radiusTop: 0, height: 24 },
  wedge: { length: 80, width: 70, height: 50 },
  extrude: { height: 8 },
  hole: { radius: 2.5, depth: 12 },
  slot: { length: 24, width: 6, depth: 8 },
  pocket: { length: 30, width: 20, depth: 6 },
};
