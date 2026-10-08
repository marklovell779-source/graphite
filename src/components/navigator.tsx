import { Ellipsis } from "lucide-react";
import { CaptureBar, KitCard, SampleGrid } from "@/components/capture";
import { FeaturePanel } from "@/components/feature-panel";
import { SlicerPanel } from "@/components/slicer-panel";
import { Input } from "@/components/ui/input";
import { collectIssues } from "@/lib/cad/issues";
import { useApp, type NavTab } from "@/lib/store";

const TITLES: Record<NavTab, string> = {
  project: "Explorer",
  issues: "Problems",
  search: "Search",
  capture: "Capture",
  run: "Run and Slice",
};

export function Navigator() {
  const tab = useApp((s) => s.navTab);
  const parts = useApp((s) => s.parts);
  const issues = collectIssues(parts);

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      <div className="flex h-9 shrink-0 items-center px-4">
        <p className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase">{TITLES[tab]}</p>
        <span className="ml-auto text-faint">
          <Ellipsis className="size-4" />
        </span>
      </div>
      <div className="min-h-0 min-w-0 flex-1">
        {tab === "issues" ? (
          <IssueList issues={issues} />
        ) : tab === "search" ? (
          <SearchList />
        ) : tab === "capture" ? (
          <CaptureView />
        ) : tab === "run" ? (
          <SlicerPanel />
        ) : (
          <FeaturePanel />
        )}
      </div>
    </div>
  );
}

function CaptureView() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto p-3">
      <p className="text-[13px] leading-relaxed text-muted">
        Photo, draw, speak, or gesture. Graph paper, napkin, whiteboard, coaster — Graphite never assumes.
      </p>
      <CaptureBar />
      <KitCard />
      <SampleGrid compact />
    </div>
  );
}

function IssueList({ issues }: { issues: ReturnType<typeof collectIssues> }) {
  const setActive = useApp((s) => s.setActive);
  const setSlicerOpen = useApp((s) => s.setSlicerOpen);
  const setMobileTab = useApp((s) => s.setMobileTab);
  const setInspectorOpen = useApp((s) => s.setInspectorOpen);

  if (!issues.length) {
    return (
      <div className="flex h-full flex-col gap-2 px-4 py-2">
        <p className="text-[13px] leading-relaxed text-muted">
          No problems have been detected in the workspace. Confirm a sketch and Graphite will list anything it refuses
          to assume.
        </p>
      </div>
    );
  }

  return (
    <ul className="min-h-0 flex-1 overflow-y-auto px-1 pb-3">
      {issues.map((item) => (
        <li key={item.question.id}>
          <button
            type="button"
            onClick={() => {
              setActive(item.partId);
              setSlicerOpen(false);
              setInspectorOpen(true);
              setMobileTab("talk");
            }}
            className="flex w-full flex-col items-start gap-0.5 rounded-none px-3 py-2 text-left hover:bg-surface-subtle"
          >
            <span className="text-[11px] text-faint">{item.partName}</span>
            <span className="text-[13px] text-fg">{item.question.prompt}</span>
            <span className="text-[12px] leading-relaxed text-muted">{item.question.why}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function SearchList() {
  const query = useApp((s) => s.searchQuery);
  const setQuery = useApp((s) => s.setSearchQuery);
  const parts = useApp((s) => s.parts);
  const setActive = useApp((s) => s.setActive);
  const select = useApp((s) => s.select);
  const q = query.trim().toLowerCase();
  const hits = parts.flatMap((p) => {
    const partHit = !q || p.name.toLowerCase().includes(q);
    const features = p.features.filter(
      (f) => !q || f.name.toLowerCase().includes(q) || f.kind.toLowerCase().includes(q),
    );
    if (!partHit && !features.length) return [];
    return [{ part: p, features: q && !partHit ? features : q ? features : p.features }];
  });

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="px-3 pb-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="h-8 rounded-none text-[13px]"
        />
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto px-1 pb-3">
        {hits.length === 0 ? (
          <li className="px-3 py-3 text-[13px] text-muted">
            {parts.length ? "No results found." : "Load a sketch first."}
          </li>
        ) : (
          hits.map(({ part, features }) => (
            <li key={part.id} className="mb-1">
              <button
                type="button"
                onClick={() => setActive(part.id)}
                className="flex h-7 w-full items-center rounded-none px-3 text-left text-[13px] text-fg hover:bg-surface-subtle"
              >
                {part.name}
              </button>
              <ul>
                {features.map((f) => (
                  <li key={f.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setActive(part.id);
                        select(f.id);
                      }}
                      className="flex h-7 w-full items-center gap-2 rounded-none px-3 pl-6 text-left text-[13px] text-muted hover:bg-surface-subtle hover:text-fg"
                    >
                      <span className="min-w-0 flex-1 truncate">{f.name}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">{f.kind}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
