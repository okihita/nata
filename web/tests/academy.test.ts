import { test } from "node:test";
import assert from "node:assert/strict";

import { ACADEMY_LESSONS, MYTH_FACTS } from "../src/lib/academy.ts";
import { copyEn } from "../src/lib/copy-en.ts";
import { copyId } from "../src/lib/copy-id.ts";
import { NAV } from "../src/lib/nav.ts";

test("academy curriculum matches translation dictionary keys in both en and id", () => {
  for (const lesson of ACADEMY_LESSONS) {
    const enLesson = copyEn.academy.lessons[lesson.id as keyof typeof copyEn.academy.lessons];
    const idLesson = copyId.academy.lessons[lesson.id as keyof typeof copyId.academy.lessons];

    assert.ok(enLesson, `Missing English translation for lesson ${lesson.id}`);
    assert.ok(idLesson, `Missing Indonesian translation for lesson ${lesson.id}`);
    assert.ok(enLesson.title.length > 0, `Empty English title for lesson ${lesson.id}`);
    assert.ok(idLesson.title.length > 0, `Empty Indonesian title for lesson ${lesson.id}`);
    assert.ok(enLesson.content.length > 0, `Empty English content for lesson ${lesson.id}`);
    assert.ok(idLesson.content.length > 0, `Empty Indonesian content for lesson ${lesson.id}`);
  }
});

test("academy myths section matches translation dictionary in both en and id", () => {
  for (const mf of MYTH_FACTS) {
    const enMyth = copyEn.academy.myths[mf.id as keyof typeof copyEn.academy.myths];
    const idMyth = copyId.academy.myths[mf.id as keyof typeof copyId.academy.myths];

    assert.ok(enMyth, `Missing English translation for myth ${mf.id}`);
    assert.ok(idMyth, `Missing Indonesian translation for myth ${mf.id}`);
    assert.ok(enMyth.myth.length > 0, `Empty English myth for ${mf.id}`);
    assert.ok(idMyth.myth.length > 0, `Empty Indonesian myth for ${mf.id}`);
    assert.ok(enMyth.fact.length > 0, `Empty English fact for ${mf.id}`);
    assert.ok(idMyth.fact.length > 0, `Empty Indonesian fact for ${mf.id}`);
  }
});

test("academy is registered in the main navigation groups", () => {
  const learningGroup = NAV.find((g) => g.key === "learning");
  assert.ok(learningGroup, "NAV does not contain learning group");
  const academyItem = learningGroup.items.find((item) => item.key === "academy");
  assert.ok(academyItem, "Learning group does not contain academy item");
  assert.equal(academyItem.href, "/academy");
});
