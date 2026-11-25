#!/usr/bin/env node
// Builds the two collection catalogs in src/data.
// catalog.json: every Darkness-type Pokémon card numbered
// within the official set count (no secret rares above the set total, no
// reverse holos), for each set from Prismatic Evolutions to Delta Reign.
// akira-egawa.json: every physical English card illustrated by Akira Egawa.
// Source: TCGdex API (https://tcgdex.dev). English set names, Spanish card names when available.
//
// Usage: npm run catalog   (re-run when a new set should be added to SETS)

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../src/data/catalog.json", import.meta.url));
const EGAWA_OUT = fileURLToPath(new URL("../src/data/akira-egawa.json", import.meta.url));
const API = "https://api.tcgdex.net/v2";

// Main-line expansions only, in release order. Promos, energy sets and the
// 30th Classic Collection (reprints with no official count) are excluded.
const SETS = [
  "sv08.5", "sv09", "sv10", "sv10.5w", "sv10.5b",
  "me01", "me02", "me02.5", "me03", "me04", "me05", "30th", "me06",
];

async function get(path) {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
}

const sets = [];
for (const id of SETS) {
  const set = await get(`/en/sets/${id}`);
  const es = await get(`/es/sets/${id}`).catch(() => null);
  const esNames = new Map((es?.cards ?? []).map((c) => [c.id, c.name]));
  const dark = await get(`/en/cards?types=eq:Darkness&id=like:${id}-*`);
  const official = set.cardCount.official;
  const cards = dark
    // Exact id match: "like:30th-*" also matches the 30th-c-* classic reprints.
    .filter((c) => c.id === `${id}-${c.localId}` && Number(c.localId) <= official)
    .sort((a, b) => Number(a.localId) - Number(b.localId))
    .map((c) => ({
      id: c.id,
      num: c.localId,
      name: esNames.get(c.id) ?? c.name,
      img: `${c.image}/low.webp`,
    }));
  sets.push({ id, name: set.name, official, releaseDate: set.releaseDate, cards });
  console.log(`${id.padEnd(8)} ${String(cards.length).padStart(3)} cartas  ${set.name}`);
}

writeFileSync(OUT, JSON.stringify(sets, null, 2) + "\n");
console.log(`Total: ${sets.reduce((n, s) => n + s.cards.length, 0)} → ${OUT}`);

// ── Akira Egawa ──────────────────────────────────────────────

// Runs fn over items in batches so the API is not hit with every request at once.
async function mapBatched(items, fn, size = 10) {
  const out = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(...(await Promise.all(items.slice(i, i + size).map(fn))));
  }
  return out;
}

// Some gallery cards have no TCGdex image; pokemontcg.io writes "12.5" as "12pt5".
const imageUrl = (c) =>
  c.image ? `${c.image}/low.webp` : `https://images.pokemontcg.io/${c.set.id.replace(".5", "pt5")}/${c.localId}.png`;

async function checkImage(url) {
  const res = await fetch(url, { method: "HEAD" });
  if (!res.ok || !res.headers.get("content-type")?.startsWith("image/")) {
    throw new Error(`${res.status} ${url}`);
  }
}

// TCG Pocket cards are digital only.
const pocket = new Set((await get("/en/series/tcgp")).sets.map((s) => s.id));
// "like" also returns partial matches such as Hasegawa, hence the exact check on the details.
const found = await get("/en/cards?illustrator=like:akira%20egawa");
const details = await mapBatched(found, (c) => get(`/en/cards/${c.id}`));
const egawa = details.filter((c) => c.illustrator?.toUpperCase() === "AKIRA EGAWA" && !pocket.has(c.set.id));
const egawaSets = await mapBatched([...new Set(egawa.map((c) => c.set.id))], async (id) => {
  const set = await get(`/en/sets/${id}`);
  const es = await get(`/es/sets/${id}`).catch(() => null);
  const esNames = new Map((es?.cards ?? []).map((c) => [c.id, c.name]));
  const cards = egawa
    .filter((c) => c.set.id === id)
    .sort((a, b) => a.localId.localeCompare(b.localId, "en", { numeric: true }))
    .map((c) => ({ id: c.id, num: c.localId, name: esNames.get(c.id) ?? c.name, img: imageUrl(c) }));
  return { id, name: set.name, official: set.cardCount.official, releaseDate: set.releaseDate, cards };
});
egawaSets.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate) || a.id.localeCompare(b.id));
const egawaCards = egawaSets.flatMap((s) => s.cards);
await mapBatched(egawaCards, (c) => checkImage(c.img));

writeFileSync(EGAWA_OUT, JSON.stringify(egawaSets, null, 2) + "\n");
console.log(`Akira Egawa: ${egawaCards.length} → ${EGAWA_OUT}`);
