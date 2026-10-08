import * as THREE from "three";
import { buildSolid, layoutParts } from "./geometry";
import {
  DEFAULT_SLICER,
  endGcode,
  materialById,
  printerById,
  startGcode,
  type SlicerSettings,
} from "./printers";
import type { CadDocument } from "./types";
import type { InfillPattern, WallGenerator } from "./printers";

export type Pt = { x: number; y: number };

export type LayerPaths = {
  z: number;
  perimeters: Pt[][];
  infill: Pt[][];
  skirt: Pt[][];
  support: Pt[][];
  bridge: Pt[][];
  islands: Pt[][];
};

export type SliceStats = {
  layers: number;
  pathMm: number;
  travelMm: number;
  filamentMm: number;
  filamentGrams: number;
  timeSec: number;
  fitsBed: boolean;
  sizeX: number;
  sizeY: number;
  sizeZ: number;
  originX: number;
  originY: number;
};

export type SliceResult = {
  layers: LayerPaths[];
  settings: SlicerSettings;
  printerId: string;
  sourceKey: string;
  stats: SliceStats;
  gcode: string;
};

export function sliceSourceKey(docs: CadDocument[], settings: SlicerSettings) {
  return JSON.stringify({
    kit: settings.kit,
    units: docs.map((d) => d.units),
    ids: docs.map((d) => d.id),
    s: settings,
    f: docs.map((d) =>
      d.features.map((x) => [x.id, x.kind, x.op, x.hidden, x.params, x.position, x.rotation, x.axis]),
    ),
  });
}

function collectPrintTris(geo: THREE.BufferGeometry, ox: number, oy: number, oz: number, scale: number): number[] {
  const pos = geo.getAttribute("position");
  const idx = geo.getIndex();
  const out: number[] = [];
  const push = (i: number) => {
    const x = (pos.getX(i) + ox) * scale;
    const y = (pos.getY(i) + oy) * scale;
    const z = (pos.getZ(i) + oz) * scale;
    out.push(x, z, y);
  };
  if (idx) {
    for (let i = 0; i < idx.count; i++) push(idx.getX(i));
  } else {
    for (let i = 0; i < pos.count; i++) push(i);
  }
  return out;
}

function bbox(tris: number[]) {
  let minX = Infinity,
    minY = Infinity,
    minZ = Infinity,
    maxX = -Infinity,
    maxY = -Infinity,
    maxZ = -Infinity;
  for (let i = 0; i < tris.length; i += 3) {
    const x = tris[i];
    const y = tris[i + 1];
    const z = tris[i + 2];
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (z < minZ) minZ = z;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
    if (z > maxZ) maxZ = z;
  }
  return { minX, minY, minZ, maxX, maxY, maxZ };
}

function dropToBed(tris: number[], minZ: number) {
  if (Math.abs(minZ) < 1e-6) return;
  for (let i = 2; i < tris.length; i += 3) tris[i] -= minZ;
}

function intersectTri(tris: number[], i: number, z: number, eps: number): [number, number, number, number] | null {
  const ax = tris[i],
    ay = tris[i + 1],
    az = tris[i + 2];
  const bx = tris[i + 3],
    by = tris[i + 4],
    bz = tris[i + 5];
  const cx = tris[i + 6],
    cy = tris[i + 7],
    cz = tris[i + 8];
  if ((az > z + eps && bz > z + eps && cz > z + eps) || (az < z - eps && bz < z - eps && cz < z - eps)) {
    return null;
  }
  if (Math.abs(az - z) < eps && Math.abs(bz - z) < eps && Math.abs(cz - z) < eps) return null;
  const pts: number[] = [];
  const edge = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) => {
    const d0 = z0 - z;
    const d1 = z1 - z;
    if (Math.abs(d0) < eps && Math.abs(d1) < eps) return;
    if (Math.abs(d0) < eps) {
      pts.push(x0, y0);
      return;
    }
    if (d0 * d1 < 0) {
      const t = d0 / (d0 - d1);
      pts.push(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t);
    }
  };
  edge(ax, ay, az, bx, by, bz);
  edge(bx, by, bz, cx, cy, cz);
  edge(cx, cy, cz, ax, ay, az);
  if (pts.length < 4) return null;
  if (pts.length > 4) {
    return [pts[0], pts[1], pts[2], pts[3]];
  }
  const dx = pts[2] - pts[0];
  const dy = pts[3] - pts[1];
  if (dx * dx + dy * dy < 1e-10) return null;
  return [pts[0], pts[1], pts[2], pts[3]];
}

function qkey(x: number, y: number, step = 0.03) {
  return `${Math.round(x / step)}:${Math.round(y / step)}`;
}

