import { Command } from "cmdk";
import { ingestKit, ingestTemplate } from "@/lib/actions";
import { EXPORT_ITEMS, runExport } from "@/components/export-menu";
import { listTemplates } from "@/lib/cad/templates";
import { runSlice } from "@/lib/cad/run-slice";
import { useApp } from "@/lib/store";
import { openSketchFile } from "@/lib/utils";

export function CommandPalette() {
  const open = useApp((s) => s.commandOpen);
  const setOpen = useApp((s) => s.setCommandOpen);
  const parts = useApp((s) => s.parts);
  const doc = useApp((s) => s.doc);
  const setActive = useApp((s) => s.setActive);
  const select = useApp((s) => s.select);
  const setNavOpen = useApp((s) => s.setNavOpen);
  const setInspectorOpen = useApp((s) => s.setInspectorOpen);
  const setReportOpen = useApp((s) => s.setReportOpen);
  const setNavTab = useApp((s) => s.setNavTab);
  const toggleActivity = useApp((s) => s.toggleActivity);
  const reset = useApp((s) => s.reset);
  const samples = listTemplates();

  function go(fn: () => void) {
    setOpen(false);
    fn();
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command Palette"
      overlayClassName="command-overlay"
      contentClassName="command-dialog"
    >
      <Command.Input placeholder="Type a command or search…" />
      <Command.List>
        <Command.Empty>No matching commands</Command.Empty>
        {parts.length ? (
          <Command.Group heading="Parts">
            {parts.map((p) => (
              <Command.Item key={p.id} value={`part ${p.name}`} onSelect={() => go(() => setActive(p.id))}>
                {p.name}
              </Command.Item>
            ))}
          </Command.Group>
        ) : null}
        {doc ? (
          <Command.Group heading="Features">
            {doc.features.map((f) => (
              <Command.Item
                key={f.id}
                value={`feature ${f.name} ${f.kind}`}
                onSelect={() =>
                  go(() => {
                    select(f.id);
                    setNavTab("project");
                  })
                }
              >
                {f.name}
                <span className="ml-auto font-mono text-[10px] uppercase tracking-wide text-faint">{f.kind}</span>
              </Command.Item>
            ))}
          </Command.Group>
        ) : null}
        <Command.Group heading="Samples">
          {samples.map((s) => (
            <Command.Item key={s.id} value={`sample ${s.title} ${s.blurb}`} onSelect={() => go(() => void ingestTemplate(s.id))}>
              {s.title}
            </Command.Item>
          ))}
          <Command.Item value="kit bracket bushing" onSelect={() => go(() => void ingestKit(["bracket", "bushing"]))}>
            L-bracket + bushing
          </Command.Item>
        </Command.Group>
        <Command.Group heading="View">
          <Command.Item value="view explorer sidebar" onSelect={() => go(() => toggleActivity("project"))}>
            View: Explorer
          </Command.Item>
          <Command.Item value="view search" onSelect={() => go(() => toggleActivity("search"))}>
            View: Search
          </Command.Item>
          <Command.Item value="view problems issues" onSelect={() => go(() => toggleActivity("issues"))}>
            View: Problems
          </Command.Item>
          <Command.Item value="view capture" onSelect={() => go(() => toggleActivity("capture"))}>
            View: Capture
          </Command.Item>
          <Command.Item value="view run slice" onSelect={() => go(() => toggleActivity("run"))}>
            View: Run and Slice
          </Command.Item>
          <Command.Item value="toggle primary side bar" onSelect={() => go(() => setNavOpen(!useApp.getState().navOpen))}>
            View: Toggle Primary Side Bar
          </Command.Item>
          <Command.Item
            value="toggle secondary side bar inspector"
            onSelect={() => go(() => setInspectorOpen(!useApp.getState().inspectorOpen))}
          >
            View: Toggle Secondary Side Bar
          </Command.Item>
          <Command.Item value="toggle panel report" onSelect={() => go(() => setReportOpen(!useApp.getState().reportOpen))}>
            View: Toggle Panel
          </Command.Item>
        </Command.Group>
        <Command.Group heading="Capture">
          <Command.Item value="capture photo upload" onSelect={() => go(() => openSketchFile())}>
            Photo of a sketch
          </Command.Item>
          <Command.Item value="capture camera" onSelect={() => go(() => useApp.getState().setCaptureMode("camera"))}>
            Live camera
          </Command.Item>
          <Command.Item value="capture draw sketch" onSelect={() => go(() => useApp.getState().setCaptureMode("draw"))}>
            Draw
          </Command.Item>
          <Command.Item value="capture gesture hand" onSelect={() => go(() => useApp.getState().setCaptureMode("gesture"))}>
            Live hand gesture
          </Command.Item>
          <Command.Item value="capture voice speak" onSelect={() => go(() => useApp.getState().setCaptureMode("voice"))}>
            Spoken description
          </Command.Item>
          <Command.Item value="capture describe text" onSelect={() => go(() => useApp.getState().setCaptureMode("describe"))}>
            Written description
          </Command.Item>
        </Command.Group>
        <Command.Group heading="Actions">
          <Command.Item value="open sketch" onSelect={() => go(() => openSketchFile())}>
            Open Sketch…
          </Command.Item>
          <Command.Item disabled={!doc} value="slice run product" onSelect={() => go(() => void runSlice())}>
            Start Slicing
          </Command.Item>
          {EXPORT_ITEMS.filter(([k]) => k !== "slice").map(([k, label]) => (
            <Command.Item key={k} disabled={!doc} value={`export ${label}`} onSelect={() => go(() => void runExport(k))}>
              Export {label}
            </Command.Item>
          ))}
          <Command.Item value="new session reset welcome" onSelect={() => go(() => reset())}>
            New Session
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
