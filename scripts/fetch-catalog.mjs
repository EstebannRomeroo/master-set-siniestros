#!/usr/bin/env node
// Builds src/data/catalog.json: every Darkness-type Pokémon card numbered
// within the official set count (no secret rares above the set total, no
// reverse holos), for each set from Prismatic Evolutions to 30th Celebration.
// Source: TCGdex API (https://tcgdex.dev). Spanish names when available.
//
// Usage: npm run catalog   (re-run when a new set should be added to SETS)

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../src/data/catalog.json", import.meta.url));
const API = "https://api.tcgdex.net/v2";

// Main-line expansions only, in release order. Promos, energy sets and the
// 30th Classic Collection (reprints with no official count) are excluded.
const SETS = [
  "sv08.5", "sv09", "sv10", "sv10.5w", "sv10.5b",
  "me01", "me02", "me02.5", "me03", "me04", "me05", "30th",
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
  sets.push({ id, name: es?.name ?? set.name, official, releaseDate: set.releaseDate, cards });
  console.log(`${id.padEnd(8)} ${String(cards.length).padStart(3)} cartas  ${set.name}`);
}

writeFileSync(OUT, JSON.stringify(sets, null, 2) + "\n");
console.log(`Total: ${sets.reduce((n, s) => n + s.cards.length, 0)} → ${OUT}`);
