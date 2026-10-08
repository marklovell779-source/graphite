import { toast } from "sonner";
import { sliceDocuments } from "@/lib/cad/slicer";
import { useApp } from "@/lib/store";

export async function runSlice() {
  const app = useApp.getState();
  const { doc, parts, slicerSettings } = app;
  const docs = slicerSettings.kit && parts.length > 1 ? parts : doc ? [doc] : [];
  if (!docs.length) {
    toast.error("Confirm a part first.");
    return;
  }
  app.setSlicerOpen(true);
  app.setInspectorOpen(true);
  app.setReportOpen(true);
  app.setReportTab("output");
  app.setSlicerProgress(0);
  try {
    const sliced = await sliceDocuments(docs, slicerSettings, app.setSlicerProgress);
    app.setSliceResult(sliced);
  } catch (err) {
    toast.error(err instanceof Error ? err.message : "Slice failed.");
    app.setSlicerProgress(-1);
  }
}
