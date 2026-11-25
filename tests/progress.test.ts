import { test } from "node:test";
import assert from "node:assert/strict";
import { cardCode, matches, progress, type Card } from "../src/lib/progress.ts";

const cards: Card[] = [
  { id: "a-001", num: "001", name: "Umbreon", img: "" },
  { id: "a-002", num: "002", name: "Umbreon ex", img: "" },
  { id: "a-059", num: "059", name: "Sneasel", img: "" },
];

test("progress counts owned cards and rounds the percentage", () => {
  assert.deepEqual(progress(cards, new Set(["a-002", "zz-999"])), { owned: 1, total: 3, pct: 33 });
  assert.deepEqual(progress([], new Set()), { owned: 0, total: 0, pct: 0 });
});

test("matches filters by status, name and number", () => {
  const card = { num: "059", name: "Sneasel", owned: false };
  assert.equal(matches(card, "", "all"), true);
  assert.equal(matches(card, "", "owned"), false);
  assert.equal(matches(card, "", "missing"), true);
  assert.equal(matches(card, "snea", "all"), true);
  assert.equal(matches(card, "59", "all"), true);
  assert.equal(matches(card, "#059", "all"), true);
  assert.equal(matches(card, "5", "all"), false);
  assert.equal(matches({ ...card, name: "Pokémon" }, "pokemon", "all"), true);
});

test("matches finds non-numeric card numbers", () => {
  const card = { num: "TG05", name: "Pikachu", owned: false };
  assert.equal(matches(card, "TG05", "all"), true);
  assert.equal(matches(card, "#tg05", "all"), true);
  assert.equal(matches(card, "TG0", "all"), false);
  assert.equal(matches(card, "5", "all"), false);
  // Sleeve cards have no number.
  assert.equal(matches({ ...card, num: "" }, "TG05", "all"), false);
});

test("cardCode shows the set total only for numeric, non-promo numbers", () => {
  const set = { name: "Brilliant Stars", official: 172 };
  assert.equal(cardCode(set, "020"), "#020/172");
  assert.equal(cardCode(set, "TG05"), "#TG05");
  assert.equal(cardCode({ name: "SVP Black Star Promos", official: 225 }, "112"), "#112");
});
