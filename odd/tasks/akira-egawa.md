# Akira Egawa collection

**Objective:** Track every physical English-catalog card illustrated by Akira Egawa as a second
collection on the site, sharing `src/data/tengo.json` with the Siniestros master set.

**Scope:** All cards TCGdex (en) credits to AKIRA EGAWA, secret rares and promos included.
Excludes TCG Pocket (series `tcgp`, digital only) and the Hasegawa false matches.
Observed 2026-11-25: 123 total, 95 physical; 3 already owned (sv09-095, sv09-100, sv10-121).

**Constraints:** The Siniestros page and its `catalog.json` stay unchanged in behavior. No new
dependencies. `npm run tengo` must never drop ids that belong to either catalog.

**Delivery strategy:** ask-on-risk. Forecast ~150 authored lines (generated JSON excluded).
**Route:** delegated writer (3+ non-trivial files).

## Tasks

- [x] T1 — `scripts/fetch-catalog.mjs` also generates `src/data/akira-egawa.json` (same CardSet
  shape, grouped by set in release order). 8 cards lack a TCGdex image: use an
  images.pokemontcg.io fallback. Checks: 95 cards, catalog.json unchanged, every image URL 200.
- [x] T2 — `scripts/tengo.mjs` accepts ids from both catalogs, deduplicated, without dropping
  any owned id. Check: RED/GREEN test; add/remove round trip leaves tengo.json unchanged.
- [x] T3 — Page `/akira-egawa` with own progress, filters and missing-cards PDF, reusing the
  existing markup; navigation between both pages; search by non-numeric number (TG05); README.
  Checks: npm test, npm run build, rendered counts 3/95 and 166/170.

## Next step

Push and merge are the user's decision. Not checked in a browser or screen reader.
