import { test } from "node:test";
import assert from "node:assert/strict";
import { applyTengo } from "../scripts/tengo.mjs";

const catalog = [
  { id: "s1", cards: [{ id: "s1-001" }, { id: "s1-002" }] },
  { id: "s2", cards: [{ id: "s2-010" }] },
];

test("adds ids in catalog order without duplicates", () => {
  const r = applyTengo(catalog, ["s2-010"], ["s1-002", "s1-001", "s2-010"]);
  assert.deepEqual(r, { owned: ["s1-001", "s1-002", "s2-010"], unknown: [] });
});

test("removes ids with remove flag", () => {
  const r = applyTengo(catalog, ["s1-001", "s2-010"], ["s1-001"], true);
  assert.deepEqual(r.owned, ["s2-010"]);
});

test("reports unknown ids and does not write them", () => {
  const r = applyTengo(catalog, [], ["s1-001", "nope-1"]);
  assert.deepEqual(r, { owned: ["s1-001"], unknown: ["nope-1"] });
});

test("overlapping catalogs keep each owned id once and drop none", () => {
  const other = [{ id: "s2", cards: [{ id: "s2-010" }, { id: "s2-020" }] }];
  const current = ["s2-010", "s2-020"];
  const added = applyTengo([...catalog, ...other], current, ["s1-001"]);
  assert.deepEqual(added, { owned: ["s1-001", "s2-010", "s2-020"], unknown: [] });
  const removed = applyTengo([...catalog, ...other], added.owned, ["s1-001"], true);
  assert.deepEqual(removed.owned, current);
});

test("keeps owned ids that no catalog knows", () => {
  const r = applyTengo(catalog, ["gone-1", "s2-010"], ["s1-001"]);
  assert.deepEqual(r.owned, ["s1-001", "s2-010", "gone-1"]);
  assert.deepEqual(applyTengo(catalog, ["gone-1", "s2-010"], ["s2-010"], true).owned, ["gone-1"]);
});
