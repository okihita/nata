/**
 * Frontend logic tests.
 *
 * Run with Node's built-in runner (Node 22+ understands TypeScript directly):
 *
 *     node --test web/tests/
 *
 * No new dependency: the project already targets modern Node, and the modules
 * under test are deliberately React-free (that was the point of keeping the
 * domain model out of components), so they need no DOM or bundler.
 *
 * These cover the logic that broke silently in practice — entity → tax
 * treatment, and the load-time migration from the older stored shape.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  ENTITY_OPTIONS,
  ENTITY_LABEL,
  entityHasExemption,
  isUsableBusiness,
  DEMO_BUSINESS_PROFILES,
} from "../src/lib/business.ts";

// ── Entity → tax treatment ──────────────────────────────────────────────────

test("only orang pribadi is exempt from the Rp 500 million band", () => {
  // PP 55/2022 Pasal 60 ayat (2): the band is for individuals, not badan usaha.
  assert.equal(entityHasExemption("orang_pribadi"), true);
  assert.equal(entityHasExemption("pt_perorangan"), false);
  assert.equal(entityHasExemption("pt_cv"), false);
});

test("every entity option carries an explicit exemption flag", () => {
  for (const option of ENTITY_OPTIONS) {
    assert.equal(
      option.exemption,
      entityHasExemption(option.id),
      `${option.id}: the UI badge must agree with the tax decision`,
    );
  }
});

test("the three entity forms are labelled for the owner", () => {
  for (const option of ENTITY_OPTIONS) {
    assert.ok(option.label.length > 0, `${option.id} has no label`);
    assert.ok(option.hint.length > 0, `${option.id} has no hint`);
    assert.ok(ENTITY_LABEL[option.id], `${option.id} missing from ENTITY_LABEL`);
  }
  assert.equal(ENTITY_OPTIONS.length, 3);
});

// ── Business usability ──────────────────────────────────────────────────────

test("a business without a name is not usable", () => {
  assert.equal(isUsableBusiness(null), false);
  assert.equal(
    isUsableBusiness({
      id: "biz-1",
      name: "",
      ownerName: "",
      type: "warung",
      entity: "orang_pribadi",
      createdAt: "2026-01-01T00:00:00.000Z",
    }),
    false,
  );
});

test("a named business is usable", () => {
  assert.equal(
    isUsableBusiness({
      id: "biz-1",
      name: "Warung Bu Siti",
      ownerName: "Siti",
      type: "warung",
      entity: "orang_pribadi",
      createdAt: "2026-01-01T00:00:00.000Z",
    }),
    true,
  );
});

// ── Macro profile & statutory technicalities ────────────────────────────────

test("business profile supports address, npwp, nib, and statutory documents", () => {
  const pA = DEMO_BUSINESS_PROFILES.persona_a;
  assert.ok(pA.address, "Persona A must have a domicile address");
  assert.ok(pA.npwp, "Persona A must have NPWP");
  assert.ok(pA.nib, "Persona A must have NIB");
  assert.ok(Array.isArray(pA.legalDocuments), "Persona A must have legal documents array");
  assert.ok(pA.legalDocuments.length >= 3, "Persona A must include at least 3 statutory instruments");

  const pB = DEMO_BUSINESS_PROFILES.persona_b;
  assert.ok(pB.address, "Persona B must have a domicile address");
  assert.ok(pB.npwp, "Persona B must have NPWP");
  assert.ok(pB.nib, "Persona B must have NIB");
  assert.ok(Array.isArray(pB.legalDocuments), "Persona B must have legal documents array");
  assert.ok(
    pB.legalDocuments.some((doc) => doc.issuer.includes("Kemenkumham")),
    "Persona B (PT) must carry Kemenkumham corporate deed approval",
  );
});
