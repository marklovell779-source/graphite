import { useEffect, useRef, useState } from "react";
import { Camera, Hand, Mic, PenLine, Square, Type, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ingestImage, ingestKit, ingestStrokes, ingestTemplate, ingestText } from "@/lib/actions";
import { listTemplates } from "@/lib/cad/templates";
import type { Stroke } from "@/lib/cad/recognize";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

type Recog = {
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((ev: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
};

function beginSpeech(onText: (t: string) => void, onEnd: () => void): { stop: () => void } | null {
  const w = window as unknown as {
    SpeechRecognition?: new () => Recog;
    webkitSpeechRecognition?: new () => Recog;
  };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) {
    useApp.getState().setError("Voice isn’t supported here. Type the dimensions instead.");
    return null;
  }
  const rec = new Ctor();
  rec.lang = "en-US";
  rec.onresult = (ev) => {
    const t = ev.results[0]?.[0]?.transcript ?? "";
    if (t) onText(t);
  };
  rec.onend = onEnd;
  rec.start();
  return rec;
}

export function KitCard() {
  const busy = useApp((s) => s.busy);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => void ingestKit(["bracket", "bushing"])}
      className="rise-in group flex w-full overflow-hidden rounded-md bg-surface text-left shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)] disabled:opacity-50"
    >
      <span className="flex h-24 w-[44%] shrink-0">
        <img
          src="/samples/bracket.jpg"
          alt=""
          className="h-full w-1/2 object-cover outline outline-1 -outline-offset-1 outline-fg/10"
        />
        <img
          src="/samples/bushing.jpg"
          alt=""
          className="h-full w-1/2 object-cover outline outline-1 -outline-offset-1 outline-fg/10"
        />
      </span>
      <span className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 px-3 py-3">
        <span className="text-sm font-medium text-fg">L-bracket + spacer bushing</span>
        <span className="text-xs text-muted">Two sketches · both stay on the bed · slice on Mac or PC</span>
      </span>
    </button>
  );
}

export function SampleGrid({ compact = false }: { compact?: boolean }) {
  const busy = useApp((s) => s.busy);
  const samples = listTemplates();
  return (
    <div className={cn("grid gap-2", compact ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4")}>
      {samples.map((s, i) => (
        <button
          key={s.id}
          type="button"
          disabled={busy}
          onClick={() => void ingestTemplate(s.id)}
          className="rise-in group overflow-hidden rounded-md bg-surface text-left shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)] disabled:opacity-50"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <img
            src={s.image}
            alt=""
            className="aspect-[4/3] w-full object-cover outline outline-1 -outline-offset-1 outline-fg/10"
          />
          <span className="flex flex-col gap-0.5 px-3 py-2.5">
            <span className="text-sm font-medium text-fg">{s.title}</span>
            <span className="text-xs text-muted">{s.blurb}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

export function CaptureBar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const setCaptureMode = useApp((s) => s.setCaptureMode);
  const busy = useApp((s) => s.busy);

  return (
    <div className="flex flex-wrap gap-1.5">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void ingestImage(file, file.name);
          e.target.value = "";
        }}
      />
      <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => inputRef.current?.click()}>
        <Upload /> Photo
      </Button>
      <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => setCaptureMode("camera")}>
        <Camera /> Camera
      </Button>
      <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => setCaptureMode("draw")}>
        <PenLine /> Draw
      </Button>
      <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => setCaptureMode("gesture")}>
        <Hand /> Gesture
      </Button>
      <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => setCaptureMode("voice")}>
        <Mic /> Voice
      </Button>
      <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => setCaptureMode("describe")}>
        <Type /> Describe
      </Button>
    </div>
  );
}

export function CaptureOverlay() {
  const mode = useApp((s) => s.captureMode);
  const setCaptureMode = useApp((s) => s.setCaptureMode);
  if (!mode || mode === "photo") return null;
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-bg/85 p-3 md:p-6">
      <div className="relative flex h-full max-h-[720px] w-full max-w-3xl flex-col rounded-lg bg-surface p-3 shadow-[var(--shadow-border)] md:p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-faint">
            {mode === "draw"
              ? "Sketch + dimensions"
              : mode === "gesture"
                ? "Live hand gesture"
                : mode === "camera"
                  ? "Live camera"
                  : mode === "voice"
                    ? "Voice"
                    : "Describe"}
          </p>
          <Button type="button" size="icon-sm" variant="ghost" onClick={() => setCaptureMode(null)} aria-label="Close">
            <X />
          </Button>
        </div>
        {mode === "draw" ? <SketchPad /> : null}
        {mode === "gesture" ? <GesturePad /> : null}
        {mode === "camera" ? <CameraPad /> : null}
        {mode === "voice" ? <VoicePad /> : null}
        {mode === "describe" ? <DescribePad /> : null}
      </div>
    </div>
  );
}

