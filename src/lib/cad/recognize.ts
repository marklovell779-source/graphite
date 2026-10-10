import { uid } from "@/lib/utils";
import type { CadDocument, CadFeature, MediaKind, ProfilePt } from "./types";

export type Stroke = { x: number; y: number }[];

export type MediaGuess = {
  media: MediaKind;
  detail: string;
  gridMm: number | null;
};

function grayscale(data: Uint8ClampedArray, i: number) {
  return data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
}

function autocorrPeak(profile: number[], minLag: number, maxLag: number) {
  let bestLag = 0;
  let best = 0;
  const mean = profile.reduce((a, b) => a + b, 0) / (profile.length || 1);
  const centered = profile.map((v) => v - mean);
  for (let lag = minLag; lag <= maxLag; lag++) {
    let s = 0;
    for (let i = 0; i + lag < centered.length; i++) s += centered[i] * centered[i + lag];
    if (s > best) {
      best = s;
      bestLag = lag;
    }
  }
  return { lag: bestLag, score: best };
}

export function classifyCanvas(canvas: HTMLCanvasElement): MediaGuess {
  const w = 160;
  const h = 120;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.drawImage(canvas, 0, 0, w, h);
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  let r = 0,
    g = 0,
    b = 0;
  const n = w * h;
  const col = new Array<number>(w).fill(0);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      r += d[i];
      g += d[i + 1];
      b += d[i + 2];
      col[x] += grayscale(d, i);
    }
  }
  r /= n;
  g /= n;
  b /= n;
  for (let x = 0; x < w; x++) col[x] /= h;
  const peak = autocorrPeak(col, 4, 28);
  const grid = peak.lag >= 5 && peak.score > 4000;
  const greenPaper = g > r + 12 && g > b + 8;
  const warmPaper = r > 140 && g > 110 && b < 120 && r > b + 25;
  const bright = (r + g + b) / 3 > 198;

  if (greenPaper && grid) {
    return { media: "graph-paper", detail: "Green engineering paper, periodic grid", gridMm: 5 };
  }
  if (grid) {
    return { media: "graph-paper", detail: `Grid pitch ~${peak.lag}px`, gridMm: 5 };
  }
  if (bright) {
    return { media: "whiteboard", detail: "High-key surface, marker strokes", gridMm: null };
  }
  if (warmPaper) {
    return { media: "napkin", detail: "Warm fibrous paper, no regular grid", gridMm: null };
  }
  const coaster = r > 70 && g > 40 && b < 110 && r > b + 16 && (r + g + b) / 3 < 148 && !grid;
  if (coaster) {
    return { media: "coaster", detail: "Dark round stock, no grid — treating as a coaster", gridMm: null };
  }
  return { media: "photo", detail: "Unlined photo, perspective inferred", gridMm: null };
}

function rdp(points: Stroke, epsilon: number): Stroke {
  if (points.length < 3) return points;
  const first = points[0];
  const last = points[points.length - 1];
  let maxD = 0;
  let idx = 0;
  const dx = last.x - first.x;
  const dy = last.y - first.y;
  const mag = Math.hypot(dx, dy) || 1;
  for (let i = 1; i < points.length - 1; i++) {
    const d = Math.abs(dy * points[i].x - dx * points[i].y + last.x * first.y - last.y * first.x) / mag;
    if (d > maxD) {
      maxD = d;
      idx = i;
    }
  }
  if (maxD > epsilon) {
    const left = rdp(points.slice(0, idx + 1), epsilon);
    const right = rdp(points.slice(idx), epsilon);
    return left.slice(0, -1).concat(right);
  }
  return [first, last];
}