function stitch(segs: number[]): Pt[][] {
  const n = segs.length / 4;
  if (n === 0) return [];
  const adj = new Map<string, number[]>();
  const add = (k: string, i: number) => {
    const a = adj.get(k);
    if (a) a.push(i);
    else adj.set(k, [i]);
  };
  for (let i = 0; i < n; i++) {
    add(qkey(segs[i * 4], segs[i * 4 + 1]), i);
    add(qkey(segs[i * 4 + 2], segs[i * 4 + 3]), i);
  }
  const used = new Uint8Array(n);
  const loops: Pt[][] = [];
  for (let i = 0; i < n; i++) {
    if (used[i]) continue;
    used[i] = 1;
    const pts: Pt[] = [
      { x: segs[i * 4], y: segs[i * 4 + 1] },
      { x: segs[i * 4 + 2], y: segs[i * 4 + 3] },
    ];
    let hx = segs[i * 4 + 2];
    let hy = segs[i * 4 + 3];
    let guard = 0;
    while (guard++ < n + 2) {
      const cands = adj.get(qkey(hx, hy));
      if (!cands) break;
      let next = -1;
      let nx = 0;
      let ny = 0;
      for (const ci of cands) {
        if (used[ci]) continue;
        used[ci] = 1;
        next = ci;
        const ax = segs[ci * 4],
          ay = segs[ci * 4 + 1],
          bx = segs[ci * 4 + 2],
          by = segs[ci * 4 + 3];
        if (qkey(ax, ay) === qkey(hx, hy)) {
          nx = bx;
          ny = by;
        } else {
          nx = ax;
          ny = ay;
        }
        break;
      }
      if (next < 0) break;
      hx = nx;
      hy = ny;
      pts.push({ x: nx, y: ny });
      if (qkey(hx, hy) === qkey(pts[0].x, pts[0].y)) break;
    }
    const cleaned = dedupe(pts);
    if (cleaned.length >= 3) loops.push(cleaned);
  }
  return loops;
}

function dedupe(pts: Pt[]): Pt[] {
  const out: Pt[] = [];
  const minD = 0.04;
  for (const p of pts) {
    const last = out[out.length - 1];
    if (!last || (p.x - last.x) ** 2 + (p.y - last.y) ** 2 > minD * minD) out.push(p);
  }
  if (out.length > 2) {
    const a = out[0];
    const b = out[out.length - 1];
    if ((a.x - b.x) ** 2 + (a.y - b.y) ** 2 < minD * minD) out.pop();
  }
  return out;
}

function area(pts: Pt[]) {
  let a = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    a += pts[j].x * pts[i].y - pts[i].x * pts[j].y;
  }
  return a / 2;
}

function reverse(pts: Pt[]) {
  const c = pts.slice();
  c.reverse();
  return c;
}

function pointInPoly(pt: Pt, poly: Pt[]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const ai = poly[i];
    const bj = poly[j];
    if (ai.y > pt.y !== bj.y > pt.y) {
      const x = ((bj.x - ai.x) * (pt.y - ai.y)) / (bj.y - ai.y || 1e-12) + ai.x;
      if (pt.x < x) inside = !inside;
    }
  }
  return inside;
}

function forceWinding(loops: Pt[][]): Pt[][] {
  return loops.map((loop, i) => {
    const p = loop[0];
    let depth = 0;
    for (let j = 0; j < loops.length; j++) {
      if (i === j) continue;
      if (pointInPoly(p, loops[j])) depth++;
    }
    const a = area(loop);
    const wantCCW = depth % 2 === 0;
    if (wantCCW && a < 0) return reverse(loop);
    if (!wantCCW && a > 0) return reverse(loop);
    return loop;
  });
}

function flowSpacing(width: number, lh: number) {
  return Math.max(0.2, width - lh * (1 - Math.PI / 4));
}

function insideSolid(pt: Pt, loops: Pt[][]) {
  let n = 0;
  for (const loop of loops) if (pointInPoly(pt, loop)) n++;
  return n % 2 === 1;
}

function rotateSeam(loop: Pt[]): Pt[] {
  if (loop.length < 3) return loop;
  let best = 0;
  let score = Infinity;
  for (let i = 0; i < loop.length; i++) {
    const s = loop[i].x + loop[i].y * 2;
    if (s < score) {
      score = s;
      best = i;
    }
  }
  if (best === 0) return loop;
  return loop.slice(best).concat(loop.slice(0, best));
}

function insetTowardSolid(loop: Pt[], dist: number): Pt[] | null {
  const signed = area(loop) >= 0 ? dist : -dist;
  return offsetLoop(loop, signed);
}

