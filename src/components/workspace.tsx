import { useCallback, useEffect, useRef } from "react";
import { Toaster, toast } from "sonner";
import { CaptureBar, CaptureOverlay, KitCard, SampleGrid } from "@/components/capture";
import { ChatPanel } from "@/components/chat-panel";
import { CommandPalette } from "@/components/command-palette";
import { FeaturePanel } from "@/components/feature-panel";
import { ActivityBar, EditorGroupHeader, StatusBar, TitleBar, useMac } from "@/components/ide-chrome";
import { Navigator } from "@/components/navigator";
import { PipelineOverlay } from "@/components/pipeline-overlay";
import { ReportPane } from "@/components/report-pane";
import { SlicerPanel } from "@/components/slicer-panel";
import { Viewport } from "@/components/viewport";
import { ingestImage } from "@/lib/actions";
import { runSlice } from "@/lib/cad/run-slice";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "capture" as const, label: "Capture" },
  { id: "model" as const, label: "Model" },
  { id: "talk" as const, label: "Talk" },
  { id: "slice" as const, label: "Slice" },
];

const STORAGE_KEY = "graphite-slicer";

function isField(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

export function Workspace() {
  const doc = useApp((s) => s.doc);
  const parts = useApp((s) => s.parts);
  const phase = useApp((s) => s.phase);
  const error = useApp((s) => s.error);
  const captureMode = useApp((s) => s.captureMode);
  const slicerOpen = useApp((s) => s.slicerOpen);
  const setSlicerOpen = useApp((s) => s.setSlicerOpen);
  const settings = useApp((s) => s.slicerSettings);
  const patchSlicer = useApp((s) => s.patchSlicer);
  const mobileTab = useApp((s) => s.mobileTab);
  const setMobileTab = useApp((s) => s.setMobileTab);
  const navOpen = useApp((s) => s.navOpen);
  const inspectorOpen = useApp((s) => s.inspectorOpen);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) patchSlicer(JSON.parse(raw) as Partial<typeof settings>);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) void ingestImage(file, file.name);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const field = isField(e.target);
      const meta = e.metaKey || e.ctrlKey;
      const app = useApp.getState();

      if (e.key === "Escape") {
        if (app.commandOpen) {
          app.setCommandOpen(false);
          return;
        }
        app.select(null);
        app.setCaptureMode(null);
        return;
      }

      if (meta && e.shiftKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        app.setCommandOpen(true);
        return;
      }
      if (meta && e.shiftKey && e.key.toLowerCase() === "o") {
        e.preventDefault();
        app.setCommandOpen(true);
        return;
      }
      if (meta && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        app.setCommandOpen(true);
        return;
      }
      if (meta && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        app.setCommandOpen(!app.commandOpen);
        return;
      }
      if (app.commandOpen) return;

      if (meta && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
        void runSlice();
        return;
      }
      if (meta && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "o") {
        e.preventDefault();
        document.getElementById("graphite-open")?.click();
        return;
      }
      if (meta && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        app.setNavOpen(!app.navOpen);
        return;
      }
      if (meta && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "j") {
        e.preventDefault();
        app.setReportOpen(!app.reportOpen);
        return;
      }
      if (meta && e.altKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        app.setInspectorOpen(!app.inspectorOpen);
        return;
      }
      if (meta && e.key === "0" && e.altKey) {
        e.preventDefault();
        app.setInspectorOpen(!app.inspectorOpen);
        return;
      }
      if (meta && e.key === "0") {
        e.preventDefault();
        app.setNavOpen(!app.navOpen);
        return;
      }
      if (meta && e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        app.toggleActivity("project");
        return;
      }
      if (meta && e.shiftKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        app.toggleActivity("search");
        return;
      }
      if (meta && e.shiftKey && e.key.toLowerCase() === "m") {
        e.preventDefault();
        app.setReportOpen(true);
        app.setReportTab("problems");
        app.setNavTab("issues");
        return;
      }
      if (meta && e.shiftKey && e.key.toLowerCase() === "y") {
        e.preventDefault();
        app.setReportOpen(!app.reportOpen);
        return;
      }
      if (meta && e.key === "`") {
        e.preventDefault();
        app.setReportOpen(true);
        app.setReportTab("gcode");
        return;
      }

      if (field) return;
      if ((e.key === "Delete" || e.key === "Backspace") && app.selectedId) {
        app.removeFeature(app.selectedId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const empty = phase === "intake" && !doc && !captureMode && parts.length === 0;

  return (
    <div className="flex h-dvh flex-col bg-bg text-fg" onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
      <TitleBar />

      <div className="flex min-h-0 flex-1">
        <ActivityBar />

        {navOpen ? (
          <aside className="hidden w-[260px] shrink-0 flex-col border-r border-border md:flex">
            <Navigator />
          </aside>
        ) : null}

        <main className="relative flex min-w-0 flex-1 flex-col">
          <EditorGroupHeader />
          <div className="relative h-[38vh] min-h-[220px] md:h-auto md:min-h-0 md:flex-1">
            <Viewport />
            <PipelineOverlay />
            <CaptureOverlay />
            {empty ? <WelcomePage /> : null}
          </div>

          <ReportPane />

          <div className="flex min-h-0 flex-1 flex-col border-t border-border md:hidden">
            <nav className="flex shrink-0 border-b border-border">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setMobileTab(t.id);
                    setSlicerOpen(t.id === "slice");
                  }}
                  className={cn(
                    "h-12 flex-1 text-xs font-medium uppercase tracking-[0.14em]",
                    mobileTab === t.id ? "text-fg" : "text-faint",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </nav>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {mobileTab === "capture" ? (
                <div className="space-y-4 p-3">
                  <CaptureBar />
                  <KitCard />
                  <SampleGrid compact />
                </div>
              ) : null}
              {mobileTab === "model" ? <FeaturePanel /> : null}
              {mobileTab === "talk" ? <ChatPanel /> : null}
              {mobileTab === "slice" ? <SlicerPanel /> : null}
            </div>
          </div>
        </main>

        {inspectorOpen ? (
          <aside className="hidden w-[320px] shrink-0 flex-col border-l border-border bg-surface md:flex">
            <InspectorFrame />
          </aside>
        ) : null}
      </div>

      <StatusBar />
      <CommandPalette />

      <input
        id="graphite-open"
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void ingestImage(file, file.name);
          e.target.value = "";
        }}
      />
      <Toaster theme="dark" position="bottom-center" />
    </div>
  );
}

