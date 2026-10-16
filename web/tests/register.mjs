/**
 * Test-time module resolver.
 *
 * The app's modules import each other bundler-style (`./copy`, `@/lib/store`),
 * which Next resolves and Node does not: Node's ESM resolver requires an
 * explicit file extension, and knows nothing about the `@/*` path alias.
 *
 * This hook teaches `node --test` those two rules so the *existing source files*
 * can be tested as they are. The alternative — rewriting app imports to carry
 * `.ts` extensions — would change production code to suit the test runner, which
 * is the wrong way round.
 *
 * Usage: `node --import ./tests/register.mjs --test 'tests/**\/*.test.ts'`
 */

import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./resolver.mjs", pathToFileURL(import.meta.filename));