function offsetLoop(pts: Pt[], dist: number): Pt[] | null {
  const n = pts.length;
  if (n < 3) return null;
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    let e1x = p1.x - p0.x,
      e1y = p1.y - p0.y;
    let e2x = p2.x - p1.x,
      e2y = p2.y - p1.y;
    const l1 = Math.hypot(e1x, e1y) || 1;
    const l2 = Math.hypot(e2x, e2y) || 1;
    e1x /= l1;
    e1y /= l1;
    e2x /= l2;
    e2y /= l2;
    const n1x = -e1y,
      n1y = e1x;
    const n2x = -e2y,
      n2y = e2x;
    let nx = n1x + n2x,
      ny = n1y + n2y;
    const nl = Math.hypot(nx, ny);
    if (nl < 1e-6) {
      out.push({ x: p1.x + n1x * dist, y: p1.y + n1y * dist });
      continue;
    }
    nx /= nl;
    ny /= nl;
    const d = nx * n1x + ny * n1y;
    let miter = dist / Math.max(0.25, d);
    if (Math.abs(miter) > Math.abs(dist) * 4) miter = dist * 4 * Math.sign(miter || 1);
    out.push({ x: p1.x + nx * miter, y: p1.y + ny * miter });
  }
  const a0 = area(pts);
  const a1 = area(out);
  if (a0 === 0 || a1 === 0) return null;
  if (Math.sign(a0) !== Math.sign(a1)) return null;
  if (Math.abs(a1) < 0.2) return null;
  return out;
}

function clipLines(y: number, x0: number, x1: number, loops: Pt[][]): Pt[][] {
  const xs: number[] = [];
  for (const loop of loops) {
    for (let i = 0, j = loop.length - 1; i < loop.length; j = i++) {
      const a = loop[j];
      const b = loop[i];
      if ((a.y > y) === (b.y > y)) continue;
      const t = (y - a.y) / (b.y - a.y || 1e-12);
      xs.push(a.x + (b.x - a.x) * t);
    }
  }
  xs.sort((p, q) => p - q);
  const uniq: number[] = [];
  for (const x of xs) {
    if (!uniq.length || Math.abs(x - uniq[uniq.length - 1]) > 0.03) uniq.push(x);
  }
  const segs: Pt[][] = [];
  for (let i = 0; i + 1 < uniq.length; i += 2) {
    const a = Math.max(x0, uniq[i]);
    const b = Math.min(x1, uniq[i + 1]);
    if (b - a > 0.2) segs.push([{ x: a, y }, { x: b, y }]);
  }
  return segs;
}

function clipLinesV(x: number, y0: number, y1: number, loops: Pt[][]): Pt[][] {
  const ys: number[] = [];
  for (const loop of loops) {
    for (let i = 0, j = loop.length - 1; i < loop.length; j = i++) {
      const a = loop[j];
      const b = loop[i];
      if ((a.x > x) === (b.x > x)) continue;
      const t = (x - a.x) / (b.x - a.x || 1e-12);
      ys.push(a.y + (b.y - a.y) * t);
    }
  }
  ys.sort((p, q) => p - q);
  const uniq: number[] = [];
  for (const y of ys) {
    if (!uniq.length || Math.abs(y - uniq[uniq.length - 1]) > 0.03) uniq.push(y);
  }
  const segs: Pt[][] = [];
  for (let i = 0; i + 1 < uniq.length; i += 2) {
    const a = Math.max(y0, uniq[i]);
    const b = Math.min(y1, uniq[i + 1]);
    if (b - a > 0.2) segs.push([{ x, y: a }, { x, y: b }]);
  }
  return segs;
}

function infillFor(
  loops: Pt[][],
  bounds: { minX: number; minY: number; maxX: number; maxY: number },
  spacing: number,
  vertical: boolean,
): Pt[][] {
  if (spacing < 0.3) spacing = 0.3;
  const pad = 0.2;
  const out: Pt[][] = [];
  if (vertical) {
    const x0 = bounds.minX + pad;
    const x1 = bounds.maxX - pad;
    for (let x = x0; x <= x1 + 1e-6; x += spacing) {
      out.push(...clipLinesV(x, bounds.minY, bounds.maxY, loops));
    }
  } else {
    const y0 = bounds.minY + pad;
    const y1 = bounds.maxY - pad;
    for (let y = y0; y <= y1 + 1e-6; y += spacing) {
      out.push(...clipLines(y, bounds.minX, bounds.maxX, loops));
    }
  }
  return out;
}

