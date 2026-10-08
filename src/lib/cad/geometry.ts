import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import type { Axis, CadFeature, CadDocument, Vec3 } from "./types";
import { KIND_DEFAULTS } from "./types";

const DEG = Math.PI / 180;
const CUT_OVERSHOOT = 0.45;

function num(params: Record<string, number>, key: string, fallback: number) {
  const v = params[key];
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function applyAxis(geo: THREE.BufferGeometry, axis: Axis | undefined) {
  if (!axis || axis === "y") return geo;
  if (axis === "x") geo.rotateZ(-Math.PI / 2);
  if (axis === "z") geo.rotateX(Math.PI / 2);
  return geo;
}

function wedgeGeometry(length: number, width: number, height: number) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(width, 0);
  shape.lineTo(0, height);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: length,
    bevelEnabled: false,
    curveSegments: 1,
  });
  geo.translate(-width / 2, 0, -length / 2);
  geo.rotateY(-Math.PI / 2);
  // After this, length along X, base along Z, sits on y=0
  geo.computeVertexNormals();
  return geo;
}

function extrudeGeometry(feature: CadFeature) {
  const profile = feature.profile ?? [];
  const height = num(feature.params, "height", 8);
  if (profile.length < 3) {
    return new THREE.BoxGeometry(20, height, 20);
  }
  const shape = new THREE.Shape();
  shape.moveTo(profile[0].x, -profile[0].z);
  for (let i = 1; i < profile.length; i++) {
    shape.lineTo(profile[i].x, -profile[i].z);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false,
    curveSegments: 8,
  });
  geo.rotateX(-Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

export function featureGeometry(feature: CadFeature): THREE.BufferGeometry {
  const d = KIND_DEFAULTS[feature.kind];
  const p = feature.params;
  switch (feature.kind) {
    case "box": {
      const length = num(p, "length", d.length);
      const width = num(p, "width", d.width);
      const height = num(p, "height", d.height);
      const fillet = Math.min(
        num(p, "fillet", 0),
        Math.min(length, width, height) / 2 - 0.05,
      );
      if (fillet > 0.2) {
        const segs = Math.max(2, Math.ceil(fillet));
        return new RoundedBoxGeometry(length, height, width, segs, fillet);
      }
      return new THREE.BoxGeometry(length, height, width);
    }
    case "cylinder": {
      const r = num(p, "radius", d.radius);
      const h = num(p, "height", d.height);
      return applyAxis(new THREE.CylinderGeometry(r, r, h, 48), feature.axis);
    }
    case "sphere": {
      const r = num(p, "radius", d.radius);
      return new THREE.SphereGeometry(r, 32, 24);
    }
    case "cone": {
      const rb = num(p, "radiusBottom", d.radiusBottom);
      const rt = num(p, "radiusTop", d.radiusTop);
      const h = num(p, "height", d.height);
      return applyAxis(new THREE.CylinderGeometry(rt, rb, h, 40), feature.axis);
    }
    case "wedge": {
      return wedgeGeometry(
        num(p, "length", d.length),
        num(p, "width", d.width),
        num(p, "height", d.height),
      );
    }
    case "extrude":
      return extrudeGeometry(feature);
    case "hole": {
      const r = num(p, "radius", d.radius);
      const depth = num(p, "depth", d.depth) + CUT_OVERSHOOT;
      return applyAxis(new THREE.CylinderGeometry(r, r, depth, 36), feature.axis);
    }
    case "slot": {
      const length = num(p, "length", d.length);
      const width = num(p, "width", d.width);
      const depth = num(p, "depth", d.depth) + CUT_OVERSHOOT;
      const radius = Math.min(width / 2, length / 2);
      const shape = new THREE.Shape();
      const w = length / 2 - radius;
      const h = width / 2;
      if (w <= 0) {
        return applyAxis(
          new THREE.CylinderGeometry(width / 2, width / 2, depth, 28),
          feature.axis,
        );
      }
      shape.absarc(-w, 0, radius, Math.PI / 2, (Math.PI * 3) / 2, false);
      shape.absarc(w, 0, radius, (Math.PI * 3) / 2, Math.PI / 2, false);
      void h;
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: false,
        curveSegments: 16,
      });
      geo.translate(0, 0, -depth / 2);
      geo.rotateX(-Math.PI / 2);
      return applyAxis(geo, feature.axis);
    }
    case "pocket": {
      const length = num(p, "length", d.length);
      const width = num(p, "width", d.width);
      const depth = num(p, "depth", d.depth) + CUT_OVERSHOOT;
      const geo = new THREE.BoxGeometry(length, depth, width);
      return applyAxis(geo, feature.axis);
    }
    default:
      return new THREE.BoxGeometry(10, 10, 10);
  }
}