function SketchPad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Stroke[]>([]);
  const current = useRef<Stroke | null>(null);
  const [n, setN] = useState(0);
  const [note, setNote] = useState("80 × 50 × 10 mm, four M3 holes");
  const [listening, setListening] = useState(false);
  const recRef = useRef<{ stop: () => void } | null>(null);
  const busy = useApp((s) => s.busy);
  const setCaptureMode = useApp((s) => s.setCaptureMode);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const resize = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.max(1, Math.floor(r.width * dpr));
      c.height = Math.max(1, Math.floor(r.height * dpr));
      redraw();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  function redraw() {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#e8eaed";
    ctx.lineWidth = Math.max(2, c.width / 280);
    const all = current.current ? [...strokes.current, current.current] : strokes.current;
    for (const s of all) {
      if (s.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(s[0].x, s[0].y);
      for (let i = 1; i < s.length; i++) ctx.lineTo(s[i].x, s[i].y);
      ctx.stroke();
    }
  }

  function pt(e: React.PointerEvent) {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    const sx = c.width / r.width;
    const sy = c.height / r.height;
    return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy };
  }

  function listen() {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = beginSpeech(
      (t) => setNote((prev) => (prev && prev !== "80 × 50 × 10 mm, four M3 holes" ? `${prev} ${t}` : t)),
      () => setListening(false),
    );
    if (!rec) return;
    recRef.current = rec;
    setListening(true);
  }

  function build() {
    const c = canvasRef.current;
    if (!c) return;
    const jpeg = n > 0 ? c.toDataURL("image/jpeg", 0.72) : undefined;
    void ingestStrokes(strokes.current, c.width, c.height, note.trim() || undefined, jpeg);
    setCaptureMode(null);
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="sketch-grid min-h-0 flex-1 touch-none rounded-md"
        onPointerDown={(e) => {
          (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
          current.current = [pt(e)];
        }}
        onPointerMove={(e) => {
          if (!current.current) return;
          current.current.push(pt(e));
          redraw();
        }}
        onPointerUp={() => {
          if (current.current && current.current.length > 1) {
            strokes.current.push(current.current);
            setN(strokes.current.length);
          }
          current.current = null;
          redraw();
        }}
      />
      <p className="mt-3 text-xs text-muted">Draw the outline. Add dimensions in the note — Graphite uses both.</p>
      <div className="mt-2 flex items-center gap-2">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="80 × 50 × 10 mm, four M3 holes"
          className="h-11 min-w-0 flex-1 rounded-sm bg-bg px-3 text-sm text-fg placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button
          type="button"
          size="icon"
          variant={listening ? "default" : "outline"}
          onClick={listen}
          aria-label={listening ? "Stop listening" : "Speak dimensions"}
        >
          {listening ? <Square /> : <Mic />}
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[11px] text-muted">{n} strokes</p>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              strokes.current = [];
              current.current = null;
              setN(0);
              redraw();
            }}
          >
            Clear
          </Button>
          <Button type="button" size="sm" disabled={busy || (n === 0 && !note.trim())} onClick={build}>
            Build model
          </Button>
        </div>
      </div>
    </>
  );
}

