import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { documentToGcode, documentToStep, fallbackGeometry, geometryTo3mf, geometryToStl } from "@/lib/cad/export";
import { buildSolid } from "@/lib/cad/geometry";
import type { CadDocument } from "@/lib/cad/types";
import { useApp } from "@/lib/store";
import { downloadBlob, slugify, zipBlobs } from "@/lib/utils";

export type ExportKind = "stl" | "step" | "mill" | "3mf" | "pack" | "kit" | "slice";

export const EXPORT_ITEMS: Array<[ExportKind, string]> = [
  ["slice", "Slice — FDM G-code"],
  ["3mf", "3MF — Cura / Prusa / Bambu"],
  ["stl", "STL — mesh"],
  ["mill", "G-code — mill"],
  ["step", "STEP — CAD"],
  ["pack", "CAD pack (zip)"],
];

async function meshOf(target: CadDocument) {
  const built = await buildSolid(target.features);
  const geo = built?.geometry ?? fallbackGeometry(target);
  if (target.units === "in") geo.scale(25.4, 25.4, 25.4);
  return geo;
}

async function filesFor(target: CadDocument, kinds: Array<"stl" | "step" | "mill" | "3mf">) {
  const slug = slugify(target.name);
  const out: { name: string; blob: Blob }[] = [];
  for (const kind of kinds) {
    if (kind === "stl") {
      const geo = await meshOf(target);
      out.push({ name: `${slug}.stl`, blob: geometryToStl(geo, target.name) });
    } else if (kind === "step") {
      out.push({ name: `${slug}.step`, blob: documentToStep(target) });
    } else if (kind === "3mf") {
      const geo = await meshOf(target);
      out.push({ name: `${slug}.3mf`, blob: await geometryTo3mf(geo, target.name) });
    } else {
      out.push({ name: `${slug}.nc`, blob: documentToGcode(target) });
    }
  }
  return out;
}

export async function runExport(kind: ExportKind) {
  const { doc, parts, setSlicerOpen } = useApp.getState();
  if (kind === "slice") {
    setSlicerOpen(true);
    return;
  }
  if (!doc) return;
  if (kind === "kit") {
    const files: { name: string; blob: Blob }[] = [];
    for (const p of parts) {
      const pack = await filesFor(p, ["stl", "3mf"]);
      files.push(...pack);
    }
    downloadBlob("graphite-kit.zip", await zipBlobs(files));
    return;
  }
  if (kind === "pack") {
    const files = await filesFor(doc, ["stl", "3mf", "step"]);
    downloadBlob(`${slugify(doc.name)}-cad-pack.zip`, await zipBlobs(files));
    return;
  }
  const [file] = await filesFor(doc, [kind]);
  if (file) downloadBlob(file.name, file.blob);
}

export function ExportMenu() {
  const doc = useApp((s) => s.doc);
  const parts = useApp((s) => s.parts);
  if (!doc) return null;
  const items = parts.length > 1 ? ([...EXPORT_ITEMS, ["kit", `All ${parts.length} parts (zip)`]] as Array<[ExportKind, string]>) : EXPORT_ITEMS;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button type="button" size="sm" variant="outline">
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {items.map(([k, label]) => (
          <DropdownMenuItem key={k} onSelect={() => void runExport(k)}>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
