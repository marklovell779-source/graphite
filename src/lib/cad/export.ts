import { zipBlobs } from "@/lib/utils";
import * as THREE from "three";
import type { CadDocument } from "./types";
import { featureGeometry, featureMatrix, measureDoc } from "./geometry";

function collectPrintTriangles(geometry: THREE.BufferGeometry): Float32Array {
  const pos = geometry.getAttribute("position");
  const idx = geometry.getIndex();
  const tris: number[] = [];
  const v = (i: number) => {
    // Y-up three → Z-up print: (x, y, z) → (x, z, y)
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    return [x, z, y] as const;
  };
  const push = (a: number, b: number, c: number) => {
    const A = v(a);
    const B = v(b);
    const C = v(c);
    const e1 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]];
    const e2 = [C[0] - A[0], C[1] - A[1], C[2] - A[2]];
    let nx = e1[1] * e2[2] - e1[2] * e2[1];
    let ny = e1[2] * e2[0] - e1[0] * e2[2];
    let nz = e1[0] * e2[1] - e1[1] * e2[0];
    const len = Math.hypot(nx, ny, nz) || 1;
    nx /= len;
    ny /= len;
    nz /= len;
    tris.push(nx, ny, nz, ...A, ...B, ...C);
  };
  if (idx) {
    for (let i = 0; i < idx.count; i += 3) {
      push(idx.getX(i), idx.getX(i + 1), idx.getX(i + 2));
    }
  } else {
    for (let i = 0; i < pos.count; i += 3) push(i, i + 1, i + 2);
  }
  return new Float32Array(tris);
}

export function geometryToStl(geometry: THREE.BufferGeometry, name: string): Blob {
  const packed = collectPrintTriangles(geometry);
  const count = packed.length / 12;
  const buffer = new ArrayBuffer(84 + count * 50);
  const view = new DataView(buffer);
  const header = `Graphite ${name}`.slice(0, 80);
  for (let i = 0; i < 80; i++) view.setUint8(i, header.charCodeAt(i) || 0);
  view.setUint32(80, count, true);
  let o = 84;
  for (let t = 0; t < count; t++) {
    const b = t * 12;
    for (let k = 0; k < 12; k++) {
      view.setFloat32(o, packed[b + k], true);
      o += 4;
    }
    view.setUint16(o, 0, true);
    o += 2;
  }
  return new Blob([buffer], { type: "model/stl" });
}

export function fallbackGeometry(doc: CadDocument): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  for (const f of doc.features) {
    if (f.hidden || f.op === "subtract") continue;
    const g = featureGeometry(f);
    g.applyMatrix4(featureMatrix(f));
    geos.push(g);
  }
  if (geos.length === 0) return new THREE.BoxGeometry(10, 10, 10);
  if (geos.length === 1) return geos[0];
  const merged = geos[0];
  return merged;
}