function CameraPad() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [err, setErr] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [listening, setListening] = useState(false);
  const recRef = useRef<{ stop: () => void } | null>(null);
  const setCaptureMode = useApp((s) => s.setCaptureMode);
  const busy = useApp((s) => s.busy);

  useEffect(() => {
    let stream: MediaStream | null = null;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((s) => {
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => setErr("Camera is blocked. Drop a photo instead."));
    return () => {
      recRef.current?.stop();
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function listen() {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = beginSpeech(
      (t) => setNote((prev) => (prev ? `${prev} ${t}` : t)),
      () => setListening(false),
    );
    if (!rec) return;
    recRef.current = rec;
    setListening(true);
  }

  function snap() {
    const video = videoRef.current;
    if (!video) return;
    const c = document.createElement("canvas");
    c.width = video.videoWidth || 1024;
    c.height = video.videoHeight || 768;
    c.getContext("2d")?.drawImage(video, 0, 0);
    c.toBlob(
      (blob) => {
        if (blob) {
          void ingestImage(blob, "Camera still", note.trim() || undefined);
          setCaptureMode(null);
        }
      },
      "image/jpeg",
      0.82,
    );
  }

  return (
    <>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-md bg-bg">
        <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
        {err ? (
          <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-muted">{err}</p>
        ) : null}
      </div>
      <p className="mt-3 text-xs text-muted">Snap the sketch — graph paper, napkin, whiteboard, or coaster. Speak the sizes if they’re not on the page.</p>
      <div className="mt-2 flex items-center gap-2">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="80 × 50 × 10 mm, four M3 holes"
          className="h-11 min-w-0 flex-1 rounded-sm bg-bg px-3 text-sm text-fg placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button
          type="button"
          size="icon"
          variant={listening ? "default" : "outline"}
          onClick={listen}
          aria-label={listening ? "Stop listening" : "Speak dimensions"}
        >
          {listening ? <Square /> : <Mic />}
        </Button>
      </div>
      <div className="mt-3 flex justify-end">
        <Button type="button" size="sm" disabled={busy || Boolean(err)} onClick={snap}>
          Capture still
        </Button>
      </div>
    </>
  );
}

function GesturePad() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Stroke[]>([]);
  const current = useRef<Stroke | null>(null);
  const lost = useRef(0);
  const [n, setN] = useState(0);
  const [note, setNote] = useState("");
  const [listening, setListening] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const recRef = useRef<{ stop: () => void } | null>(null);
  const usingPointer = useRef(false);
  const busy = useApp((s) => s.busy);
  const setCaptureMode = useApp((s) => s.setCaptureMode);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let raf = 0;
    const sample = document.createElement("canvas");
    sample.width = 160;
    sample.height = 120;
    const sctx = sample.getContext("2d", { willReadFrequently: true });

    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "user", width: { ideal: 640 } }, audio: false })
      .then((s) => {
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => setErr("Camera blocked — draw on the pad with a finger or mouse."));

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const video = videoRef.current;
      const overlay = overlayRef.current;
      if (!video || !overlay || !sctx || video.readyState < 2) return;
      sctx.save();
      sctx.translate(sample.width, 0);
      sctx.scale(-1, 1);
      sctx.drawImage(video, 0, 0, sample.width, sample.height);
      sctx.restore();
      const img = sctx.getImageData(0, 0, sample.width, sample.height);
      const tip = findFingertip(img.data, sample.width, sample.height);
      const ctx = overlay.getContext("2d");
      if (!ctx) return;
      const r = overlay.getBoundingClientRect();
      if (r.width < 8 || r.height < 8) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const tw = Math.max(1, Math.floor(r.width * dpr));
      const th = Math.max(1, Math.floor(r.height * dpr));
      if (overlay.width !== tw || overlay.height !== th) {
        overlay.width = tw;
        overlay.height = th;
      }
      redrawOverlay(ctx, overlay, strokes.current, current.current, usingPointer.current ? null : tip, sample.width, sample.height);
      if (usingPointer.current) return;
      if (!tip) {
        lost.current += 1;
        if (lost.current > 10 && current.current) {
          if (current.current.length > 1) {
            strokes.current.push(current.current);
            setN(strokes.current.length);
          }
          current.current = null;
        }
        return;
      }
      lost.current = 0;
      const px = (tip.x / sample.width) * overlay.width;
      const py = (tip.y / sample.height) * overlay.height;
      if (!current.current) current.current = [{ x: px, y: py }];
      else {
        const last = current.current[current.current.length - 1];
        if (!last || Math.hypot(px - last.x, py - last.y) > 2) current.current.push({ x: px, y: py });
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      recRef.current?.stop();
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function listen() {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = beginSpeech(
      (t) => setNote((prev) => (prev ? `${prev} ${t}` : t)),
      () => setListening(false),
    );
    if (!rec) return;
    recRef.current = rec;
    setListening(true);
  }

  function pt(e: React.PointerEvent) {
    const c = overlayRef.current!;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height };
  }

  function build() {
    const c = overlayRef.current;
    if (!c) return;
    const jpeg = n > 0 ? c.toDataURL("image/jpeg", 0.72) : undefined;
    void ingestStrokes(strokes.current, c.width, c.height, note.trim() || undefined, jpeg);
    setCaptureMode(null);
  }

  return (
    <>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-md bg-bg">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full scale-x-[-1] object-cover opacity-55"
        />
        <canvas
          ref={overlayRef}
          className="absolute inset-0 h-full w-full touch-none"
          onPointerDown={(e) => {
            (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
            usingPointer.current = true;
            current.current = [pt(e)];
          }}
          onPointerMove={(e) => {
            if (e.buttons === 0 && e.pointerType !== "touch") return;
            if (!current.current) return;
            current.current.push(pt(e));
            const overlay = overlayRef.current;
            const ctx = overlay?.getContext("2d");
            if (overlay && ctx) redrawOverlay(ctx, overlay, strokes.current, current.current, null, 160, 120);
          }}
          onPointerUp={() => {
            usingPointer.current = false;
            if (current.current && current.current.length > 1) {
              strokes.current.push(current.current);
              setN(strokes.current.length);
            }
            current.current = null;
          }}
        />
        {err ? (
          <p className="pointer-events-none absolute bottom-3 left-3 right-3 text-center text-xs text-muted">{err}</p>
        ) : null}
      </div>
      <p className="mt-3 text-xs text-muted">
        Hold a fingertip in front of the camera, or draw on the feed. Speak the sizes — Graphite uses both.
      </p>
      <div className="mt-2 flex items-center gap-2">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ø20 × 12 mm bushing, 8 mm bore"
          className="h-11 min-w-0 flex-1 rounded-sm bg-bg px-3 text-sm text-fg placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button
          type="button"
          size="icon"
          variant={listening ? "default" : "outline"}
          onClick={listen}
          aria-label={listening ? "Stop listening" : "Speak dimensions"}
        >
          {listening ? <Square /> : <Mic />}
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[11px] text-muted">{n} strokes</p>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              strokes.current = [];
              current.current = null;
              setN(0);
            }}
          >
            Clear
          </Button>
          <Button type="button" size="sm" disabled={busy || (n === 0 && !note.trim())} onClick={build}>
            Build model
          </Button>
        </div>
      </div>
    </>
  );
}

