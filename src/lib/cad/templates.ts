import { uid } from "@/lib/utils";
import type { CadDocument, CadFeature, ClarifyingQuestion } from "./types";

const origin = { x: 0, y: 0, z: 0 };

function f(
  partial: Omit<CadFeature, "id" | "rotation"> & { rotation?: CadFeature["rotation"] },
): CadFeature {
  return {
    id: uid("f"),
    rotation: origin,
    ...partial,
  };
}

function q(
  prompt: string,
  why: string,
  options: ClarifyingQuestion["options"],
): ClarifyingQuestion {
  return { id: uid("q"), prompt, why, options };
}

export type TemplateId = "bracket" | "stand" | "enclosure" | "bushing";

export const TEMPLATES: Record<
  TemplateId,
  {
    title: string;
    blurb: string;
    mediaLabel: string;
    image: string;
    media: CadDocument["media"];
    build: () => CadDocument;
  }
> = {
  bracket: {
    title: "L-bracket",
    blurb: "Graph paper · 80 × 50 × 40",
    mediaLabel: "Graph paper",
    image: "/samples/bracket.jpg",
    media: "graph-paper",
    build: bracketDoc,
  },
  stand: {
    title: "Phone stand",
    blurb: "Napkin · wedge + slot",
    mediaLabel: "Napkin",
    image: "/samples/stand.jpg",
    media: "napkin",
    build: standDoc,
  },
  enclosure: {
    title: "Project box",
    blurb: "Whiteboard · 120 × 80 × 40",
    mediaLabel: "Whiteboard",
    image: "/samples/enclosure.jpg",
    media: "whiteboard",
    build: enclosureDoc,
  },
  bushing: {
    title: "Spacer bushing",
    blurb: "Coaster · Ø20 × 12",
    mediaLabel: "Coaster",
    image: "/samples/bushing.jpg",
    media: "coaster",
    build: bushingDoc,
  },
};

function bracketDoc(): CadDocument {
  const baseHoles = [
    f({
      kind: "hole",
      name: "Base hole A",
      op: "subtract",
      params: { radius: 2.5, depth: 5 },
      position: { x: -20, y: 1.5, z: 16 },
      axis: "y",
    }),
    f({
      kind: "hole",
      name: "Base hole B",
      op: "subtract",
      params: { radius: 2.5, depth: 5 },
      position: { x: 20, y: 1.5, z: 16 },
      axis: "y",
    }),
  ];
  const wallHoles = [
    f({
      kind: "hole",
      name: "Wall hole A",
      op: "subtract",
      params: { radius: 2.5, depth: 5 },
      position: { x: -20, y: 16, z: 1.5 },
      axis: "z",
    }),
    f({
      kind: "hole",
      name: "Wall hole B",
      op: "subtract",
      params: { radius: 2.5, depth: 5 },
      position: { x: 20, y: 16, z: 1.5 },
      axis: "z",
    }),
  ];
  return {
    id: uid("doc"),
    name: "Corner bracket",
    units: "mm",
    media: "graph-paper",
    pipelineNote: "5 mm grid on engineering paper. Legs read 80 × 50, upright 40, stock 3 mm.",
    confidence: 0.74,
    trust: "guesswork",
    notes:
      "Assumed 3 mm aluminum sheet. Hole diameters unlabeled — treating as M4 clearance (Ø5).",
    sourceLabel: "Graph paper sketch",
    features: [
      f({
        kind: "box",
        name: "Base flange",
        op: "add",
        params: { length: 80, width: 50, height: 3, fillet: 1 },
        position: { x: 0, y: 1.5, z: 25 },
      }),
      f({
        kind: "box",
        name: "Upright flange",
        op: "add",
        params: { length: 80, width: 3, height: 40, fillet: 1 },
        position: { x: 0, y: 20, z: 1.5 },
      }),
      ...baseHoles,
      ...wallHoles,
    ],
    questions: [
      q(
        "Hole size — the sketch marks centers but not a diameter.",
        "A 0.5 mm error here scrapes the bolt or the part.",
        [
          {
            label: "M4 clearance Ø5",
            reply: "M4 clearance, 5 mm holes",
            patch: { params: { radius: 2.5 } },
          },
          {
            label: "M3 clearance Ø3.4",
            reply: "M3 clearance",
            patch: { params: { radius: 1.7 } },
          },
          {
            label: "M5 clearance Ø5.5",
            reply: "M5 clearance",
            patch: { params: { radius: 2.75 } },
          },
        ],
      ),
      q("Stock thickness. Graph paper suggests 3 mm, but that is a guess.", "Sheet vs plate changes every other dimension.", [
        {
          label: "3 mm sheet",
          reply: "Keep 3 mm thickness",
          patch: { params: { height: 3 } },
        },
        {
          label: "4 mm plate",
          reply: "Make both flanges 4 mm thick",
          patch: { params: { height: 4 } },
        },
        {
          label: "6 mm plate",
          reply: "Make both flanges 6 mm thick",
          patch: { params: { height: 6 } },
        },
      ]),
    ],
  };
}

