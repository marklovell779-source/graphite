import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function withTs(abs) {
  if (existsSync(abs)) return abs;
  if (existsSync(`${abs}.ts`)) return `${abs}.ts`;
  if (existsSync(`${abs}.tsx`)) return `${abs}.tsx`;
  if (existsSync(join(abs, "index.ts"))) return join(abs, "index.ts");
  return abs;
}

export function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const abs = withTs(join(root, "src", specifier.slice(2)));
    return nextResolve(pathToFileURL(abs).href, context);
  }
  if (specifier.startsWith(".") && context.parentURL?.includes("/src/")) {
    const abs = withTs(fileURLToPath(new URL(specifier, context.parentURL)));
    if (abs !== fileURLToPath(new URL(specifier, context.parentURL))) {
      return nextResolve(pathToFileURL(abs).href, context);
    }
  }
  return nextResolve(specifier, context);
}
