import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function PipelineOverlay() {
  const phase = useApp((s) => s.phase);
  const pipeline = useApp((s) => s.pipeline);
  if (phase !== "recognize") return null;
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-bg/70 p-6">
      <ol className="w-full max-w-sm space-y-3">
        {pipeline.map((s) => (
          <li key={s.id} className="flex items-start gap-3">
            <span
              className={cn(
                "mt-1 size-1.5 shrink-0 rounded-full",
                s.status === "done" && "bg-ok",
                s.status === "active" && "bg-fg",
                s.status === "pending" && "bg-faint",
              )}
            />
            <div>
              <p className={cn("text-sm", s.status === "pending" ? "text-faint" : "text-fg")}>{s.label}</p>
              {s.detail ? <p className="font-mono text-[11px] text-muted">{s.detail}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
