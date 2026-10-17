/**
 * Business persistence round-trip.
 *
 * `business.ts` reads and writes localStorage and deliberately touches `window`
 * only inside its functions, so a minimal stub is enough to exercise the real
 * load/save code in Node.
 *
 * The subtle part is invalidation: clearing the KBLI sets `kbliCode: undefined`,
 * and whether the key actually disappears depends on `JSON.stringify` dropping
 * undefined values. If that assumption breaks, a changed business type would
 * keep showing a code verified for its *previous* activity — silently.
 */

import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

import {
  BUSINESS_STORAGE_KEY,
  clearBusiness,
  loadBusiness,
  saveBusiness,
  newBusinessId,
  type Business,
} from "../src/lib/business.ts";

/** Minimal localStorage so the real functions run unmodified. */
const store = new Map<string, string>();
(globalThis as unknown as { window: unknown }).window = {
  localStorage: {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, String(v)),
    removeItem: (k: string) => void store.delete(k),
  },
};

beforeEach(() => store.clear());

const ENTITY = "orang_pribadi" as const;
const BIZ: Business = {
  id: "biz-1",
  name: "Warung Bu Siti",
  ownerName: "Siti",
  type: "warung",
  entity: ENTITY,
  createdAt: "2026-10-17T00:00:00.000Z",
};

test("a saved business loads back identically", () => {
  saveBusiness(BIZ);
  assert.deepEqual(loadBusiness(), BIZ);
});

test("an absent record loads as null", () => {
  assert.equal(loadBusiness(), null);
});

test("a corrupt record loads as null rather than throwing", () => {
  store.set(BUSINESS_STORAGE_KEY, "{not json");
  assert.equal(loadBusiness(), null);
});

test("a record with no id or name is rejected", () => {
  store.set(BUSINESS_STORAGE_KEY, JSON.stringify({ name: "x" }));
  assert.equal(loadBusiness(), null);
  store.set(BUSINESS_STORAGE_KEY, JSON.stringify({ id: "biz-1", name: "" }));
  assert.equal(loadBusiness(), null);
});

// ── The migration from the old two-value model ──────────────────────────────

test("a legacy `badan` record migrates to pt_cv, which taxes the same", () => {
  store.set(
    BUSINESS_STORAGE_KEY,
    JSON.stringify({
      id: "biz-old",
      name: "PT Lama",
      ownerName: "",
      type: "toko",
      taxpayer: "badan",
      createdAt: "2026-01-01T00:00:00.000Z",
    }),
  );
  const migrated = loadBusiness();
  assert.equal(migrated?.entity, "pt_cv");
  assert.equal(migrated?.name, "PT Lama");
});

test("a legacy `orang_pribadi` record keeps the individual band", () => {
  store.set(
    BUSINESS_STORAGE_KEY,
    JSON.stringify({
      id: "biz-old2",
      name: "Warung Lama",
      ownerName: "",
      type: "warung",
      taxpayer: "orang_pribadi",
      createdAt: "2026-01-01T00:00:00.000Z",
    }),
  );
  assert.equal(loadBusiness()?.entity, "orang_pribadi");
});

// ── Invalidation ────────────────────────────────────────────────────────────

test("clearing the KBLI removes the key entirely", () => {
  saveBusiness({ ...BIZ, kbliCode: "56102", kbliTitle: "Rumah/Warung Makan" });
  assert.equal(loadBusiness()?.kbliCode, "56102");

  // This is what `updateBusiness` does on a type change.
  saveBusiness({
    ...loadBusiness()!,
    kbliCode: undefined,
    kbliTitle: undefined,
    kbliHierarchy: undefined,
  });

  const after = loadBusiness();
  assert.equal(after?.kbliCode, undefined);
  assert.ok(
    !Object.hasOwn(after as object, "kbliCode"),
    "an undefined KBLI must not survive as a stored key",
  );
  assert.ok(
    !(store.get(BUSINESS_STORAGE_KEY) ?? "").includes("kbliCode"),
    "the serialised record should not mention kbliCode at all",
  );
});

test("clearing the business removes the record", () => {
  saveBusiness(BIZ);
  clearBusiness();
  assert.equal(loadBusiness(), null);
});

test("ids are unique", () => {
  const ids = new Set(Array.from({ length: 200 }, () => newBusinessId()));
  assert.equal(ids.size, 200);
});