export function recognizeStrokes(
  strokes: Stroke[],
  canvasW: number,
  canvasH: number,
  mmPerPx = 0.2,
): CadDocument {
  const pts = strokes.flat();
  const empty = (): CadDocument => ({
    id: uid("doc"),
    name: "Sketch plate",
    units: "mm",
    media: "gesture",
    pipelineNote: "Live sketch. No closed profile — defaulting to a 40 mm plate.",
    confidence: 0.35,
    trust: "guesswork",
    notes: "Draw a closed outline for a better fit.",
    features: [
      {
        id: uid("f"),
        kind: "box",
        name: "Plate",
        op: "add",
        params: { length: 40, width: 40, height: 4, fillet: 0 },
        position: { x: 0, y: 2, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
      },
    ],
    questions: [
      {
        id: uid("q"),
        prompt: "Thickness? The sketch is 2D, so this is always a guess.",
        why: "Print orientation and strength hinge on it.",
        options: [
          { label: "3 mm", reply: "3 mm thick", patch: { params: { height: 3 } } },
          { label: "4 mm", reply: "4 mm thick", patch: { params: { height: 4 } } },
          { label: "6 mm", reply: "6 mm thick", patch: { params: { height: 6 } } },
        ],
      },
    ],
  });
  if (pts.length < 8) return empty();

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const p of pts) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  const pxW = Math.max(8, maxX - minX);
  const pxH = Math.max(8, maxY - minY);
  const length = roundNice(pxW * mmPerPx);
  const width = roundNice(pxH * mmPerPx);

  const gw = Math.max(16, Math.ceil(pxW / 2));
  const gh = Math.max(16, Math.ceil(pxH / 2));
  const occ = new Uint8Array(gw * gh);
  const toG = (p: { x: number; y: number }) => ({
    x: Math.floor(((p.x - minX) / pxW) * (gw - 1)),
    y: Math.floor(((p.y - minY) / pxH) * (gh - 1)),
  });
  for (const stroke of strokes) {
    for (let i = 1; i < stroke.length; i++) {
      const a = toG(stroke[i - 1]);
      const b = toG(stroke[i]);
      stampLine(occ, gw, gh, a.x, a.y, b.x, b.y);
    }
  }
  dilate(occ, gw, gh);

  const holes = findHoles(occ, gw, gh, length, width);
  const circular = isCircular(occ, gw, gh);
  const l = detectL(occ, gw, gh);

  const features: CadFeature[] = [];
  const height = 4;

  if (circular && holes.length <= 1) {
    const radius = roundNice(Math.min(length, width) / 2);
    features.push({
      id: uid("f"),
      kind: "cylinder",
      name: "Body",
      op: "add",
      params: { radius, height },
      position: { x: 0, y: height / 2, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      axis: "y",
    });
  } else if (l) {
    const { a, b } = lToBoxes(l, length, width, height);
    features.push(a, b);
  } else {
    features.push({
      id: uid("f"),
      kind: "box",
      name: "Plate",
      op: "add",
      params: { length, width, height, fillet: 0 },
      position: { x: 0, y: height / 2, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    });
  }

  for (const hole of holes) {
    features.push({
      id: uid("f"),
      kind: "hole",
      name: `Hole ${features.filter((f) => f.kind === "hole").length + 1}`,
      op: "subtract",
      params: { radius: hole.r, depth: height + 1 },
      position: { x: hole.x, y: height / 2, z: hole.z },
      rotation: { x: 0, y: 0, z: 0 },
      axis: "y",
    });
  }

  const profile: ProfilePt[] = rdp(
    [
      { x: minX, y: minY },
      { x: maxX, y: minY },
      { x: maxX, y: maxY },
      { x: minX, y: maxY },
    ],
    2,
  ).map((p) => ({
    x: (p.x - (minX + maxX) / 2) * mmPerPx,
    z: (p.y - (minY + maxY) / 2) * mmPerPx,
  }));
  void profile;
  void canvasW;
  void canvasH;

  return {
    id: uid("doc"),
    name: circular ? "Turned part" : l ? "L-bracket" : "Sketched plate",
    units: "mm",
    media: "gesture",
    pipelineNote: `Hand sketch · ${roundNice(length)} × ${roundNice(width)} mm outline · ${holes.length} interior cut${holes.length === 1 ? "" : "s"}.`,
    confidence: holes.length ? 0.62 : 0.5,
    trust: "guesswork",
    notes: "Thickness is not in the drawing. Default 4 mm until you confirm.",
    sourceLabel: "Hand sketch",
    features,
    questions: [
      {
        id: uid("q"),
        prompt: "How thick is this part?",
        why: "A sketch has no Z. Everything else waits on this.",
        options: [
          { label: "3 mm", reply: "3 mm thick", patch: { params: { height: 3 } } },
          { label: "4 mm", reply: "4 mm thick", patch: { params: { height: 4 } } },
          { label: "8 mm", reply: "8 mm thick", patch: { params: { height: 8 } } },
          { label: "12 mm", reply: "12 mm thick", patch: { params: { height: 12 } } },
        ],
      },
    ],
  };
}

function roundNice(n: number) {
  if (n < 2) return Math.round(n * 10) / 10;
  if (n < 20) return Math.round(n * 2) / 2;
  return Math.round(n);
}

function stampLine(
  occ: Uint8Array,
  w: number,
  h: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
) {
  const steps = Math.max(1, Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let i = 0; i <= steps; i++) {
    const x = Math.round(x0 + ((x1 - x0) * i) / steps);
    const y = Math.round(y0 + ((y1 - y0) * i) / steps);
    if (x >= 0 && y >= 0 && x < w && y < h) occ[y * w + x] = 1;
  }
}

function dilate(occ: Uint8Array, w: number, h: number) {
  const copy = occ.slice();
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      if (copy[y * w + x]) continue;
      if (
        copy[y * w + x - 1] ||
        copy[y * w + x + 1] ||
        copy[(y - 1) * w + x] ||
        copy[(y + 1) * w + x]
      ) {
        occ[y * w + x] = 1;
      }
    }
  }
}

