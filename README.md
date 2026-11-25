# Master set Siniestros

Tracker personal (página estática con Astro) del master set de cartas tipo
Oscuridad de Pokémon TCG: qué cartas tengo y cuáles me faltan, por expansión.
Incluye una segunda colección con las cartas ilustradas por Akira Egawa (`/akira-egawa`).

## Alcance

Master set Siniestros:

- Pokémon de tipo Oscuridad, desde Evoluciones Prismáticas (sv08.5) hasta Delta Reign.
- Solo cartas numeradas dentro del total oficial de cada set (sin secretas por encima
  del total, sin reverse holo).

Colección Akira Egawa:

- Todas las cartas físicas del catálogo en inglés ilustradas por Akira Egawa, incluidas
  secretas y promos. No incluye TCG Pocket (solo digital).

## Datos

- `src/data/catalog.json` — catálogo Siniestros, generado desde TCGdex (no editar a mano).
- `src/data/akira-egawa.json` — catálogo Akira Egawa, también generado (no editar a mano).
- `src/data/tengo.json` — ids de las cartas que tengo, compartidos por ambas colecciones. Es la fuente de verdad.
- `src/data/sleeves.json` — nombres de archivo (en `public/sleeves`) de los sleeves de ETB que tengo (se edita a mano).

```sh
npm run tengo -- sv08.5-059 sv10-112          # marcar como "la tengo"
npm run tengo -- --quitar sv08.5-059          # desmarcar
npm run catalog                               # regenerar ambos catálogos desde TCGdex
```

`npm run tengo` valida los ids contra ambos catálogos e ignora (y avisa) los desconocidos.

## Desarrollo

```sh
npm install
npm run dev     # servidor local
npm run build   # genera dist/
npm test        # tests (node --test)
```

Imágenes y datos: TCGdex y Pokémon TCG API · © Pokémon / Nintendo / Creatures / GAME FREAK.