function clipAngle(loops: Pt[][], bounds: { minX: number; minY: number; maxX: number; maxY: number }, spacing: number, deg: number): Pt[][] {
  const rad = (deg * Math.PI) / 180;
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  const cx = (bounds.minX + bounds.maxX) / 2;
  const cy = (bounds.minY + bounds.maxY) / 2;
  const rot = (p: Pt): Pt => {
    const dx = p.x - cx;
    const dy = p.y - cy;
    return { x: dx * c + dy * s + cx, y: -dx * s + dy * c + cy };
  };
  const unrot = (p: Pt): Pt => {
    const dx = p.x - cx;
    const dy = p.y - cy;
    return { x: dx * c - dy * s + cx, y: dx * s + dy * c + cy };
  };
  const mapped = loops.map((loop) => loop.map(rot));
  const b = loopBounds(mapped);
  const segs = infillFor(mapped, b, spacing, false);
  return segs.map((seg) => seg.map(unrot));
}

function gyroidInfill(loops: Pt[][], bounds: { minX: number; minY: number; maxX: number; maxY: number }, z: number, period: number): Pt[][] {
  const k = (Math.PI * 2) / Math.max(4, period);
  const step = Math.min(period / 6, 1.2);
  const cz = Math.cos(k * z);
  const sz = Math.sin(k * z);
  const f = (x: number, y: number) => Math.sin(k * x) * Math.cos(k * y) + Math.sin(k * y) * cz + sz * Math.cos(k * x);
  const segs: Pt[][] = [];
  const x0 = bounds.minX - step;
  const y0 = bounds.minY - step;
  const x1 = bounds.maxX + step;
  const y1 = bounds.maxY + step;
  for (let y = y0; y < y1; y += step) {
    for (let x = x0; x < x1; x += step) {
      const corners: [number, number, number][] = [
        [x, y, f(x, y)],
        [x + step, y, f(x + step, y)],
        [x + step, y + step, f(x + step, y + step)],
        [x, y + step, f(x, y + step)],
      ];
      const pts: Pt[] = [];
      for (let i = 0; i < 4; i++) {
        const a = corners[i];
        const b = corners[(i + 1) % 4];
        if (a[2] === 0) pts.push({ x: a[0], y: a[1] });
        else if (a[2] * b[2] < 0) {
          const t = a[2] / (a[2] - b[2]);
          pts.push({ x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t });
        }
      }
      if (pts.length >= 2) {
        const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
        if (insideSolid(mid, loops)) segs.push([pts[0], pts[1]]);
      }
    }
  }
  return segs;
}

function monotonicize(segs: Pt[][]): Pt[][] {
  const lined = segs.map((s) => {
    if (s.length < 2) return s;
    const a = s[0];
    const b = s[s.length - 1];
    return a.x <= b.x ? s : reverse(s);
  });
  lined.sort((a, b) => {
    const ay = (a[0].y + a[a.length - 1].y) / 2;
    const by = (b[0].y + b[b.length - 1].y) / 2;
    return ay - by || a[0].x - b[0].x;
  });
  return lined;
}

function sparseInfill(
  loops: Pt[][],
  bounds: { minX: number; minY: number; maxX: number; maxY: number },
  lineW: number,
  lh: number,
  pct: number,
  pattern: InfillPattern,
  z: number,
  layerIndex: number,
): Pt[][] {
  if (pct <= 0) return [];
  const sp = flowSpacing(lineW, lh);
  const pitch = sp / (pct / 100);
  if (pitch > 80) return [];
  if (pattern === "grid") {
    return [...infillFor(loops, bounds, pitch * 2, false), ...infillFor(loops, bounds, pitch * 2, true)];
  }
  if (pattern === "triangles") {
    const p = pitch * 3;
    return [...clipAngle(loops, bounds, p, 0), ...clipAngle(loops, bounds, p, 60), ...clipAngle(loops, bounds, p, 120)];
  }
  if (pattern === "gyroid") {
    const period = Math.max(5, Math.min(18, 8 / Math.sqrt(Math.max(pct, 8) / 100)));
    return gyroidInfill(loops, bounds, z, period);
  }
  return infillFor(loops, bounds, pitch, layerIndex % 2 === 1);
}

function loopBounds(loops: Pt[][]) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const loop of loops) {
    for (const p of loop) {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }
  }
  return { minX, minY, maxX, maxY };
}

function rectLoop(b: { minX: number; minY: number; maxX: number; maxY: number }, pad: number): Pt[] {
  return [
    { x: b.minX - pad, y: b.minY - pad },
    { x: b.maxX + pad, y: b.minY - pad },
    { x: b.maxX + pad, y: b.maxY + pad },
    { x: b.minX - pad, y: b.maxY + pad },
  ];
}

type Occupancy = {
  w: number;
  h: number;
  res: number;
  ox: number;
  oy: number;
  data: Uint8Array;
};

function occupancy(bounds: { minX: number; minY: number; maxX: number; maxY: number }, res: number): Occupancy {
  const w = Math.max(2, Math.ceil((bounds.maxX - bounds.minX) / res) + 3);
  const h = Math.max(2, Math.ceil((bounds.maxY - bounds.minY) / res) + 3);
  return { w, h, res, ox: bounds.minX - res, oy: bounds.minY - res, data: new Uint8Array(w * h) };
}