function WelcomePage() {
  const mac = useMac();
  const mod = mac ? "⌘" : "Ctrl+";
  const shift = mac ? "⇧⌘" : "Ctrl+Shift+";
  return (
    <div className="absolute inset-0 z-10 hidden overflow-y-auto bg-bg md:block">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-10 md:px-10 md:py-14">
        <div>
          <p className="text-3xl font-medium tracking-tight text-fg">Graphite</p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Graph paper, napkin, whiteboard, coaster, voice, or a live hand gesture — then a parametric solid and
            in-browser G-code. Mac or PC. A sketch is a guess until you confirm it.
          </p>
        </div>

        <div>
          <p className="mb-3 text-[11px] font-medium tracking-[0.12em] text-faint uppercase">Start</p>
          <ul className="flex flex-col text-[13px]">
            <WelcomeRow
              label="Open Sketch…"
              hint={`${mod}O`}
              onClick={() => document.getElementById("graphite-open")?.click()}
            />
            <WelcomeRow
              label="Command Palette…"
              hint={`${shift}P`}
              onClick={() => useApp.getState().setCommandOpen(true)}
            />
            <WelcomeRow
              label="Show Explorer"
              hint={`${shift}E`}
              onClick={() => useApp.getState().toggleActivity("project")}
            />
            <WelcomeRow label="Capture" hint="" onClick={() => useApp.getState().toggleActivity("capture")} />
          </ul>
          <div className="mt-4">
            <CaptureBar />
          </div>
        </div>

        <div>
          <p className="mb-3 text-[11px] font-medium tracking-[0.12em] text-faint uppercase">Walkthrough</p>
          <KitCard />
        </div>

        <div>
          <p className="mb-3 text-[11px] font-medium tracking-[0.12em] text-faint uppercase">Samples</p>
          <div className="pointer-events-auto">
            <SampleGrid />
          </div>
        </div>
      </div>
    </div>
  );
}

function WelcomeRow({ label, hint, onClick }: { label: string; hint: string; onClick: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="flex h-8 w-full items-center gap-4 rounded-none text-left hover:bg-surface-subtle"
      >
        <span className="text-fg">{label}</span>
        {hint ? <span className="ml-auto font-mono text-[11px] text-faint">{hint}</span> : null}
      </button>
    </li>
  );
}

function InspectorFrame() {
  const slicerOpen = useApp((s) => s.slicerOpen);
  const setSlicerOpen = useApp((s) => s.setSlicerOpen);
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-9 shrink-0 items-center px-2">
        {(
          [
            [false, "Talk"],
            [true, "Inspect"],
          ] as const
        ).map(([on, label]) => (
          <button
            key={label}
            type="button"
            onClick={() => setSlicerOpen(on)}
            className={cn(
              "h-7 px-2.5 text-[11px] tracking-[0.04em] uppercase",
              slicerOpen === on ? "border-b border-fg text-fg" : "text-faint hover:text-fg",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 border-t border-border">{slicerOpen ? <SlicerPanel /> : <ChatPanel />}</div>
    </div>
  );
}
