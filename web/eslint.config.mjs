import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local scratch: screenshots and one-off capture scripts, not source.
    ".scratch/**",
  ]),
  {
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXAttribute[name.name='className'] > Literal[value=/text-\\[(10|11|[0-9])px\\]/]",
          message: "Sub-12px font sizes (text-[10px], text-[11px], etc.) are banned. The absolute minimum font size is text-xs (12px).",
        },
      ],
    },
  },
]);

export default eslintConfig;
