/**
 * Dynamic internationalization entry point.
 * Re-exports English by default, while supporting dynamic reactive switching via useLanguage().
 */

import { copyEn } from "./copy-en";
import { copyId } from "./copy-id";

export { copyEn, copyId };
export { useLanguage, setLocale, type Locale } from "./language";

/**
 * Backward-compatible static copy export (defaults to English for juries).
 * Client components can import useLanguage() to dynamically react to locale changes.
 */
export const copy = copyEn;