function findHoles(
  occ: Uint8Array,
  w: number,
  h: number,
  length: number,
  width: number,
): { x: number; z: number; r: number }[] {
  const seen = new Uint8Array(w * h);
  const stack = [0];
  seen[0] = 1;
  while (stack.length) {
    const i = stack.pop()!;
    if (occ[i]) continue;
    const x = i % w;
    const y = (i / w) | 0;
    const nbs = [x > 0 ? i - 1 : -1, x + 1 < w ? i + 1 : -1, y > 0 ? i - w : -1, y + 1 < h ? i + w : -1];
    for (const n of nbs) {
      if (n >= 0 && !seen[n] && !occ[n]) {
        seen[n] = 1;
        stack.push(n);
      }
    }
  }
  const holes: { x: number; z: number; r: number }[] = [];
  for (let i = 0; i < occ.length; i++) {
    if (occ[i] || seen[i]) continue;
    const cells: number[] = [];
    const q = [i];
    seen[i] = 1;
    while (q.length) {
      const j = q.pop()!;
      cells.push(j);
      const x = j % w;
      const y = (j / w) | 0;
      const nbs = [x > 0 ? j - 1 : -1, x + 1 < w ? j + 1 : -1, y > 0 ? j - w : -1, y + 1 < h ? j + w : -1];
      for (const n of nbs) {
        if (n >= 0 && !seen[n] && !occ[n]) {
          seen[n] = 1;
          q.push(n);
        }
      }
    }
    if (cells.length < 8 || cells.length > (w * h) / 3) continue;
    let sx = 0,
      sy = 0;
    for (const c of cells) {
      sx += c % w;
      sy += (c / w) | 0;
    }
    const cx = sx / cells.length;
    const cy = sy / cells.length;
    const area = cells.length;
    const rCell = Math.sqrt(area / Math.PI);
    holes.push({
      x: (cx / w - 0.5) * length,
      z: (cy / h - 0.5) * width,
      r: roundNice(Math.max(1.2, rCell * (length / w))),
    });
  }
  return holes.slice(0, 8);
}

function isCircular(occ: Uint8Array, w: number, h: number) {
  let count = 0;
  let cx = 0,
    cy = 0;
  for (let i = 0; i < occ.length; i++) {
    if (!occ[i]) continue;
    count++;
    cx += i % w;
    cy += (i / w) | 0;
  }
  if (count < 20) return false;
  cx /= count;
  cy /= count;
  const rs: number[] = [];
  for (let i = 0; i < occ.length; i++) {
    if (!occ[i]) continue;
    const x = i % w;
    const y = (i / w) | 0;
    rs.push(Math.hypot(x - cx, y - cy));
  }
  rs.sort((a, b) => a - b);
  const outer = rs.slice(Math.floor(rs.length * 0.7));
  const mean = outer.reduce((a, b) => a + b, 0) / outer.length;
  const variance =
    outer.reduce((s, v) => s + (v - mean) ** 2, 0) / outer.length;
  return mean > 0 && Math.sqrt(variance) / mean < 0.18;
}

type LCorner = "tl" | "tr" | "bl" | "br";

function detectL(occ: Uint8Array, w: number, h: number): LCorner | null {
  const q = (x0: number, y0: number, x1: number, y1: number) => {
    let filled = 0;
    let total = 0;
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        total++;
        if (occ[y * w + x]) filled++;
      }
    }
    return filled / (total || 1);
  };
  const mx = (w / 2) | 0;
  const my = (h / 2) | 0;
  const tl = q(0, 0, mx, my);
  const tr = q(mx, 0, w, my);
  const bl = q(0, my, mx, h);
  const br = q(mx, my, w, h);
  const vals = { tl, tr, bl, br };
  const min = Math.min(tl, tr, bl, br);
  const max = Math.max(tl, tr, bl, br);
  if (max < 0.08 || min > 0.28) return null;
  const empty = (Object.keys(vals) as LCorner[]).reduce((a, k) =>
    vals[k] < vals[a] ? k : a,
  );
  const others = (Object.keys(vals) as LCorner[]).filter((k) => k !== empty);
  if (others.every((k) => vals[k] > 0.08) && vals[empty] < 0.12) return empty;
  return null;
}

function lToBoxes(
  corner: LCorner,
  length: number,
  width: number,
  height: number,
): { a: CadFeature; b: CadFeature } {
  const t = Math.max(4, Math.min(length, width) * 0.28);
  const hFlange: CadFeature = {
    id: uid("f"),
    kind: "box",
    name: "Base flange",
    op: "add",
    params: { length, width: t, height, fillet: 0.5 },
    position: { x: 0, y: height / 2, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
  };
  const vFlange: CadFeature = {
    id: uid("f"),
    kind: "box",
    name: "Upright flange",
    op: "add",
    params: { length: t, width, height, fillet: 0.5 },
    position: { x: 0, y: height / 2, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
  };
  if (corner === "tr" || corner === "br") {
    vFlange.position.x = -length / 2 + t / 2;
    hFlange.position.z = corner === "tr" ? width / 2 - t / 2 : -width / 2 + t / 2;
  } else {
    vFlange.position.x = length / 2 - t / 2;
    hFlange.position.z = corner === "tl" ? width / 2 - t / 2 : -width / 2 + t / 2;
  }
  return { a: hFlange, b: vFlange };
}

export async function fileToCanvas(file: Blob): Promise<HTMLCanvasElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const max = 1024;
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function canvasToJpeg(canvas: HTMLCanvasElement, quality = 0.78): string {
  return canvas.toDataURL("image/jpeg", quality);
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image load failed"));
    img.src = src;
  });
}