export function documentToStep(doc: CadDocument): Blob {
  const mm = doc.units === "mm";
  const lines: string[] = [];
  let n = 1;
  const id = () => n++;
  const ids: Record<string, number> = {};
  const emit = (s: string) => {
    const i = id();
    lines.push(`#${i} = ${s};`);
    return i;
  };
  ids.app = emit("APPLICATION_CONTEXT('technical_data')");
  ids.origin = emit("CARTESIAN_POINT('origin',(0.0,0.0,0.0))");
  ids.dirZ = emit("DIRECTION('z',(0.0,0.0,1.0))");
  ids.dirX = emit("DIRECTION('x',(1.0,0.0,0.0))");
  ids.axis = emit(
    `AXIS2_PLACEMENT_3D('wcs',#${ids.origin},#${ids.dirZ},#${ids.dirX})`,
  );

  for (const f of doc.features) {
    if (f.hidden) continue;
    const p = f.params;
    const x = f.position.x;
    const y = f.position.z;
    const z = f.position.y;
    const pt = emit(
      `CARTESIAN_POINT('${f.name}',(${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}))`,
    );
    const place = emit(
      `AXIS2_PLACEMENT_3D('${f.name}_ax',#${pt},#${ids.dirZ},#${ids.dirX})`,
    );
    if (f.kind === "box" || f.kind === "pocket") {
      emit(
        `BLOCK('${f.name}',#${place},${(p.length ?? 10).toFixed(3)},${(p.width ?? 10).toFixed(3)},${(p.height ?? p.depth ?? 10).toFixed(3)})`,
      );
    } else if (f.kind === "cylinder" || f.kind === "hole") {
      emit(
        `RIGHT_CIRCULAR_CYLINDER('${f.name}',#${place},${(p.height ?? p.depth ?? 10).toFixed(3)},${(p.radius ?? 5).toFixed(3)})`,
      );
    } else if (f.kind === "sphere") {
      emit(`SPHERE('${f.name}',#${place},${(p.radius ?? 5).toFixed(3)})`);
    } else {
      emit(
        `BLOCK('${f.name}',#${place},${(p.length ?? 20).toFixed(3)},${(p.width ?? 20).toFixed(3)},${(p.height ?? 10).toFixed(3)})`,
      );
    }
  }

  const body = [
    "ISO-10303-21;",
    "HEADER;",
    "FILE_DESCRIPTION(('Graphite parametric solid'),'2;1');",
    `FILE_NAME('${doc.name.replace(/'/g, "")}.step','${new Date().toISOString()}',('Graphite'),('Graphite'),'Graphite CAD','Graphite','');`,
    "FILE_SCHEMA(('AUTOMOTIVE_DESIGN'));",
    "ENDSEC;",
    "DATA;",
    ...lines,
    "ENDSEC;",
    "END-ISO-10303-21;",
    `/* units: ${mm ? "millimetres" : "inches"} */`,
    "",
  ].join("\n");
  return new Blob([body], { type: "model/step" });
}

export function documentToGcode(doc: CadDocument): Blob {
  const m = measureDoc(doc);
  const unit = doc.units === "mm" ? "G21" : "G20";
  const safe = (m.max.y + 8).toFixed(3);
  const depth = Math.min(m.size.y || 2, 2).toFixed(3);
  const holes = doc.features.filter((f) => f.kind === "hole" && !f.hidden);
  const lines = [
    `; Graphite mill — ${doc.name}`,
    `; Stock ${m.size.x.toFixed(2)} × ${m.size.z.toFixed(2)} × ${m.size.y.toFixed(2)} ${doc.units}`,
    "G90 G94 G17",
    unit,
    "G0 Z" + safe,
    `G0 X${m.min.x.toFixed(3)} Y${m.min.z.toFixed(3)}`,
    "M3 S8000",
    `; Outer rectangle, ${depth}${doc.units} pass`,
    `G1 Z${(m.max.y - Number(depth)).toFixed(3)} F180`,
    `G1 X${m.max.x.toFixed(3)} F600`,
    `G1 Y${m.max.z.toFixed(3)}`,
    `G1 X${m.min.x.toFixed(3)}`,
    `G1 Y${m.min.z.toFixed(3)}`,
    "G0 Z" + safe,
  ];
  for (const h of holes) {
    const r = h.params.radius ?? 2.5;
    lines.push(
      `; Drill ${h.name} Ø${(r * 2).toFixed(2)}`,
      `G0 X${h.position.x.toFixed(3)} Y${h.position.z.toFixed(3)}`,
      `G81 Z${(h.position.y - (h.params.depth ?? 5)).toFixed(3)} R${safe} F120`,
      "G80",
    );
  }
  lines.push("G0 Z" + safe, "M5", "M30", "");
  return new Blob([lines.join("\n")], { type: "text/plain" });
}