function paintIslands(grid: Occupancy, loops: Pt[][]) {
  grid.data.fill(0);
  if (!loops.length) return;
  const { w, h, res, ox, oy, data } = grid;
  for (let iy = 0; iy < h; iy++) {
    const y = oy + (iy + 0.5) * res;
    const xs: number[] = [];
    for (const loop of loops) {
      for (let i = 0, j = loop.length - 1; i < loop.length; j = i++) {
        const a = loop[j];
        const b = loop[i];
        if ((a.y > y) === (b.y > y)) continue;
        const t = (y - a.y) / (b.y - a.y || 1e-12);
        xs.push(a.x + (b.x - a.x) * t);
      }
    }
    xs.sort((p, q) => p - q);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const x0 = Math.max(0, Math.floor((xs[k] - ox) / res));
      const x1 = Math.min(w - 1, Math.floor((xs[k + 1] - ox) / res));
      for (let ix = x0; ix <= x1; ix++) data[iy * w + ix] = 1;
    }
  }
}

function dilate(src: Occupancy): Occupancy {
  const out = occupancy({ minX: src.ox, minY: src.oy, maxX: src.ox + src.w * src.res, maxY: src.oy + src.h * src.res }, src.res);
  out.w = src.w;
  out.h = src.h;
  out.ox = src.ox;
  out.oy = src.oy;
  out.data = new Uint8Array(src.w * src.h);
  const { w, h, data } = src;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!data[y * w + x]) continue;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && ny >= 0 && nx < w && ny < h) out.data[ny * w + nx] = 1;
        }
      }
    }
  }
  return out;
}

function maskPaths(grid: Occupancy, data: Uint8Array, step: number): Pt[][] {
  const { w, h, res, ox, oy } = grid;
  const segs: Pt[][] = [];
  const on = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && data[y * w + x];
  const pt = (x: number, y: number) => ({ x: ox + (x + 0.5) * res, y: oy + (y + 0.5) * res });
  for (let y = 0; y < h; y += step) {
    let run: number | null = null;
    for (let x = 0; x <= w; x++) {
      const hit = x < w && on(x, y);
      if (hit && run === null) run = x;
      if (!hit && run !== null) {
        if (x - 1 > run) segs.push([pt(run, y), pt(x - 1, y)]);
        run = null;
      }
    }
  }
  for (let x = 0; x < w; x += step) {
    let run: number | null = null;
    for (let y = 0; y <= h; y++) {
      const hit = y < h && on(x, y);
      if (hit && run === null) run = y;
      if (!hit && run !== null) {
        if (y - 1 > run) segs.push([pt(x, run), pt(x, y - 1)]);
        run = null;
      }
    }
  }
  return segs;
}

function applySupportsAndBridges(layers: LayerPaths[], bounds: { minX: number; minY: number; maxX: number; maxY: number }, enabled: boolean) {
  const res = 0.9;
  const grid = occupancy(bounds, res);
  const solids: Uint8Array[] = [];
  for (const L of layers) {
    paintIslands(grid, L.islands);
    solids.push(new Uint8Array(grid.data));
  }
  for (let i = 1; i < layers.length; i++) {
    const prev = { ...grid, data: solids[i - 1] };
    const backed = dilate(prev).data;
    const infill: Pt[][] = [];
    const bridge: Pt[][] = [];
    for (const seg of layers[i].infill) {
      if (seg.length < 2) continue;
      const mx = (seg[0].x + seg[seg.length - 1].x) / 2;
      const my = (seg[0].y + seg[seg.length - 1].y) / 2;
      const ix = Math.floor((mx - grid.ox) / res);
      const iy = Math.floor((my - grid.oy) / res);
      const ok = ix >= 0 && iy >= 0 && ix < grid.w && iy < grid.h && backed[iy * grid.w + ix];
      if (ok) infill.push(seg);
      else bridge.push(seg);
    }
    layers[i].infill = infill;
    layers[i].bridge = bridge;
  }
  if (!enabled) return;
  const support: Uint8Array[] = layers.map(() => new Uint8Array(grid.w * grid.h));
  for (let i = layers.length - 2; i >= 0; i--) {
    const below = { ...grid, data: solids[i] };
    const dil = dilate(below).data;
    const hanging = solids[i + 1];
    const cur = support[i];
    const above = support[i + 1];
    for (let k = 0; k < cur.length; k++) {
      const need = hanging[k] && !dil[k];
      const drop = above[k];
      cur[k] = (need || drop) && !solids[i][k] ? 1 : 0;
    }
  }
  const step = Math.max(2, Math.round(2.4 / res));
  for (let i = 0; i < layers.length; i++) {
    const interfaceLayer = i + 1 < layers.length && solids[i + 1].some((v, k) => v && support[i][k]);
    layers[i].support = maskPaths(grid, support[i], interfaceLayer ? 1 : step);
  }
}

