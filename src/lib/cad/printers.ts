export type Firmware = "marlin" | "klipper";

export type MaterialId = "pla" | "petg" | "abs" | "tpu";

export type PrinterProfile = {
  id: string;
  name: string;
  brand: string;
  firmware: Firmware;
  bedX: number;
  bedY: number;
  bedZ: number;
  nozzle: number;
  filament: number;
  note: string;
};

export type MaterialProfile = {
  id: MaterialId;
  name: string;
  hotend: number;
  bed: number;
  density: number;
  fan: number;
  retract: number;
  speed: number;
};

export const MATERIALS: MaterialProfile[] = [
  { id: "pla", name: "PLA", hotend: 200, bed: 60, density: 1.24, fan: 255, retract: 0.8, speed: 60 },
  { id: "petg", name: "PETG", hotend: 240, bed: 80, density: 1.27, fan: 128, retract: 1.2, speed: 50 },
  { id: "abs", name: "ABS", hotend: 250, bed: 100, density: 1.04, fan: 40, retract: 0.8, speed: 50 },
  { id: "tpu", name: "TPU", hotend: 220, bed: 50, density: 1.21, fan: 80, retract: 0.4, speed: 28 },
];

export const PRINTERS: PrinterProfile[] = [
  {
    id: "ender3",
    name: "Ender 3 / Creality",
    brand: "Creality",
    firmware: "marlin",
    bedX: 220,
    bedY: 220,
    bedZ: 250,
    nozzle: 0.4,
    filament: 1.75,
    note: "Most common bed. SD card or OctoPrint on Mac and Windows.",
  },
  {
    id: "prusa-mk3",
    name: "Prusa MK3S / MK3.5",
    brand: "Prusa",
    firmware: "marlin",
    bedX: 250,
    bedY: 210,
    bedZ: 210,
    nozzle: 0.4,
    filament: 1.75,
    note: "Prusa firmware is Marlin-based. USB or SD on macOS and Windows.",
  },
  {
    id: "prusa-mk4",
    name: "Prusa MK4 / MK4S",
    brand: "Prusa",
    firmware: "marlin",
    bedX: 250,
    bedY: 210,
    bedZ: 220,
    nozzle: 0.4,
    filament: 1.75,
    note: "Input shaping Marlin. Same G-code path as MK3.",
  },
  {
    id: "bambu-p1",
    name: "Bambu P1 / X1",
    brand: "Bambu",
    firmware: "klipper",
    bedX: 256,
    bedY: 256,
    bedZ: 256,
    nozzle: 0.4,
    filament: 1.75,
    note: "Prefer 3MF into Bambu Studio (Mac & Windows). G-code is Klipper-flavoured.",
  },
  {
    id: "k1",
    name: "Creality K1 / K1 Max",
    brand: "Creality",
    firmware: "klipper",
    bedX: 220,
    bedY: 220,
    bedZ: 250,
    nozzle: 0.4,
    filament: 1.75,
    note: "Klipper. Fluidd / Creality Print on Mac and Windows.",
  },
  {
    id: "voron-250",
    name: "Voron 2.4 250",
    brand: "Voron",
    firmware: "klipper",
    bedX: 250,
    bedY: 250,
    bedZ: 250,
    nozzle: 0.4,
    filament: 1.75,
    note: "Mainsail or Fluidd from any desktop OS.",
  },
  {
    id: "elegoo-neptune",
    name: "Elegoo Neptune 3/4",
    brand: "Elegoo",
    firmware: "marlin",
    bedX: 220,
    bedY: 220,
    bedZ: 280,
    nozzle: 0.4,
    filament: 1.75,
    note: "Marlin. SD or Elegoo slicer on Mac and Windows.",
  },
  {
    id: "anycubic-kobra",
    name: "Anycubic Kobra",
    brand: "Anycubic",
    firmware: "marlin",
    bedX: 220,
    bedY: 220,
    bedZ: 250,
    nozzle: 0.4,
    filament: 1.75,
    note: "Marlin. SD card on either OS.",
  },
  {
    id: "generic-300",
    name: "Generic 300 mm",
    brand: "Generic",
    firmware: "marlin",
    bedX: 300,
    bedY: 300,
    bedZ: 300,
    nozzle: 0.4,
    filament: 1.75,
    note: "Larger bed, Marlin/Klipper-safe start. Use for custom machines.",
  },
];

export function printerById(id: string): PrinterProfile {
  return PRINTERS.find((p) => p.id === id) ?? PRINTERS[0];
}

export function materialById(id: MaterialId): MaterialProfile {
  return MATERIALS.find((m) => m.id === id) ?? MATERIALS[0];
}

export type InfillPattern = "rectilinear" | "grid" | "gyroid" | "triangles";
export type WallGenerator = "classic" | "arachne" | "both";

export type SlicerSettings = {
  printerId: string;
  material: MaterialId;
  layerHeight: number;
  walls: number;
  infill: number;
  infillPattern: InfillPattern;
  wallGenerator: WallGenerator;
  supports: boolean;
  brim: boolean;
  kit: boolean;
};

export const DEFAULT_SLICER: SlicerSettings = {
  printerId: "ender3",
  material: "pla",
  layerHeight: 0.2,
  walls: 2,
  infill: 20,
  infillPattern: "gyroid",
  wallGenerator: "both",
  supports: true,
  brim: false,
  kit: true,
};

export function startGcode(
  printer: PrinterProfile,
  mat: MaterialProfile,
  hotend: number,
  bed: number,
): string[] {
  const flavor = printer.firmware === "klipper" ? "Klipper" : "Marlin";
  const lines = [
    `; Graphite Universal Slicer`,
    `;FLAVOR:${flavor}`,
    `; Printer: ${printer.name}`,
    `; Material: ${mat.name}`,
    `; Compatible: macOS, Windows, Linux — SD, USB, OctoPrint, Fluidd, Mainsail`,
    `; No native slicer required. 3MF also opens in Cura, PrusaSlicer, Bambu Studio.`,
    "G90",
    "G21",
    "M83",
    "M107",
    `M140 S${bed}`,
    `M104 S${hotend}`,
  ];
  if (printer.firmware === "klipper") {
    lines.push("G28", `M190 S${bed}`, `M109 S${hotend}`, "G92 E0");
  } else {
    lines.push("G28", `M190 S${bed}`, `M109 S${hotend}`, "G92 E0");
  }
  const y2 = Math.min(printer.bedY - 10, 180);
  lines.push(
    "G1 Z2 F3000",
    `G1 X5 Y10 Z${0.3} F6000`,
    `G1 X5 Y${y2} Z0.3 F1500 E18`,
    `G1 X7 Y${y2} Z0.3 F6000`,
    `G1 X7 Y10 Z0.3 F1500 E36`,
    "G92 E0",
    "G1 E-0.6 F2100",
    "G1 Z1 F3000",
  );
  return lines;
}

export function endGcode(printer: PrinterProfile): string[] {
  const parkX = Math.max(0, printer.bedX - 10);
  const parkY = Math.max(0, printer.bedY - 10);
  return [
    "M107",
    "G1 E-2 F2100",
    "G91",
    "G1 Z8 F600",
    "G90",
    `G1 X${parkX} Y${parkY} F6000`,
    "M104 S0",
    "M140 S0",
    "M84",
    "M30",
  ];
}