function printVerts(geometry: THREE.BufferGeometry): { verts: number[]; tris: number[] } {
  const pos = geometry.getAttribute("position");
  const idx = geometry.getIndex();
  const map = new Map<string, number>();
  const verts: number[] = [];
  const tris: number[] = [];
  let minZ = Infinity;
  const weld = (i: number) => {
    const x = pos.getX(i);
    const y = pos.getZ(i);
    const z = pos.getY(i);
    if (z < minZ) minZ = z;
    const k = `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`;
    const existing = map.get(k);
    if (existing !== undefined) return existing;
    const n = map.size;
    map.set(k, n);
    verts.push(x, y, z);
    return n;
  };
  const push = (a: number, b: number, c: number) => {
    tris.push(weld(a), weld(b), weld(c));
  };
  if (idx) {
    for (let i = 0; i < idx.count; i += 3) push(idx.getX(i), idx.getX(i + 1), idx.getX(i + 2));
  } else {
    for (let i = 0; i < pos.count; i += 3) push(i, i + 1, i + 2);
  }
  if (Number.isFinite(minZ) && Math.abs(minZ) > 1e-6) {
    for (let i = 2; i < verts.length; i += 3) verts[i] -= minZ;
  }
  return { verts, tris };
}

export async function geometryTo3mf(geometry: THREE.BufferGeometry, name: string): Promise<Blob> {
  const { verts, tris } = printVerts(geometry);
  const safe = name.replace(/[<>&'"]/g, "");
  const vxml: string[] = [];
  for (let i = 0; i < verts.length; i += 3) {
    vxml.push(
      `        <vertex x="${verts[i].toFixed(4)}" y="${verts[i + 1].toFixed(4)}" z="${verts[i + 2].toFixed(4)}" />`,
    );
  }
  const txml: string[] = [];
  for (let i = 0; i < tris.length; i += 3) {
    txml.push(`        <triangle v1="${tris[i]}" v2="${tris[i + 1]}" v3="${tris[i + 2]}" />`);
  }
  const model = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<model unit="millimeter" xml:lang="en-US" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">`,
    `  <metadata name="Title">${safe}</metadata>`,
    `  <metadata name="Application">Graphite Universal Slicer</metadata>`,
    `  <resources>`,
    `    <object id="1" name="${safe}" type="model">`,
    `      <mesh>`,
    `        <vertices>`,
    ...vxml,
    `        </vertices>`,
    `        <triangles>`,
    ...txml,
    `        </triangles>`,
    `      </mesh>`,
    `    </object>`,
    `  </resources>`,
    `  <build>`,
    `    <item objectid="1" />`,
    `  </build>`,
    `</model>`,
    ``,
  ].join("\n");
  const types = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">`,
    `  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>`,
    `  <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>`,
    `</Types>`,
    ``,
  ].join("\n");
  const rels = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`,
    `  <Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>`,
    `</Relationships>`,
    ``,
  ].join("\n");
  const zip = await zipBlobs([
    { name: "[Content_Types].xml", blob: new Blob([types], { type: "application/xml" }) },
    { name: "_rels/.rels", blob: new Blob([rels], { type: "application/xml" }) },
    { name: "3D/3dmodel.model", blob: new Blob([model], { type: "application/vnd.ms-package.3dmanufacturing-3dmodel+xml" }) },
  ]);
  return new Blob([zip], { type: "model/3mf" });
}

export function slicerReadme(partName: string): Blob {
  const body = [
    `Graphite Universal Slicer`,
    `Part: ${partName}`,
    ``,
    `Works on macOS, Windows, and Linux. No .dmg or .exe.`,
    ``,
    `PRINT NOW`,
    `  Copy the .gcode file to an SD card, USB stick, OctoPrint, Fluidd, or Mainsail.`,
    `  Firmware flavours: Marlin, Klipper, RepRap. Same file on Mac or PC.`,
    ``,
    `OPEN IN A DESKTOP SLICER`,
    `  The .3mf opens in:`,
    `  • UltiMaker Cura (macOS & Windows)`,
    `  • PrusaSlicer / SuperSlicer (macOS & Windows)`,
    `  • Bambu Studio / OrcaSlicer (macOS & Windows)`,
    `  • IdeaMaker`,
    `  Use this if you want to tweak supports or a machine profile.`,
    ``,
    `MESH`,
    `  The .stl is a raw solid for any CAD tool or slicer.`,
    ``,
  ].join("\n");
  return new Blob([body], { type: "text/plain" });
}

