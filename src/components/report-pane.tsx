import { useMemo } from "react";
import { ChevronDown, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { collectIssues } from "@/lib/cad/issues";
import { printerById } from "@/lib/cad/printers";
import { formatDuration, sliceSourceKey } from "@/lib/cad/slicer";
import { useApp } from "@/lib/store";
import { cn, downloadBlob, slugify } from "@/lib/utils";

function previewGcode(gcode: string) {
  const lines = gcode.split("\n");
  if (lines.length <= 140) return gcode;
  const omitted = lines.length - 100;
  return [...lines.slice(0, 80), `; … ${omitted} lines omitted — download for the full file`, ...lines.slice(-20)].join(
    "\n",
  );
}

export function ReportPane() {
  const open = useApp((s) => s.reportOpen);
  const tab = useApp((s) => s.reportTab);
  const setOpen = useApp((s) => s.setReportOpen);
  const setTab = useApp((s) => s.setReportTab);
  const result = useApp((s) => s.sliceResult);
  const settings = useApp((s) => s.slicerSettings);
  const doc = useApp((s) => s.doc);
  const parts = useApp((s) => s.parts);
  const progress = useApp((s) => s.slicerProgress);
  const pipeline = useApp((s) => s.pipeline);
  const issues = collectIssues(parts);
  const docs = settings.kit && parts.length > 1 ? parts : doc ? [doc] : [];
  const key = docs.length ? sliceSourceKey(docs, settings) : "";
  const fresh = result && result.sourceKey === key ? result : null;
  const printer = printerById(settings.printerId);
  const slicing = progress >= 0 && progress < 1;
  const setActive = useApp((s) => s.setActive);
  const setSlicerOpen = useApp((s) => s.setSlicerOpen);
  const setInspectorOpen = useApp((s) => s.setInspectorOpen);

  const gcodeView = useMemo(() => (fresh ? previewGcode(fresh.gcode) : ""), [fresh]);

  if (!open) return null;

  return (
    <section className="hidden h-[220px] shrink-0 flex-col border-t border-border bg-surface md:flex">
      <div className="flex h-9 shrink-0 items-end gap-0 border-b border-border px-1">
        {(
          [
            ["problems", `PROBLEMS${issues.length ? ` ${issues.length}` : ""}`],
            ["output", "OUTPUT"],
            ["gcode", "G-CODE"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "h-8 px-3 text-[11px] tracking-[0.08em] uppercase",
              tab === id ? "border-b border-fg text-fg" : "text-faint hover:text-fg",
            )}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto" />
        <button
          type="button"
          aria-label="Hide panel"
          onClick={() => setOpen(false)}
          className="mb-1 mr-1 flex size-7 items-center justify-center text-faint hover:text-fg"
        >
          <ChevronDown className="size-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {tab === "problems" ? (
          issues.length ? (
            <ul className="px-1 py-1">
              {issues.map((item) => (
                <li key={item.question.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActive(item.partId);
                      setSlicerOpen(false);
                      setInspectorOpen(true);
                    }}
                    className="flex w-full items-start gap-3 px-3 py-1.5 text-left text-[13px] hover:bg-surface-subtle"
                  >
                    <span className="mt-0.5 text-danger">●</span>
                    <span className="min-w-0 flex-1">
                      <span className="text-fg">{item.question.prompt}</span>
                      <span className="ml-2 text-muted">{item.question.why}</span>
                    </span>
                    <span className="shrink-0 text-[12px] text-faint">{item.partName}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-[13px] text-muted">No problems have been detected in the workspace.</p>
          )
        ) : tab === "gcode" ? (
          fresh ? (
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-2 px-3 py-2">
                <p className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted">
                  {fresh.stats.layers} layers · {printer.firmware} · {printer.name}
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => void navigator.clipboard.writeText(fresh.gcode)}
                >
                  <Copy /> Copy
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    downloadBlob(
                      `${slugify(docs.map((d) => d.name).join("-") || "part")}.gcode`,
                      new Blob([fresh.gcode], { type: "text/plain" }),
                    )
                  }
                >
                  <Download /> Save
                </Button>
              </div>
              <pre className="min-h-0 flex-1 overflow-auto px-3 pb-3 font-mono text-[11px] leading-relaxed text-muted">
                {gcodeView}
              </pre>
            </div>
          ) : (
            <p className="p-4 text-[13px] text-muted">Run Slice (⌘R) to emit G-code. The file is the same on Mac and Windows.</p>
          )
        ) : (
          <div className="space-y-3 p-4">
            {slicing ? (
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                Slicing {Math.round(progress * 100)}%
              </p>
            ) : null}
            {fresh ? (
              <div>
                <p className="text-[13px] text-fg">
                  Build succeeded · {formatDuration(fresh.stats.timeSec)} · {fresh.stats.filamentGrams.toFixed(1)} g ·{" "}
                  {fresh.stats.layers} layers
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted">
                  {printer.name} · {settings.material.toUpperCase()} · {settings.layerHeight.toFixed(2)} mm ·{" "}
                  {fresh.stats.sizeX.toFixed(0)} × {fresh.stats.sizeY.toFixed(0)} × {fresh.stats.sizeZ.toFixed(0)} mm
                  {fresh.stats.fitsBed
                    ? ` on a ${printer.bedX} × ${printer.bedY} bed.`
                    : ` — larger than the ${printer.bedX} × ${printer.bedY} bed.`}
                </p>
                <p className="mt-1 text-[12px] text-faint">
                  G-code is Marlin/Klipper. Open on macOS or Windows, or drop the 3MF into Cura / PrusaSlicer / Bambu
                  Studio.
                </p>
              </div>
            ) : (
              <p className="text-[13px] text-muted">
                No slice yet. Run → Start Slicing, or press ⌘R. Output lands in this panel.
              </p>
            )}
            {issues.length ? (
              <p className="text-[12px] text-muted">
                {issues.length} open question{issues.length === 1 ? "" : "s"} in Problems — Graphite will not assume
                them.
              </p>
            ) : null}
            {doc?.pipelineNote ? <p className="text-[12px] leading-relaxed text-faint">{doc.pipelineNote}</p> : null}
            {pipeline.some((s) => s.status === "done") ? (
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                {pipeline.map((s) => s.label).join(" · ")}
              </p>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