function standDoc(): CadDocument {
  return {
    id: uid("doc"),
    name: "Phone stand",
    units: "mm",
    media: "napkin",
    pipelineNote:
      "Napkin sketch, no grid. Perspective corrected. Wedge profile with a catch slot.",
    confidence: 0.61,
    trust: "guesswork",
    notes: "Proportions inferred from a typical 6-inch phone. Angle ~40° from the wedge.",
    sourceLabel: "Napkin sketch",
    features: [
      f({
        kind: "wedge",
        name: "Body",
        op: "add",
        params: { length: 82, width: 72, height: 58 },
        position: { x: 0, y: 0, z: 0 },
      }),
      f({
        kind: "slot",
        name: "Phone slot",
        op: "subtract",
        params: { length: 76, width: 10, depth: 12 },
        position: { x: 0, y: 14, z: 18 },
        axis: "y",
      }),
    ],
    questions: [
      q("Which phone size should the slot fit?", "Width of the slot and body follow this.", [
        {
          label: "Compact (~70 mm)",
          reply: "Fit a compact phone, 70 mm slot",
          patch: { featureId: "slot", params: { length: 70 } },
        },
        {
          label: "Standard (~76 mm)",
          reply: "Standard phone width",
          patch: {},
        },
        {
          label: "Pro Max (~80 mm)",
          reply: "Wide phone, 80 mm slot",
          patch: { params: { length: 80 } },
        },
      ]),
      q("Print this solid, or shell it to save filament?", "A 2 mm wall cuts print time in half.", [
        { label: "Solid", reply: "Keep it solid", patch: {} },
        { label: "2 mm shell", reply: "Shell the stand to 2 mm walls", patch: {} },
      ]),
    ],
  };
}

function enclosureDoc(): CadDocument {
  return {
    id: uid("doc"),
    name: "Project enclosure",
    units: "mm",
    media: "whiteboard",
    pipelineNote: "Whiteboard isometric. 120 × 80 × 40 box, four lid screws, USB cutout on a short wall.",
    confidence: 0.69,
    trust: "guesswork",
    notes: "3 mm walls. Interior pocket leaves a floor and a lid. USB on the +Z wall.",
    sourceLabel: "Whiteboard sketch",
    features: [
      f({
        kind: "box",
        name: "Outer shell",
        op: "add",
        params: { length: 120, width: 80, height: 40, fillet: 2 },
        position: { x: 0, y: 20, z: 0 },
      }),
      f({
        kind: "pocket",
        name: "Interior",
        op: "subtract",
        params: { length: 114, width: 74, depth: 34 },
        position: { x: 0, y: 20, z: 0 },
        axis: "y",
      }),
      f({
        kind: "hole",
        name: "Lid screw A",
        op: "subtract",
        params: { radius: 1.6, depth: 8 },
        position: { x: -52, y: 38, z: -32 },
        axis: "y",
      }),
      f({
        kind: "hole",
        name: "Lid screw B",
        op: "subtract",
        params: { radius: 1.6, depth: 8 },
        position: { x: 52, y: 38, z: -32 },
        axis: "y",
      }),
      f({
        kind: "hole",
        name: "Lid screw C",
        op: "subtract",
        params: { radius: 1.6, depth: 8 },
        position: { x: -52, y: 38, z: 32 },
        axis: "y",
      }),
      f({
        kind: "hole",
        name: "Lid screw D",
        op: "subtract",
        params: { radius: 1.6, depth: 8 },
        position: { x: 52, y: 38, z: 32 },
        axis: "y",
      }),
      f({
        kind: "slot",
        name: "USB cutout",
        op: "subtract",
        params: { length: 14, width: 8, depth: 8 },
        position: { x: 0, y: 10, z: 38 },
        axis: "z",
      }),
    ],
    questions: [
      q("USB cutout — data or power?", "The opening height changes.", [
        {
          label: "USB-C (9 × 3.5)",
          reply: "USB-C cutout",
          patch: { featureId: "usb", params: { length: 10, width: 4 } },
        },
        {
          label: "USB-A (16 × 8)",
          reply: "USB-A cutout",
          patch: {},
        },
        { label: "No cutout", reply: "Remove the USB cutout", patch: { deleteFeature: true } },
      ]),
      q("Lid screws — M3 as drawn, or press-fit heat inserts?", "Inserts need Ø4.6 bosses, not Ø3.2 through-holes.", [
        { label: "M3 through", reply: "Keep M3 through holes", patch: {} },
        { label: "Heat inserts", reply: "Switch lid holes to heat-insert bosses", patch: {} },
      ]),
    ],
  };
}

function bushingDoc(): CadDocument {
  return {
    id: uid("doc"),
    name: "Spacer bushing",
    units: "mm",
    media: "coaster",
    pipelineNote: "Coaster sketch. Two concentric circles and a side view. OD 20, ID 8, height 12.",
    confidence: 0.86,
    trust: "guesswork",
    notes: "Through-bore. No chamfer drawn — asking before adding.",
    sourceLabel: "Coaster sketch",
    features: [
      f({
        kind: "cylinder",
        name: "Body",
        op: "add",
        params: { radius: 10, height: 12 },
        position: { x: 0, y: 6, z: 0 },
        axis: "y",
      }),
      f({
        kind: "hole",
        name: "Bore",
        op: "subtract",
        params: { radius: 4, depth: 14 },
        position: { x: 0, y: 6, z: 0 },
        axis: "y",
      }),
    ],
    questions: [
      q("Bore fit. Ø8 as written — clearance, or press on a shaft?", "Press fits print undersize on FDM.", [
        {
          label: "Free running Ø8.2",
          reply: "Clearance bore 8.2 mm",
          patch: { featureId: "bore", params: { radius: 4.1 } },
        },
        { label: "As drawn Ø8.0", reply: "Keep 8 mm bore", patch: {} },
        {
          label: "Press Ø7.8",
          reply: "Press-fit 7.8 mm",
          patch: { params: { radius: 3.9 } },
        },
      ]),
      q("Break the sharp edges?", "A 0.4 mm chamfer helps it start on a shaft.", [
        { label: "Leave sharp", reply: "No chamfer", patch: {} },
        { label: "0.4 mm chamfer both ends", reply: "Add 0.4 mm chamfers", patch: {} },
      ]),
    ],
  };
}

export function listTemplates() {
  return (Object.keys(TEMPLATES) as TemplateId[]).map((id) => ({
    id,
    ...TEMPLATES[id],
  }));
}
