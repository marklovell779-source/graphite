import { useEffect, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ChevronRight,
  Files,
  Loader2,
  PanelBottom,
  PanelLeft,
  PanelRight,
  PenLine,
  Play,
  Search,
  Settings2,
  CircleAlert,
  X,
} from "lucide-react";
import { ingestKit, ingestTemplate } from "@/lib/actions";
import { EXPORT_ITEMS, runExport } from "@/components/export-menu";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  MenuShortcut,
} from "@/components/ui/dropdown-menu";
import { collectIssues } from "@/lib/cad/issues";
import { measureDoc } from "@/lib/cad/geometry";
import { MATERIALS, PRINTERS, printerById, type MaterialId } from "@/lib/cad/printers";
import { formatDuration } from "@/lib/cad/slicer";
import { listTemplates } from "@/lib/cad/templates";
import { runSlice } from "@/lib/cad/run-slice";
import { useApp, type NavTab } from "@/lib/store";
import { cn, openSketchFile } from "@/lib/utils";

function isMacClient() {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad/.test(navigator.userAgent);
}

export function useMac() {
  const [mac, setMac] = useState(false);
  useEffect(() => {
    setMac(isMacClient());
  }, []);
  return mac;
}

function MenuBtn({ label, children }: { label: string; children: ReactNode }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="flex h-7 items-center rounded-none px-2 text-[13px] text-muted hover:bg-surface-subtle hover:text-fg data-[state=open]:bg-surface-subtle data-[state=open]:text-fg">
        {label}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-56 rounded-sm">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TitleBar() {
  const doc = useApp((s) => s.doc);
  const parts = useApp((s) => s.parts);
  const units = doc?.units ?? "mm";
  const setUnits = useApp((s) => s.setUnits);
  const selectedId = useApp((s) => s.selectedId);
  const removeFeature = useApp((s) => s.removeFeature);
  const removePart = useApp((s) => s.removePart);
  const reset = useApp((s) => s.reset);
  const navOpen = useApp((s) => s.navOpen);
  const inspectorOpen = useApp((s) => s.inspectorOpen);
  const reportOpen = useApp((s) => s.reportOpen);
  const slicerOpen = useApp((s) => s.slicerOpen);
  const setNavOpen = useApp((s) => s.setNavOpen);
  const setInspectorOpen = useApp((s) => s.setInspectorOpen);
  const setReportOpen = useApp((s) => s.setReportOpen);
  const setSlicerOpen = useApp((s) => s.setSlicerOpen);
  const setCommandOpen = useApp((s) => s.setCommandOpen);
  const toggleActivity = useApp((s) => s.toggleActivity);
  const setReportTab = useApp((s) => s.setReportTab);
  const settings = useApp((s) => s.slicerSettings);
  const patchSlicer = useApp((s) => s.patchSlicer);
  const progress = useApp((s) => s.slicerProgress);
  const slicing = progress >= 0 && progress < 1;
  const mac = useMac();
  const mod = mac ? "⌘" : "Ctrl+";
  const samples = listTemplates();
  const title = doc ? `${doc.name} — Graphite` : "Welcome — Graphite";

  return (
    <header className="relative z-40 flex h-9 shrink-0 items-center gap-1 border-b border-border bg-title px-1 md:px-2">
      <button type="button" onClick={reset} className="flex size-7 shrink-0 items-center justify-center md:hidden" aria-label="Graphite">
        <img src="/favicon.svg" alt="" className="size-4" />
      </button>
      <img src="/favicon.svg" alt="" className="ml-1 hidden size-4 shrink-0 md:block" />

      <nav className="hidden items-center md:flex" aria-label="Menu bar">
        <MenuBtn label="File">
          <DropdownMenuItem onSelect={() => openSketchFile()}>
            Open Sketch…
            <MenuShortcut>{mod}O</MenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setCommandOpen(true)}>
            Open Quickly…
            <MenuShortcut>{mac ? "⌘P" : "Ctrl+P"}</MenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Open Sample</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {samples.map((s) => (
                <DropdownMenuItem key={s.id} onSelect={() => void ingestTemplate(s.id)}>
                  {s.title}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => void ingestKit(["bracket", "bushing"])}>
                L-bracket + bushing
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={!doc} onSelect={() => doc && removePart(doc.id)}>
            Close Editor
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => reset()}>Close All / New Session</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger disabled={!doc}>Export</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {EXPORT_ITEMS.filter(([k]) => k !== "slice").map(([k, label]) => (
                <DropdownMenuItem key={k} disabled={!doc} onSelect={() => void runExport(k)}>
                  {label}
                </DropdownMenuItem>
              ))}
              {parts.length > 1 ? (
                <DropdownMenuItem onSelect={() => void runExport("kit")}>All parts (zip)</DropdownMenuItem>
              ) : null}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </MenuBtn>
        <MenuBtn label="Edit">
          <DropdownMenuItem disabled={!selectedId} onSelect={() => selectedId && removeFeature(selectedId)}>
            Delete Feature
            <MenuShortcut>⌫</MenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={units} onValueChange={(v) => setUnits(v as "mm" | "in")}>
            <DropdownMenuRadioItem value="mm">Millimetres</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="in">Inches</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </MenuBtn>
        <MenuBtn label="Selection">
          <DropdownMenuItem
            disabled={!doc}
            onSelect={() => doc && useApp.getState().select(doc.features[0]?.id ?? null)}
          >
            Select First Feature
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => useApp.getState().select(null)}>Deselect</DropdownMenuItem>
        </MenuBtn>
        <MenuBtn label="View">
          <DropdownMenuItem onSelect={() => setCommandOpen(true)}>
            Command Palette…
            <MenuShortcut>{mac ? "⇧⌘P" : "Ctrl+Shift+P"}</MenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={navOpen} onCheckedChange={(v) => setNavOpen(Boolean(v))}>
            Primary Side Bar
            <MenuShortcut>{mod}B</MenuShortcut>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={inspectorOpen} onCheckedChange={(v) => setInspectorOpen(Boolean(v))}>
            Secondary Side Bar
            <MenuShortcut>{mac ? "⌥⌘B" : "Ctrl+Alt+B"}</MenuShortcut>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={reportOpen} onCheckedChange={(v) => setReportOpen(Boolean(v))}>
            Panel
            <MenuShortcut>{mod}J</MenuShortcut>
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => toggleActivity("project")}>Explorer</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => toggleActivity("search")}>Search</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => toggleActivity("issues")}>Problems</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => toggleActivity("capture")}>Capture</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => toggleActivity("run")}>Run and Slice</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={!slicerOpen}
            onCheckedChange={(v) => {
              setSlicerOpen(!v);
              if (v) setInspectorOpen(true);
            }}
          >
            Talk
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={slicerOpen}
            onCheckedChange={(v) => {
              const on = Boolean(v);
              setSlicerOpen(on);
              if (on) setInspectorOpen(true);
            }}
          >
            Inspect
          </DropdownMenuCheckboxItem>
        </MenuBtn>
        <MenuBtn label="Go">
          <DropdownMenuItem onSelect={() => setCommandOpen(true)}>
            Go to File…
            <MenuShortcut>{mod}P</MenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              setReportOpen(true);
              setReportTab("problems");
            }}
          >
            Go to Problems
            <MenuShortcut>{mac ? "⇧⌘M" : "Ctrl+Shift+M"}</MenuShortcut>
          </DropdownMenuItem>
        </MenuBtn>
        <MenuBtn label="Run">
          <DropdownMenuItem disabled={!doc} onSelect={() => void runSlice()}>
            Start Slicing
            <MenuShortcut>{mod}R</MenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Printer</DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="max-h-72 overflow-y-auto">
              <DropdownMenuRadioGroup value={settings.printerId} onValueChange={(v) => patchSlicer({ printerId: v })}>
                {PRINTERS.map((p) => (
                  <DropdownMenuRadioItem key={p.id} value={p.id}>
                    {p.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Material</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={settings.material}
                onValueChange={(v) => patchSlicer({ material: v as MaterialId })}
              >
                {MATERIALS.map((m) => (
                  <DropdownMenuRadioItem key={m.id} value={m.id}>
                    {m.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </MenuBtn>
        <MenuBtn label="Terminal">
          <DropdownMenuItem
            onSelect={() => {
              setReportOpen(true);
              setReportTab("gcode");
            }}
          >
            G-code
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              setReportOpen(true);
              setReportTab("output");
            }}
          >
            Slice Output
          </DropdownMenuItem>
        </MenuBtn>
        <MenuBtn label="Help">
          <DropdownMenuItem onSelect={() => reset()}>Welcome</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setCommandOpen(true)}>
            Keyboard Shortcuts
            <MenuShortcut>{mac ? "⇧⌘P" : "Ctrl+Shift+P"}</MenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>A sketch is a guess until you confirm it.</DropdownMenuItem>
        </MenuBtn>
      </nav>

      <p className="pointer-events-none absolute inset-x-0 hidden truncate text-center text-[13px] text-muted md:block">
        {title}
      </p>
      <p className="min-w-0 flex-1 truncate text-[13px] text-muted md:hidden">{doc?.name ?? "Graphite"}</p>

      <div className="ml-auto flex items-center gap-0.5">
        <button
          type="button"
          aria-label={slicing ? "Slicing" : "Start slicing"}
          disabled={!doc || slicing}
          onClick={() => void runSlice()}
          className="flex size-7 items-center justify-center text-muted hover:bg-surface-subtle hover:text-fg disabled:opacity-40"
        >
          {slicing ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5 fill-current" />}
        </button>
        <button
          type="button"
          aria-label={navOpen ? "Hide primary side bar" : "Show primary side bar"}
          aria-pressed={navOpen}
          onClick={() => setNavOpen(!navOpen)}
          className={cn(
            "hidden size-7 items-center justify-center md:flex",
            navOpen ? "bg-surface-subtle text-fg" : "text-faint hover:text-fg hover:bg-surface-subtle",
          )}
        >
          <PanelLeft className="size-3.5" />
        </button>
        <button
          type="button"
          aria-label={reportOpen ? "Hide panel" : "Show panel"}
          aria-pressed={reportOpen}
          onClick={() => setReportOpen(!reportOpen)}
          className={cn(
            "hidden size-7 items-center justify-center md:flex",
            reportOpen ? "bg-surface-subtle text-fg" : "text-faint hover:text-fg hover:bg-surface-subtle",
          )}
        >
          <PanelBottom className="size-3.5" />
        </button>
        <button
          type="button"
          aria-label={inspectorOpen ? "Hide secondary side bar" : "Show secondary side bar"}
          aria-pressed={inspectorOpen}
          onClick={() => setInspectorOpen(!inspectorOpen)}
          className={cn(
            "hidden size-7 items-center justify-center md:flex",
            inspectorOpen ? "bg-surface-subtle text-fg" : "text-faint hover:text-fg hover:bg-surface-subtle",
          )}
        >
          <PanelRight className="size-3.5" />
        </button>
      </div>
    </header>
  );
}

const ACTIVITIES: { id: NavTab; label: string; shortcut: string; icon: typeof Files }[] = [
  { id: "project", label: "Explorer", shortcut: "⇧⌘E", icon: Files },
  { id: "search", label: "Search", shortcut: "⇧⌘F", icon: Search },
  { id: "issues", label: "Problems", shortcut: "⇧⌘M", icon: CircleAlert },
  { id: "capture", label: "Capture", shortcut: "", icon: PenLine },
  { id: "run", label: "Run and Slice", shortcut: "⌘R", icon: Play },
];

export function ActivityBar() {
  const tab = useApp((s) => s.navTab);
  const open = useApp((s) => s.navOpen);
  const toggle = useApp((s) => s.toggleActivity);
  const setCommandOpen = useApp((s) => s.setCommandOpen);
  const issues = collectIssues(useApp((s) => s.parts));
  const settings = useApp((s) => s.slicerSettings);
  const patchSlicer = useApp((s) => s.patchSlicer);
  const doc = useApp((s) => s.doc);
  const units = doc?.units ?? "mm";
  const setUnits = useApp((s) => s.setUnits);

  return (
    <nav
      className="hidden w-12 shrink-0 flex-col items-center border-r border-border bg-activity py-1 md:flex"
      aria-label="Activity bar"
    >
      {ACTIVITIES.map((a) => {
        const Icon = a.icon;
        const active = open && tab === a.id;
        return (
          <button
            key={a.id}
            type="button"
            title={a.shortcut ? `${a.label} (${a.shortcut})` : a.label}
            aria-label={a.label}
            aria-pressed={active}
            onClick={() => toggle(a.id)}
            className={cn(
              "relative flex size-12 items-center justify-center text-faint hover:text-fg",
              active && "text-fg",
            )}
          >
            <span
              className={cn(
                "absolute inset-y-2 left-0 w-0.5 rounded-none bg-fg",
                active ? "opacity-100" : "opacity-0",
              )}
              aria-hidden
            />
            <Icon className="size-6" strokeWidth={active ? 1.75 : 1.5} />
            {a.id === "issues" && issues.length ? (
              <span className="absolute top-1.5 right-1.5 min-w-4 rounded-full bg-danger px-1 text-center font-mono text-[10px] leading-4 text-fg">
                {issues.length > 9 ? "9+" : issues.length}
              </span>
            ) : null}
          </button>
        );
      })}
      <span className="mt-auto" />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className="flex size-12 items-center justify-center text-faint hover:text-fg data-[state=open]:text-fg"
          aria-label="Settings"
          title="Settings"
        >
          <Settings2 className="size-5" strokeWidth={1.5} />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="end" className="min-w-52 rounded-sm">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Printer</DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="max-h-72 overflow-y-auto">
              <DropdownMenuRadioGroup value={settings.printerId} onValueChange={(v) => patchSlicer({ printerId: v })}>
                {PRINTERS.map((p) => (
                  <DropdownMenuRadioItem key={p.id} value={p.id}>
                    {p.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Material</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={settings.material}
                onValueChange={(v) => patchSlicer({ material: v as MaterialId })}
              >
                {MATERIALS.map((m) => (
                  <DropdownMenuRadioItem key={m.id} value={m.id}>
                    {m.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={units} onValueChange={(v) => setUnits(v as "mm" | "in")}>
            <DropdownMenuRadioItem value="mm">Millimetres</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="in">Inches</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setCommandOpen(true)}>Command Palette…</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}

export function EditorGroupHeader() {
  const doc = useApp((s) => s.doc);
  const parts = useApp((s) => s.parts);
  const selectedId = useApp((s) => s.selectedId);
  const setActive = useApp((s) => s.setActive);
  const select = useApp((s) => s.select);
  const removePart = useApp((s) => s.removePart);
  const selected = doc?.features.find((f) => f.id === selectedId);
  const progress = useApp((s) => s.slicerProgress);
  const slicing = progress >= 0 && progress < 1;

  return (
    <div className="hidden shrink-0 flex-col md:flex">
      <div className="flex h-9 items-stretch overflow-x-auto border-b border-border bg-activity">
        {parts.length === 0 ? (
          <div className="flex items-center bg-bg px-3 text-[13px] text-fg shadow-[inset_0_1px_0_0_var(--color-accent)]">
            Welcome
          </div>
        ) : (
          parts.map((p) => {
            const active = p.id === doc?.id;
            return (
              <div
                key={p.id}
                className={cn(
                  "group flex max-w-52 shrink-0 items-center border-r border-border",
                  active ? "bg-bg text-fg shadow-[inset_0_1px_0_0_var(--color-accent)]" : "bg-transparent text-muted hover:bg-surface-subtle/60",
                )}
              >
                <button
                  type="button"
                  onClick={() => setActive(p.id)}
                  className="min-w-0 flex-1 truncate px-3 text-left text-[13px]"
                >
                  {p.name}
                </button>
                <button
                  type="button"
                  aria-label={`Close ${p.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    removePart(p.id);
                  }}
                  className="mr-1 flex size-5 shrink-0 items-center justify-center text-faint opacity-0 hover:text-fg group-hover:opacity-100"
                >
                  <X className="size-3" />
                </button>
              </div>
            );
          })
        )}
        <span className="ml-auto" />
        <button
          type="button"
          disabled={!doc || slicing}
          onClick={() => void runSlice()}
          className="mr-1 flex items-center gap-1.5 px-2 text-[12px] text-muted hover:bg-surface-subtle hover:text-fg disabled:opacity-40"
        >
          {slicing ? <Loader2 className="size-3 animate-spin" /> : <Play className="size-3 fill-current" />}
          Slice
        </button>
      </div>
      {doc ? (
        <div className="flex h-6 items-center gap-1 overflow-hidden border-b border-border px-2 text-[11px] text-faint">
          <span className="text-muted">GRAPHITE</span>
          <ChevronRight className="size-3 shrink-0" />
          <button type="button" className="truncate text-muted hover:text-fg" onClick={() => setActive(doc.id)}>
            {doc.name}
          </button>
          {selected ? (
            <>
              <ChevronRight className="size-3 shrink-0" />
              <button type="button" className="truncate text-fg hover:text-fg" onClick={() => select(selected.id)}>
                {selected.name}
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function StatusBar() {
  const doc = useApp((s) => s.doc);
  const parts = useApp((s) => s.parts);
  const settings = useApp((s) => s.slicerSettings);
  const result = useApp((s) => s.sliceResult);
  const issues = collectIssues(parts);
  const printer = printerById(settings.printerId);
  const measure = doc ? measureDoc(doc) : null;
  const setReportOpen = useApp((s) => s.setReportOpen);
  const setReportTab = useApp((s) => s.setReportTab);
  const setNavTab = useApp((s) => s.setNavTab);
  const progress = useApp((s) => s.slicerProgress);
  const error = useApp((s) => s.error);
  const phase = useApp((s) => s.phase);
  const slicing = progress >= 0 && progress < 1;

  let left = "Ready";
  if (error) left = "Failed";
  else if (slicing) left = `Slicing ${Math.round(progress * 100)}%`;
  else if (phase === "recognize") left = "Reading sketch…";
  else if (result) left = "Build succeeded";

  return (
    <footer className="hidden h-[22px] shrink-0 items-center gap-0 bg-status text-[11px] text-muted md:flex">
      <span
        className={cn(
          "flex h-full items-center px-2.5",
          error ? "bg-danger text-fg" : slicing ? "bg-surface-subtle text-fg" : "text-muted",
        )}
      >
        {left}
      </span>
      <button
        type="button"
        className="flex h-full items-center gap-1.5 px-2 hover:bg-surface-subtle hover:text-fg"
        onClick={() => {
          setReportOpen(true);
          setReportTab("problems");
          setNavTab("issues");
        }}
      >
        <CircleAlert className="size-3" />
        <span>{issues.length}</span>
        <AlertTriangle className="size-3" />
        <span>0</span>
      </button>
      {result ? (
        <button
          type="button"
          className="flex h-full items-center px-2 hover:bg-surface-subtle hover:text-fg"
          onClick={() => {
            setReportOpen(true);
            setReportTab("output");
          }}
        >
          {result.stats.layers} layers · {formatDuration(result.stats.timeSec)}
        </button>
      ) : null}
      <span className="ml-auto" />
      {measure && doc ? (
        <span className="px-2 tabular-nums">
          {measure.size.x.toFixed(1)} × {measure.size.z.toFixed(1)} × {measure.size.y.toFixed(1)} {doc.units}
        </span>
      ) : (
        <span className="px-2">No part</span>
      )}
      <span className="px-2">
        {printer.name} · {settings.material.toUpperCase()}
      </span>
      <span className="px-2 uppercase">{doc?.units ?? "mm"}</span>
      <span className="px-2">UTF-8</span>
      <span className="px-2 pr-3">Graphite CAD</span>
    </footer>
  );
}
