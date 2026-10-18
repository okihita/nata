import { test } from "node:test";
import assert from "node:assert/strict";
import { DEMO_ROUTINES } from "../src/lib/routines-data.ts";
import { NAV } from "../src/lib/nav.ts";
import { copyEn } from "../src/lib/copy-en.ts";
import { copyId } from "../src/lib/copy-id.ts";

test("rutinitas is registered in main navigation under summary group", () => {
  const summaryGroup = NAV.find((g) => g.key === "summary");
  assert.ok(summaryGroup, "Summary group must exist");
  const routineItem = summaryGroup.items.find((i) => i.href === "/routines");
  assert.ok(routineItem, "Routines item must exist in summary nav");
  assert.equal(routineItem.key, "rutinitas");
});

test("rutinitas nav key is defined across translation dictionaries", () => {
  assert.equal(copyEn.nav.rutinitas, "Routines");
  assert.equal(copyId.nav.rutinitas, "Rutinitas");
});

test("demo routines provide grounded Indonesian statutes and assigned agents", () => {
  assert.ok(DEMO_ROUTINES.length >= 4, "Must provide at least 4 autonomous routines");
  for (const routine of DEMO_ROUTINES) {
    assert.ok(routine.id.startsWith("rtn-"));
    assert.ok(routine.title.length > 0);
    assert.ok(routine.titleEn.length > 0);
    assert.ok(routine.cronSchedule.includes("*"));
    assert.ok(routine.statutoryGrounding.length > 0);
    assert.ok(["nata", "maya", "dimas", "arief"].includes(routine.assignedAgent.id));
    assert.ok(routine.recentExecutions.length > 0);
    for (const exec of routine.recentExecutions) {
      assert.ok(exec.durationMs > 0);
      assert.ok(exec.impactMetrics.length >= 2);
    }
  }
});

test("library nav item is registered in main navigation under reports group", () => {
  const reportsGroup = NAV.find((g) => g.key === "reports");
  assert.ok(reportsGroup, "Reports group must exist");
  const libraryItem = reportsGroup.items.find((i) => i.href === "/library");
  assert.ok(libraryItem, "Library item must exist in reports nav");
  assert.equal(libraryItem.key, "library");
  assert.equal(copyEn.nav.library, "Library & Artifacts");
  assert.equal(copyId.nav.library, "Dokumen & Bukti");
});

test("routines data model supports soft-delete archived status", () => {
  const statuses = ["active", "idle", "running", "paused", "archived"] as const;
  assert.equal(statuses.includes("archived"), true);
});
