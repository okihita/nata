/**
 * Unit and flow tests for Onboarding persona switching and dictionary parity.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { DEMO_BUSINESS_PROFILES } from "../src/lib/business.ts";
import { copyEn } from "../src/lib/copy-en.ts";
import { copyId } from "../src/lib/copy-id.ts";

test("onboarding dictionary maintains exact key parity across English and Indonesian", () => {
  const enOnboarding = copyEn.onboarding;
  const idOnboarding = copyId.onboarding;

  assert.deepEqual(
    Object.keys(enOnboarding).sort(),
    Object.keys(idOnboarding).sort(),
    "Top-level onboarding dictionary keys must match"
  );

  assert.deepEqual(
    Object.keys(enOnboarding.cards).sort(),
    Object.keys(idOnboarding.cards).sort(),
    "Onboarding card categories must match"
  );

  for (const card of ["retail", "fnb", "scratch"] as const) {
    assert.deepEqual(
      Object.keys(enOnboarding.cards[card]).sort(),
      Object.keys(idOnboarding.cards[card]).sort(),
      `Keys in card ${card} must match exactly`
    );
  }
});

test("Persona A (Retail) and Persona B (F&B) contain complete business profiles", () => {
  const pA = DEMO_BUSINESS_PROFILES.persona_a;
  assert.equal(pA.id, "biz-persona-a");
  assert.equal(pA.name, "Rona Kirana Beauty");
  assert.equal(pA.type, "toko");
  assert.equal(pA.kbliCode, "47725");

  const pB = DEMO_BUSINESS_PROFILES.persona_b;
  assert.equal(pB.id, "biz-persona-b");
  assert.equal(pB.name, "PT Seduh Rasa Nusantara");
  assert.equal(pB.type, "kafe");
  assert.equal(pB.kbliCode, "56303");
});

test("English onboarding copy accurately references archetypes and SAK EMKM", () => {
  const O = copyEn.onboarding;
  assert.equal(O.cards.retail.title, "Retail & E-Commerce");
  assert.equal(O.cards.fnb.title, "Cafe & Restaurant");
  assert.equal(O.cards.scratch.title, "Start from Scratch");
  assert.match(O.footnote, /SAK EMKM/);
});

test("Indonesian onboarding copy accurately references archetypes and SAK EMKM", () => {
  const O = copyId.onboarding;
  assert.equal(O.cards.retail.title, "Ritel & E-Commerce");
  assert.equal(O.cards.fnb.title, "Kafe & Restoran");
  assert.equal(O.cards.scratch.title, "Mulai dari Nol");
  assert.match(O.footnote, /SAK EMKM/);
});