async function meshTris(docs: CadDocument[], kit: boolean, scale: number): Promise<number[]> {
  const targets = kit && docs.length > 1 ? docs : docs.slice(0, 1);
  const layouts = layoutParts(targets);
  const tris: number[] = [];
  for (const doc of targets) {
    const built = await buildSolid(doc.features);
    if (!built) continue;
    const off = layouts.find((l) => l.id === doc.id)?.offset ?? { x: 0, y: 0, z: 0 };
    tris.push(...collectPrintTris(built.geometry, off.x, off.y, off.z, scale));
  }
  return tris;
}

function sliceLayer(
  tris: number[],
  z: number,
  walls: number,
  lineW: number,
  lh: number,
  infillPct: number,
  pattern: InfillPattern,
  generator: WallGenerator,
  solid: boolean,
  brim: boolean,
  first: boolean,
  layerIndex: number,
  layerBounds: { minX: number; minY: number; maxX: number; maxY: number },
): LayerPaths {
  const segs: number[] = [];
  for (let i = 0; i < tris.length; i += 9) {
    const hit = intersectTri(tris, i, z, 1e-4);
    if (hit) segs.push(...hit);
  }
  const raw = stitch(segs).filter((l) => Math.abs(area(l)) > 0.15);
  const loops = forceWinding(raw);
  const spacing = flowSpacing(lineW, lh);
  const hybrid = generator === "both" || generator === "arachne";
  const classicOnly = generator === "classic";
  const perimeters: Pt[][] = [];
  for (const loop of loops) {
    let lastDist = 0;
    let fitted = 0;
    const nWalls = classicOnly ? walls : Math.max(walls, hybrid ? walls + 1 : walls);
    for (let w = 0; w < nWalls; w++) {
      if (classicOnly && w >= walls) break;
      if (!classicOnly && w >= walls && fitted >= walls) {
        const extra = insetTowardSolid(loop, lastDist + spacing * 0.48);
        if (extra && Math.abs(area(extra)) > 0.25) perimeters.push(rotateSeam(extra));
        break;
      }
      const dist = lineW * 0.5 + w * spacing;
      const off = insetTowardSolid(loop, dist);
      if (!off) {
        if (hybrid && lastDist > 0) {
          const mid = insetTowardSolid(loop, lastDist + spacing * 0.4);
          if (mid) perimeters.push(rotateSeam(mid));
        }
        break;
      }
      perimeters.push(rotateSeam(off));
      lastDist = dist;
      fitted++;
    }
  }
  const overlap = lineW * 0.15;
  const inner = loops
    .map((loop) => insetTowardSolid(loop, lineW * 0.5 + Math.max(1, fittedWalls(perimeters, loops)) * spacing - overlap))
    .filter((x): x is Pt[] => !!x);
  const clip = inner.length ? inner : loops;
  const b = clip.length ? loopBounds(clip) : layerBounds;
  let infill: Pt[][] = [];
  if (solid) {
    infill = monotonicize(infillFor(clip, b, spacing * 0.95, layerIndex % 2 === 1));
  } else {
    infill = sparseInfill(clip, b, lineW, lh, infillPct, pattern, z, layerIndex);
  }
  const skirt: Pt[][] = [];
  if (first) {
    const bb = loops.length ? loopBounds(loops) : layerBounds;
    skirt.push(rectLoop(bb, 4));
    if (brim) {
      for (let k = 1; k <= 6; k++) {
        for (const loop of loops) {
          if (area(loop) <= 0) continue;
          const off = offsetLoop(loop, -lineW * k);
          if (off) skirt.push(off);
        }
      }
    }
  }
  return { z, perimeters, infill, skirt, support: [], bridge: [], islands: loops };
}

function fittedWalls(perimeters: Pt[][], loops: Pt[][]) {
  if (!loops.length) return 2;
  return Math.max(1, Math.round(perimeters.length / loops.length));
}

function extrusion(len: number, lh: number, lw: number, filament: number) {
  const r = lh / 2;
  const vol = lw > lh ? len * (lh * (lw - lh) + Math.PI * r * r) : len * lh * lw;
  const areaFil = Math.PI * (filament * 0.5) ** 2;
  return vol / areaFil;
}