export function featureMatrix(feature: CadFeature): THREE.Matrix4 {
  const m = new THREE.Matrix4();
  const pos = feature.position;
  const rot = feature.rotation;
  const e = new THREE.Euler(rot.x * DEG, rot.y * DEG, rot.z * DEG, "XYZ");
  m.makeRotationFromEuler(e);
  m.setPosition(pos.x, pos.y, pos.z);
  return m;
}

export type BuiltSolid = {
  geometry: THREE.BufferGeometry;
  usedCsg: boolean;
};

let lastSolid: THREE.BufferGeometry | null = null;

export function getLastGeometry() {
  return lastSolid;
}

export async function buildSolid(features: CadFeature[]): Promise<BuiltSolid | null> {
  const visible = features.filter((f) => !f.hidden);
  const adds = visible.filter((f) => f.op === "add");
  const subs = visible.filter((f) => f.op === "subtract");
  if (adds.length === 0) return null;

  try {
    const { Brush, Evaluator, ADDITION, SUBTRACTION } = await import("three-bvh-csg");
    const evaluator = new Evaluator();
    evaluator.useGroups = false;
    const dummy = new THREE.MeshStandardMaterial();

    const toBrush = (f: CadFeature) => {
      const geo = featureGeometry(f);
      const brush = new Brush(geo, dummy);
      brush.position.set(f.position.x, f.position.y, f.position.z);
      brush.rotation.set(f.rotation.x * DEG, f.rotation.y * DEG, f.rotation.z * DEG);
      brush.updateMatrixWorld();
      return brush;
    };

    let acc = toBrush(adds[0]);
    for (let i = 1; i < adds.length; i++) {
      acc = evaluator.evaluate(acc, toBrush(adds[i]), ADDITION);
    }
    for (const s of subs) {
      acc = evaluator.evaluate(acc, toBrush(s), SUBTRACTION);
    }
    const geometry = acc.geometry.clone();
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    dummy.dispose();
    lastSolid = geometry;
    return { geometry, usedCsg: true };
  } catch {
    const group: THREE.BufferGeometry[] = [];
    for (const f of adds) {
      const geo = featureGeometry(f);
      geo.applyMatrix4(featureMatrix(f));
      group.push(geo);
    }
    const geometry = group[0];
    geometry.computeVertexNormals();
    lastSolid = geometry;
    return { geometry, usedCsg: false };
  }
}

export function measureDoc(doc: CadDocument): { min: Vec3; max: Vec3; size: Vec3 } {
  const box = new THREE.Box3();
  const tmp = new THREE.Box3();
  const empty = { min: { x: 0, y: 0, z: 0 }, max: { x: 0, y: 0, z: 0 }, size: { x: 0, y: 0, z: 0 } };
  let any = false;
  for (const f of doc.features) {
    if (f.hidden || f.op === "subtract") continue;
    const geo = featureGeometry(f);
    geo.applyMatrix4(featureMatrix(f));
    geo.computeBoundingBox();
    if (!geo.boundingBox) continue;
    tmp.copy(geo.boundingBox);
    if (!any) {
      box.copy(tmp);
      any = true;
    } else {
      box.union(tmp);
    }
    geo.dispose();
  }
  if (!any) return empty;
  const size = new THREE.Vector3();
  box.getSize(size);
  return {
    min: { x: box.min.x, y: box.min.y, z: box.min.z },
    max: { x: box.max.x, y: box.max.y, z: box.max.z },
    size: { x: size.x, y: size.y, z: size.z },
  };
}

export type PartLayout = {
  id: string;
  offset: Vec3;
  size: Vec3;
};

export function layoutParts(docs: CadDocument[], gap = 16): PartLayout[] {
  if (docs.length <= 1) {
    return docs.map((d) => ({ id: d.id, offset: { x: 0, y: 0, z: 0 }, size: measureDoc(d).size }));
  }
  let x = 0;
  const raw = docs.map((doc) => {
    const m = measureDoc(doc);
    const w = Math.max(m.size.x, 1);
    const offset: Vec3 = {
      x: x - m.min.x,
      y: -m.min.y,
      z: -(m.min.z + m.max.z) / 2,
    };
    x += w + gap;
    return { id: doc.id, offset, size: m.size };
  });
  const shift = (x - gap) / 2;
  return raw.map((r) => ({ ...r, offset: { ...r.offset, x: r.offset.x - shift } }));
}

export function scaleDoc(doc: CadDocument, factor: number): CadDocument {
  const scaleVec = (v: Vec3): Vec3 => ({ x: v.x * factor, y: v.y * factor, z: v.z * factor });
  return {
    ...doc,
    features: doc.features.map((f) => ({
      ...f,
      params: Object.fromEntries(
        Object.entries(f.params).map(([k, v]) => [k, v * factor]),
      ),
      position: scaleVec(f.position),
      profile: f.profile?.map((p) => ({ x: p.x * factor, z: p.z * factor })),
    })),
  };
}
