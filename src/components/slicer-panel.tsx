import { useEffect, useMemo, useRef } from "react";
import { Download, Layers, Loader2 } from "lucide-react";
import { toast } from "sonner";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { fallbackGeometry, geometryTo3mf, geometryToStl, slicerReadme } from "@/lib/cad/export";
import { buildSolid, layoutParts } from "@/lib/cad/geometry";
import { MATERIALS, PRINTERS, printerById, type MaterialId } from "@/lib/cad/printers";
import { runSlice } from "@/lib/cad/run-slice";
import { formatDuration, sliceSourceKey, type Pt } from "@/lib/cad/slicer";
import type { CadDocument } from "@/lib/cad/types";
import { useApp } from "@/lib/store";
import { cn, downloadBlob, slugify, zipBlobs } from "@/lib/utils";

const HEIGHTS = [0.12, 0.16, 0.2, 0.28];
const STORAGE_KEY = "graphite-slicer";

async function mergedPrintMesh(docs: CadDocument[]) {
  const layouts = layoutParts(docs);
  const positions: number[] = [];
  for (const d of docs) {
    const built = await buildSolid(d.features);
    const g = built?.geometry ?? fallbackGeometry(d);
    const off = layouts.find((l) => l.id === d.id)?.offset ?? { x: 0, y: 0, z: 0 };
    const pos = g.getAttribute("position");
    const idx = g.getIndex();
    const push = (i: number) => {
      positions.push(pos.getX(i) + off.x, pos.getY(i) + off.y, pos.getZ(i) + off.z);
    };
    if (idx) {
      for (let i = 0; i < idx.count; i++) push(idx.getX(i));
    } else {
      for (let i = 0; i < pos.count; i++) push(i);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  if (docs[0]?.units === "in") geo.scale(25.4, 25.4, 25.4);
  return geo;
}

function drawLayer(
  canvas: HTMLCanvasElement,
  paths: { perimeters: Pt[][]; infill: Pt[][]; skirt: Pt[][]; support?: Pt[][]; bridge?: Pt[][] } | undefined,
  bounds: { minX: number; minY: number; maxX: number; maxY: number } | null,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = Math.max(1, Math.floor(w * dpr));
  canvas.height = Math.max(1, Math.floor(h * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#121416";
  ctx.fillRect(0, 0, w, h);
  if (!paths || !bounds) {
    ctx.fillStyle = "#5c6168";
    ctx.font = "12px 'IBM Plex Sans', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Slice to preview layers", w / 2, h / 2);
    return;
  }
  const pad = 14;
  const bw = Math.max(1, bounds.maxX - bounds.minX);
  const bh = Math.max(1, bounds.maxY - bounds.minY);
  const scale = Math.min((w - pad * 2) / bw, (h - pad * 2) / bh);
  const ox = (w - bw * scale) / 2 - bounds.minX * scale;
  const oy = (h - bh * scale) / 2 + bounds.maxY * scale;
  const map = (p: Pt) => ({ x: p.x * scale + ox, y: -p.y * scale + oy });
  const stroke = (loops: Pt[][], color: string, width: number, closed: boolean) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    for (const loop of loops) {
      if (loop.length < 2) continue;
      ctx.beginPath();
      const a = map(loop[0]);
      ctx.moveTo(a.x, a.y);
      for (let i = 1; i < loop.length; i++) {
        const p = map(loop[i]);
        ctx.lineTo(p.x, p.y);
      }
      if (closed) ctx.closePath();
      ctx.stroke();
    }
  };
  stroke(paths.skirt, "rgb(236 238 240 / 0.28)", 1, true);
  stroke(paths.support ?? [], "rgb(139 143 150 / 0.45)", 0.8, false);
  stroke(paths.infill, "rgb(139 143 150 / 0.85)", 0.9, false);
  stroke(paths.bridge ?? [], "rgb(200 204 210 / 0.9)", 1.1, false);
  stroke(paths.perimeters, "#eceef0", 1.35, true);
}

export function LayerScrubber() {
  const result = useApp((s) => s.sliceResult);
  const layer = useApp((s) => s.sliceLayer);
  const setLayer = useApp((s) => s.setSliceLayer);
  const open = useApp((s) => s.slicerOpen);
  if (!open || !result || result.layers.length < 2) return null;
  const L = result.layers[layer];
  return (
    <div className="pointer-events-auto absolute right-3 bottom-10 left-3 md:bottom-12">
      <div className="flex items-center gap-3 rounded-sm bg-surface/90 px-3 py-2 shadow-[var(--shadow-border)] backdrop-blur-sm">
        <span className="w-16 shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          {layer + 1}/{result.layers.length}
        </span>
        <Slider
          min={0}
          max={result.layers.length - 1}
          step={1}
          value={[layer]}
          onValueChange={(v) => setLayer(v[0] ?? 0)}
        />
        <span className="w-14 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted">
          {L ? L.z.toFixed(2) : "0"} mm
        </span>
      </div>
    </div>
  );
}

export function SlicerPanel() {
  const doc = useApp((s) => s.doc);
  const parts = useApp((s) => s.parts);
  const settings = useApp((s) => s.slicerSettings);
  const patch = useApp((s) => s.patchSlicer);
  const result = useApp((s) => s.sliceResult);
  const layer = useApp((s) => s.sliceLayer);
  const progress = useApp((s) => s.slicerProgress);
  const close = useApp((s) => s.setSlicerOpen);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings]);

  const docs = settings.kit && parts.length > 1 ? parts : doc ? [doc] : [];
  const key = docs.length ? sliceSourceKey(docs, settings) : "";
  const fresh = result && result.sourceKey === key ? result : null;
  const printer = printerById(settings.printerId);

  const bounds = useMemo(() => {
    if (!fresh) return null;
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    for (const L of fresh.layers) {
      for (const group of [L.perimeters, L.infill, L.skirt, L.support ?? [], L.bridge ?? []]) {
        for (const path of group) {
          for (const p of path) {
            if (p.x < minX) minX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.x > maxX) maxX = p.x;
            if (p.y > maxY) maxY = p.y;
          }
        }
      }
    }
    if (!Number.isFinite(minX)) return null;
    return { minX, minY, maxX, maxY };
  }, [fresh]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawLayer(canvas, fresh?.layers[layer], bounds);
  }, [fresh, layer, bounds]);

  async function mesh() {
    return mergedPrintMesh(docs);
  }

  async function downloadGcode() {
    if (!fresh) return;
    const slug = slugify(docs.map((d) => d.name).join("-"));
    downloadBlob(`${slug}.gcode`, new Blob([fresh.gcode], { type: "text/plain" }));
  }

  async function download3mf() {
    try {
      const geo = await mesh();
      const slug = slugify(docs.map((d) => d.name).join("-"));
      downloadBlob(`${slug}.3mf`, await geometryTo3mf(geo, docs[0]?.name ?? "part"));
    } catch {
      toast.error("Could not write the 3MF.");
    }
  }

  async function downloadPack() {
    try {
      const geo = await mesh();
      const slug = slugify(docs.map((d) => d.name).join("-"));
      const name = docs[0]?.name ?? "part";
      const files = [
        { name: `${slug}.gcode`, blob: new Blob([fresh?.gcode ?? ""], { type: "text/plain" }) },
        { name: `${slug}.3mf`, blob: await geometryTo3mf(geo, name) },
        { name: `${slug}.stl`, blob: geometryToStl(geo, name) },
        { name: "README.txt", blob: slicerReadme(name) },
      ];
      downloadBlob(`${slug}-mac-windows.zip`, await zipBlobs(files));
    } catch {
      toast.error("Could not write the pack.");
    }
  }

  if (!doc) {
    return (
      <div className="flex h-full flex-col gap-3 p-4">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-faint">Universal slicer</p>
        <p className="text-sm text-muted">
          Confirm a part first. The slicer runs in this browser on Mac and Windows — no Cura, no installer.
        </p>
      </div>
    );
  }

  const slicing = progress >= 0 && progress < 1;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-faint">Universal slicer</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Mac, Windows, Linux. One G-code. No native app.
          </p>
        </div>
        <Button type="button" size="sm" variant="ghost" onClick={() => close(false)}>
          Close
        </Button>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-4">
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-faint">Printer</span>
          <select
            value={settings.printerId}
            onChange={(e) => patch({ printerId: e.target.value })}
            className="mt-1.5 h-11 w-full rounded-sm bg-surface-subtle px-3 text-sm text-fg shadow-[var(--shadow-border)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {PRINTERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.bedX}×{p.bedY}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs leading-relaxed text-faint">{printer.note}</p>
        </label>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-faint">Material</p>
          <div className="mt-1.5 flex overflow-hidden rounded-sm shadow-[var(--shadow-border)]">
            {MATERIALS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => patch({ material: m.id as MaterialId })}
                className={cn(
                  "h-10 flex-1 font-mono text-[10px] uppercase tracking-[0.14em]",
                  settings.material === m.id ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
                )}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-faint">Layer height</p>
          <div className="mt-1.5 flex overflow-hidden rounded-sm shadow-[var(--shadow-border)]">
            {HEIGHTS.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => patch({ layerHeight: h })}
                className={cn(
                  "h-10 flex-1 font-mono text-[10px] uppercase tracking-[0.14em]",
                  settings.layerHeight === h ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
                )}
              >
                {h.toFixed(2)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-faint">Walls</p>
            <div className="mt-1.5 flex overflow-hidden rounded-sm shadow-[var(--shadow-border)]">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => patch({ walls: n })}
                  className={cn(
                    "h-10 flex-1 font-mono text-[10px]",
                    settings.walls === n ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-faint">Infill</p>
              <span className="font-mono text-[11px] tabular-nums text-muted">{settings.infill}%</span>
            </div>
            <div className="mt-3 px-1">
              <Slider
                min={0}
                max={80}
                step={5}
                value={[settings.infill]}
                onValueChange={(v) => patch({ infill: v[0] ?? 20 })}
              />
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-faint">Infill pattern</p>
          <div className="mt-1.5 flex overflow-hidden rounded-sm shadow-[var(--shadow-border)]">
            {(
              [
                ["gyroid", "Gyroid"],
                ["grid", "Grid"],
                ["rectilinear", "Lines"],
                ["triangles", "Tri"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => patch({ infillPattern: id })}
                className={cn(
                  "h-10 flex-1 font-mono text-[10px] uppercase tracking-[0.08em]",
                  (settings.infillPattern ?? "gyroid") === id ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-faint">Generator</p>
            <div className="mt-1.5 flex overflow-hidden rounded-sm shadow-[var(--shadow-border)]">
              {(
                [
                  ["classic", "Classic"],
                  ["arachne", "Arachne"],
                  ["both", "Both"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => patch({ wallGenerator: id })}
                  className={cn(
                    "h-10 flex-1 font-mono text-[10px] uppercase tracking-[0.08em]",
                    (settings.wallGenerator ?? "both") === id ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => patch({ supports: !(settings.supports !== false) })}
            className={cn(
              "h-10 self-end rounded-sm font-mono text-[10px] uppercase tracking-[0.14em] shadow-[var(--shadow-border)]",
              settings.supports !== false ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
            )}
          >
            Support {settings.supports !== false ? "on" : "off"}
          </button>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => patch({ brim: !settings.brim })}
            className={cn(
              "h-10 flex-1 rounded-sm font-mono text-[10px] uppercase tracking-[0.14em] shadow-[var(--shadow-border)]",
              settings.brim ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
            )}
          >
            Brim {settings.brim ? "on" : "off"}
          </button>
          {parts.length > 1 ? (
            <button
              type="button"
              onClick={() => patch({ kit: !settings.kit })}
              className={cn(
                "h-10 flex-1 rounded-sm font-mono text-[10px] uppercase tracking-[0.14em] shadow-[var(--shadow-border)]",
                settings.kit ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
              )}
            >
              {settings.kit ? `All ${parts.length} parts` : "This part"}
            </button>
          ) : null}
        </div>

        <canvas
          ref={canvasRef}
          className="h-44 w-full rounded-sm bg-surface-subtle shadow-[var(--shadow-border)]"
          aria-label="Layer preview"
        />

        {slicing ? (
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-subtle">
            <div
              className="h-full bg-accent transition-[width] duration-150"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        ) : null}

        <Button type="button" className="w-full" onClick={() => void runSlice()} disabled={slicing}>
          {slicing ? <Loader2 className="animate-spin" /> : <Layers />}
          {slicing ? `Slicing ${Math.round(progress * 100)}%` : "Slice for print"}
        </Button>

        {fresh ? (
          <div className="space-y-2 rounded-sm bg-surface-subtle p-3">
            <p className="font-mono text-[11px] tabular-nums text-fg">
              {formatDuration(fresh.stats.timeSec)} · {fresh.stats.filamentGrams.toFixed(1)} g · {fresh.stats.layers}{" "}
              layers
            </p>
            <p className="text-xs leading-relaxed text-muted">
              {fresh.stats.sizeX.toFixed(0)} × {fresh.stats.sizeY.toFixed(0)} × {fresh.stats.sizeZ.toFixed(0)} mm on a{" "}
              {printer.bedX} × {printer.bedY} bed
              {fresh.stats.fitsBed ? "." : " — this part is larger than the selected bed."}
            </p>
            <div className="flex flex-col gap-1.5 pt-1">
              <Button type="button" size="sm" onClick={() => void downloadGcode()} disabled={slicing}>
                <Download /> G-code — Mac & Windows
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => void download3mf()} disabled={slicing}>
                3MF — Cura / Prusa / Bambu
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => void downloadPack()} disabled={slicing}>
                Zip pack (G-code + 3MF + STL)
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-xs leading-relaxed text-faint">
            G-code drops onto an SD card, OctoPrint, or Fluidd from either OS. 3MF opens in Cura, PrusaSlicer, and
            Bambu Studio on macOS and Windows if you still want a desktop slicer.
          </p>
        )}
      </div>
    </div>
  );
}
