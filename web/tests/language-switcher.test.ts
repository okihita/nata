/**
 * Unit and state tests for Language Switcher and Internationalization.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { getLocale, setLocale } from "../src/lib/language.ts";
import { copyEn } from "../src/lib/copy-en.ts";
import { copyId } from "../src/lib/copy-id.ts";

test("default language is English for evaluation and hackathon juries", () => {
  setLocale("en");
  assert.equal(getLocale(), "en");
});

test("language switcher updates active locale to Indonesian and back to English", () => {
  setLocale("id");
  assert.equal(getLocale(), "id");

  setLocale("en");
  assert.equal(getLocale(), "en");
});

test("landing dictionary exists with exact key parity across English and Indonesian", () => {
  const enLandingKeys = Object.keys(copyEn.landing).sort();
  const idLandingKeys = Object.keys(copyId.landing).sort();
  assert.deepEqual(enLandingKeys, idLandingKeys, "Landing dictionary keys must match identically");

  const enCapKeys = Object.keys(copyEn.landing.capabilities).sort();
  const idCapKeys = Object.keys(copyId.landing.capabilities).sort();
  assert.deepEqual(enCapKeys, idCapKeys, "Capabilities dictionary keys must match identically");
});

test("English landing copy accurately reflects hackathon guidelines", () => {
  assert.equal(copyEn.landing.ctaButton, "Get Started Free");
  assert.equal(copyEn.landing.navStart, "Get Started");
  assert.match(copyEn.landing.heroTitle, /From receipt photos to balanced books/);
  assert.match(copyEn.landing.heroBadge, /Gemini on Google Cloud/);
});

test("Indonesian landing copy accurately reflects domestic MSME terms", () => {
  assert.equal(copyId.landing.ctaButton, "Mulai gratis sekarang");
  assert.equal(copyId.landing.navStart, "Mulai sekarang");
  assert.match(copyId.landing.heroTitle, /Dari foto struk/);
  assert.match(copyId.landing.heroBadge, /Gemini di Google Cloud/);
});
