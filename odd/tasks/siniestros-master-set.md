# Siniestros master set

**Objective:** Turn the project into a tracker for a Darkness-type Pokémon TCG master set,
replacing everything One Piece (trade binder + personal collection).

**Scope:** Darkness-type Pokémon cards numbered within each set's official count (no secret
rares above the total, no reverse holos), sets Prismatic Evolutions (sv08.5) → 30th Celebration.
Source: TCGdex API, cross-checked with pokemontcg.io for sv08.5 and sv10.

**Delivery strategy:** ask-on-risk. Forecast ~600 authored lines added, ~4000 deleted (mostly
One Piece data).

## Tasks

- [x] T1 — Catalog fetch script `scripts/fetch-catalog.mjs` → `src/data/catalog.json`
  (155 cards, 12 sets). Route: inline (one file). Check: run script, image URL 200,
  cross-check sv08.5 (7) and sv10 (28) against pokemontcg.io — match.
- [x] T2 — Remove One Piece code/data; new checklist UI (progress per set, owned/missing filter,
  search), `src/data/tengo.json` + `npm run tengo`, tests, README. Route: delegated writer
  (2+ non-trivial files). Checks: npm test 5/5 pass, npm run build OK (155 cards), tengo add/remove round-trip OK, no One Piece references left.

## Next step

Done. Mark owned cards with `npm run tengo -- <id>`; rebuild to see them.