function findFingertip(data: Uint8ClampedArray, w: number, h: number): { x: number; y: number } | null {
  let skin = 0;
  let minY = h;
  let sx = 0;
  let n = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r > 95 && g > 40 && b > 20 && r > g && r > b && r - g > 15) {
        skin++;
        if (y < minY) {
          minY = y;
          sx = x;
          n = 1;
        } else if (y === minY) {
          sx += x;
          n++;
        }
      }
    }
  }
  if (skin < 80 || n < 3) return null;
  return { x: sx / n, y: minY };
}

function redrawOverlay(
  ctx: CanvasRenderingContext2D,
  c: HTMLCanvasElement,
  strokes: Stroke[],
  live: Stroke | null,
  tip: { x: number; y: number } | null,
  sw: number,
  sh: number,
) {
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "oklch(0.93 0.01 250)";
  ctx.lineWidth = Math.max(2, c.width / 280);
  const all = live ? [...strokes, live] : strokes;
  for (const s of all) {
    if (s.length < 2) continue;
    ctx.beginPath();
    ctx.moveTo(s[0].x, s[0].y);
    for (let i = 1; i < s.length; i++) ctx.lineTo(s[i].x, s[i].y);
    ctx.stroke();
  }
  if (tip) {
    const x = (tip.x / sw) * c.width;
    const y = (tip.y / sh) * c.height;
    ctx.beginPath();
    ctx.strokeStyle = "oklch(0.78 0.14 70)";
    ctx.lineWidth = 2;
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function VoicePad() {
  const [heard, setHeard] = useState("");
  const [listening, setListening] = useState(false);
  const recRef = useRef<{ stop: () => void } | null>(null);
  const setCaptureMode = useApp((s) => s.setCaptureMode);
  const busy = useApp((s) => s.busy);

  function start() {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = beginSpeech(setHeard, () => setListening(false));
    if (!rec) return;
    recRef.current = rec;
    setListening(true);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col justify-between gap-4">
      <p className="text-sm leading-relaxed text-muted">
        Speak the part like a shop drawing: “eighty by fifty by ten plate, four M3 holes, three millimetre stock.”
      </p>
      <p className="min-h-16 text-lg text-fg">{heard || (listening ? "Listening…" : "Waiting.")}</p>
      <div className="flex justify-end gap-2">
        <Button type="button" size="sm" variant="outline" onClick={listening ? () => recRef.current?.stop() : start}>
          {listening ? "Stop" : "Listen"}
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={busy || !heard}
          onClick={() => {
            void ingestText(heard, "voice");
            setCaptureMode(null);
          }}
        >
          Build model
        </Button>
      </div>
    </div>
  );
}

function DescribePad() {
  const [text, setText] = useState("80 × 50 × 10 mm plate with four M3 holes");
  const setCaptureMode = useApp((s) => s.setCaptureMode);
  const busy = useApp((s) => s.busy);
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-32 flex-1 resize-none rounded-md bg-bg px-3 py-3 text-sm text-fg shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          disabled={busy || !text.trim()}
          onClick={() => {
            void ingestText(text.trim(), "describe");
            setCaptureMode(null);
          }}
        >
          Build model
        </Button>
      </div>
    </div>
  );
}