function emitGcode(
  layers: LayerPaths[],
  settings: SlicerSettings,
  bounds: { minX: number; minY: number; maxX: number; maxY: number; maxZ: number },
): { gcode: string; stats: SliceStats } {
  const printer = printerById(settings.printerId);
  const mat = materialById(settings.material);
  const lh = settings.layerHeight;
  const lw = printer.nozzle * 1.05;
  const cx = (bounds.minX + bounds.maxX) / 2;
  const cy = (bounds.minY + bounds.maxY) / 2;
  const ox = printer.bedX / 2 - cx;
  const oy = printer.bedY / 2 - cy;
  const tx = (p: Pt) => p.x + ox;
  const ty = (p: Pt) => p.y + oy;
  const sizeX = bounds.maxX - bounds.minX;
  const sizeY = bounds.maxY - bounds.minY;
  const fitsBed = sizeX <= printer.bedX - 8 && sizeY <= printer.bedY - 8 && bounds.maxZ <= printer.bedZ;

  const travelF = 9000;
  const printF = mat.speed * 60;
  const firstF = Math.min(printF, 1500);
  const wallF = printF * 0.75;
  const infillF = printF * 1.05;
  const supportF = Math.min(printF, 2400);
  const bridgeF = 1800;
  const retract = mat.retract;
  const fan = mat.fan;

  const lines: string[] = [
    ...startGcode(printer, mat, mat.hotend, mat.bed),
    `;LAYER_COUNT:${layers.length}`,
    `; layer height ${lh}`,
    `; line width ${lw.toFixed(3)}`,
    `; flow spacing ${flowSpacing(lw, lh).toFixed(3)} (Slic3r stadium)`,
    `; infill ${settings.infill}% ${settings.infillPattern}  walls ${settings.walls}`,
    `; perimeters: ${settings.wallGenerator ?? "both"} (classic outer + Arachne leftover bead)`,
    `; shells: monotonic rectilinear  ·  sparse: ${settings.infillPattern}`,
    `; supports: ${settings.supports ? "grid, 45° overhang" : "off"}  ·  bridges: air spans`,
    `; bed origin offset X${ox.toFixed(3)} Y${oy.toFixed(3)}`,
  ];

  let eAbs = 0;
  let px = 0;
  let py = 0;
  let pz = 0;
  let pathMm = 0;
  let travelMm = 0;
  let filamentMm = 0;
  let retracted = true;
  const zHop = 0.4;

  const moveTo = (x: number, y: number, z: number, print: boolean, feed: number, layerH: number) => {
    const dx = x - px;
    const dy = y - py;
    const dist = Math.hypot(dx, dy);
    if (print) {
      if (retracted) {
        if (Math.abs(z - pz) > 1e-4) {
          lines.push(`G0 Z${z.toFixed(3)} F1200`);
          pz = z;
        }
        lines.push(`G1 E${retract.toFixed(4)} F2100`);
        eAbs += retract;
        retracted = false;
      }
      const e = extrusion(dist, layerH, lw, printer.filament);
      eAbs += e;
      filamentMm += e;
      pathMm += dist;
      lines.push(`G1 X${x.toFixed(3)} Y${y.toFixed(3)} E${e.toFixed(5)} F${feed.toFixed(0)}`);
    } else {
      const hop = dist > 2.8 && !retracted;
      if (hop) {
        lines.push(`G1 E${(-retract).toFixed(4)} F2100`);
        eAbs -= retract;
        retracted = true;
        lines.push(`G0 Z${(z + zHop).toFixed(3)} F1200`);
        pz = z + zHop;
      } else if (Math.abs(z - pz) > 1e-4 && !retracted) {
        lines.push(`G0 Z${z.toFixed(3)} F1200`);
        pz = z;
      }
      travelMm += dist;
      if (dist > 0.02) lines.push(`G0 X${x.toFixed(3)} Y${y.toFixed(3)} F${travelF}`);
      if (retracted && Math.abs(pz - z) > 1e-4) {
        lines.push(`G0 Z${z.toFixed(3)} F1200`);
        pz = z;
      }
    }
    px = x;
    py = y;
  };

  const trace = (path: Pt[], closed: boolean, feed: number, layerH: number) => {
    if (path.length < 2) return;
    moveTo(tx(path[0]), ty(path[0]), pz, false, travelF, layerH);
    for (let i = 1; i < path.length; i++) moveTo(tx(path[i]), ty(path[i]), pz, true, feed, layerH);
    if (closed) moveTo(tx(path[0]), ty(path[0]), pz, true, feed, layerH);
  };

  for (let li = 0; li < layers.length; li++) {
    const L = layers[li];
    const first = li === 0;
    const feedWall = first ? firstF : wallF;
    const feedInfill = first ? firstF : infillF;
    const layerH = first ? lh * 1.08 : lh;
    lines.push(`;LAYER:${li}`);
    if (li === 3 && fan > 0) lines.push(`M106 S${fan}`);
    if (Math.abs(L.z - pz) > 1e-4) {
      lines.push(`G0 Z${L.z.toFixed(3)} F1200`);
      pz = L.z;
    }
    for (const s of L.skirt) trace(s, true, firstF, layerH);
    for (const s of L.support ?? []) trace(s, false, supportF, layerH);
    for (const p of L.perimeters) trace(p, true, feedWall, layerH);
    if ((L.bridge ?? []).length) {
      lines.push("M106 S255");
      for (const p of L.bridge) trace(p, false, bridgeF, layerH * 0.9);
      if (li >= 3) lines.push(`M106 S${fan}`);
    }
    for (const p of L.infill) trace(p, false, feedInfill, layerH);
    if (eAbs > 80) {
      lines.push("G92 E0");
      eAbs = 0;
    }
  }

  lines.push(...endGcode(printer));
  const timeSec =
    90 + pathMm / Math.max(mat.speed, 1) + travelMm / 150 + layers.length * 0.35;
  const volMm3 = filamentMm * Math.PI * (printer.filament * 0.5) ** 2;
  const filamentGrams = (volMm3 / 1000) * mat.density;

  const header = [
    `;TIME:${Math.round(timeSec)}`,
    `;Filament used:${(filamentMm / 1000).toFixed(3)}m`,
    `;Filament weight:${filamentGrams.toFixed(2)}g`,
    `;MINX:${(bounds.minX + ox).toFixed(3)}`,
    `;MINY:${(bounds.minY + oy).toFixed(3)}`,
    `;MINZ:0`,
    `;MAXX:${(bounds.maxX + ox).toFixed(3)}`,
    `;MAXY:${(bounds.maxY + oy).toFixed(3)}`,
    `;MAXZ:${bounds.maxZ.toFixed(3)}`,
  ];
  const gcode = [...header, ...lines, ""].join("\n");
  return {
    gcode,
    stats: {
      layers: layers.length,
      pathMm,
      travelMm,
      filamentMm,
      filamentGrams,
      timeSec,
      fitsBed,
      sizeX,
      sizeY,
      sizeZ: bounds.maxZ,
      originX: ox,
      originY: oy,
    },
  };
}

