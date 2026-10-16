/**
 * Resolver hook: bundler-style specifiers → real files on disk.
 *
 * Two rewrites:
 *   `@/lib/foo`  →  `<web>/src/lib/foo.ts`   (the tsconfig path alias)
 *   `./foo`      →  `./foo.ts` / `./foo.tsx` / `./foo/index.ts`
 *
 * Only extensions Node cannot infer are touched; anything it can already resolve
 * is left alone.
 */

import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const WEB_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_ROOT = path.join(WEB_ROOT, "src");

/** Candidate file paths for a specifier that lacks an extension. */
function candidates(basePath) {
  return [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.tsx"),
  ];
}

function firstExisting(paths) {
  return paths.find((p) => existsSync(p)) ?? null;
}

export async function resolve(specifier, context, nextResolve) {
  // `@/x` → `<web>/src/x`
  if (specifier.startsWith("@/")) {
    const target = firstExisting(candidates(path.join(SRC_ROOT, specifier.slice(2))));
    if (target) return nextResolve(pathToFileURL(target).href, context);
  }

  // Relative specifier without an extension → try the extensions above.
  if (specifier.startsWith(".") && path.extname(specifier) === "") {
    const parent = context.parentURL ? path.dirname(fileURLToPath(context.parentURL)) : WEB_ROOT;
    const target = firstExisting(candidates(path.resolve(parent, specifier)));
    if (target) return nextResolve(pathToFileURL(target).href, context);
  }

  return nextResolve(specifier, context);
}
