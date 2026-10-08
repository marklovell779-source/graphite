import { Box, Cylinder, Eye, EyeOff, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SampleGrid } from "@/components/capture";
import type { FeatureKind } from "@/lib/cad/types";
import { PARAM_META } from "@/lib/cad/types";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useState } from "react";

const ADDABLE: { kind: FeatureKind; label: string }[] = [
  { kind: "box", label: "Box" },
  { kind: "cylinder", label: "Cyl" },
  { kind: "hole", label: "Hole" },
  { kind: "slot", label: "Slot" },
  { kind: "pocket", label: "Pocket" },
  { kind: "wedge", label: "Wedge" },
];

export function FeaturePanel() {
  const doc = useApp((s) => s.doc);
  const parts = useApp((s) => s.parts);
  const activeId = useApp((s) => s.activeId);
  const setActive = useApp((s) => s.setActive);
  const removePart = useApp((s) => s.removePart);
  const selectedId = useApp((s) => s.selectedId);
  const select = useApp((s) => s.select);
  const updateParam = useApp((s) => s.updateParam);
  const addFeature = useApp((s) => s.addFeature);
  const removeFeature = useApp((s) => s.removeFeature);
  const toggleHidden = useApp((s) => s.toggleHidden);
  const [adding, setAdding] = useState(false);
  const unit = doc?.units ?? "mm";
  const selected = doc?.features.find((f) => f.id === selectedId);
  const meta = selected ? PARAM_META[selected.kind] : [];

  if (!doc) {
    return (
      <div className="flex h-full flex-col gap-3 p-4">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-faint">Feature tree</p>
        <p className="text-sm text-muted">
          A model will land here after the router classifies an input. Open a sample from the Explorer or Capture view.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-faint">Parts</p>
        <ul className="mt-2 flex flex-col gap-1">
          {parts.map((p) => {
            const active = p.id === activeId;
            return (
              <li key={p.id} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActive(p.id)}
                  className={cn(
                    "flex h-10 min-w-0 flex-1 items-center rounded-none px-2 text-left text-sm md:h-8",
                    active ? "bg-surface-subtle text-fg" : "text-muted hover:bg-surface-subtle/70 hover:text-fg",
                  )}
                >
                  <span className="truncate">{p.name}</span>
                </button>
                {parts.length > 1 ? (
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    aria-label={`Remove ${p.name}`}
                    onClick={() => removePart(p.id)}
                  >
                    <Trash2 />
                  </Button>
                ) : null}
              </li>
            );
          })}
        </ul>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="mt-2 w-full"
          onClick={() => setAdding((v) => !v)}
        >
          <Plus />
          {adding ? "Hide sketches" : "Add part"}
        </Button>
        {adding ? (
          <div className="mt-2 max-h-48 overflow-y-auto">
            <SampleGrid compact />
          </div>
        ) : null}
      </div>
      <div className="flex items-center justify-between px-4 pt-2 pb-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-faint">Feature tree</p>
          <p className="mt-1 text-sm text-fg">{doc.name}</p>
        </div>
        <span className="font-mono text-[10px] tabular-nums text-muted">{doc.features.length}</span>
      </div>
      <div className="flex flex-wrap gap-1 px-4 pb-3">
        {ADDABLE.map((a) => (
          <Button key={a.kind} type="button" size="sm" variant="outline" onClick={() => addFeature(a.kind)}>
            <Plus />
            {a.label}
          </Button>
        ))}
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        {doc.features.map((f) => {
          const Icon = f.op === "subtract" ? Minus : f.kind === "cylinder" ? Cylinder : Box;
          const active = f.id === selectedId;
          return (
            <li key={f.id}>
              <button
                type="button"
                onClick={() => select(f.id)}
                className={cn(
                  "flex h-11 w-full items-center gap-2 rounded-none px-2 text-left text-sm md:h-8",
                  active ? "bg-surface-subtle text-fg" : "text-muted hover:bg-surface-subtle/70 hover:text-fg",
                  f.hidden && "opacity-40",
                )}
              >
                <Icon className="size-3.5 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{f.name}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">{f.kind}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {selected ? (
        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium">{selected.name}</p>
            <div className="flex">
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={() => toggleHidden(selected.id)}
                aria-label={selected.hidden ? "Show feature" : "Hide feature"}
              >
                {selected.hidden ? <EyeOff /> : <Eye />}
              </Button>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={() => removeFeature(selected.id)}
                aria-label="Delete feature"
              >
                <Trash2 />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {meta.map((p) => {
              const value = selected.params[p.key] ?? 0;
              return (
                <label key={p.key} className="block">
                  <span className="mb-2 flex items-center justify-between text-xs text-muted">
                    {p.label}
                    <span className="font-mono tabular-nums text-fg">
                      {value.toFixed(value < 10 ? 2 : 1)} {unit}
                    </span>
                  </span>
                  <Slider
                    min={p.min}
                    max={p.max}
                    step={p.step}
                    value={[value]}
                    onValueChange={([v]) => updateParam(selected.id, p.key, v ?? value)}
                  />
                </label>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