const yieldNow = () => new Promise<void>((r) => setTimeout(r, 0));

export async function sliceDocuments(
  docs: CadDocument[],
  settings: SlicerSettings = DEFAULT_SLICER,
  onProgress?: (p: number) => void,
): Promise<SliceResult> {
  const printer = printerById(settings.printerId);
  const targets = settings.kit && docs.length > 1 ? docs : docs.slice(0, 1);
  if (!targets.length) throw new Error("Nothing to slice.");
  const scale = targets[0].units === "in" ? 25.4 : 1;
  onProgress?.(0.05);
  const tris = await meshTris(docs, settings.kit, scale);
  if (tris.length < 9) throw new Error("The solid has no printable mesh.");
  const bb0 = bbox(tris);
  dropToBed(tris, bb0.minZ);
  const bb = bbox(tris);
  const lh = settings.layerHeight;
  const height = bb.maxZ - 0;
  const count = Math.max(1, Math.round(height / lh));
  const lineW = printer.nozzle * 1.05;
  const shells = Math.max(1, Math.min(6, Math.round(0.8 / lh)));
  const layerBounds = { minX: bb.minX, minY: bb.minY, maxX: bb.maxX, maxY: bb.maxY };
  const layers: LayerPaths[] = [];
  onProgress?.(0.12);
  for (let i = 0; i < count; i++) {
    const z = Math.min(bb.maxZ - lh * 0.35, (i + 1) * lh);
    const solid = i < shells || i >= count - shells;
    layers.push(
      sliceLayer(
        tris,
        z,
        settings.walls,
        lineW,
        lh,
        settings.infill,
        settings.infillPattern ?? "gyroid",
        settings.wallGenerator ?? "both",
        solid,
        settings.brim,
        i === 0,
        i,
        layerBounds,
      ),
    );
    if (i % 5 === 0) {
      onProgress?.(0.12 + (0.78 * i) / count);
      await yieldNow();
    }
  }
  if (!layers.some((l) => l.perimeters.length)) {
    throw new Error("Could not find printable outlines. Try a thicker part or a coarser layer height.");
  }
  applySupportsAndBridges(layers, layerBounds, settings.supports !== false);
  onProgress?.(0.93);
  const { gcode, stats } = emitGcode(layers, settings, {
    minX: bb.minX,
    minY: bb.minY,
    maxX: bb.maxX,
    maxY: bb.maxY,
    maxZ: bb.maxZ,
  });
  onProgress?.(1);
  return {
    layers,
    settings: { ...settings },
    printerId: settings.printerId,
    sourceKey: sliceSourceKey(docs, settings),
    stats,
    gcode,
  };
}

export function formatDuration(sec: number) {
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}
