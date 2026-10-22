# Master set Siniestros

Tracker personal (página estática con Astro) del master set de cartas tipo
Oscuridad de Pokémon TCG: qué cartas tengo y cuáles me faltan, por expansión.

## Alcance

- Pokémon de tipo Oscuridad, desde Evoluciones Prismáticas (sv08.5) hasta 30th Celebration.
- Solo cartas numeradas dentro del total oficial de cada set (sin secretas por encima
  del total, sin reverse holo).

## Datos

- `src/data/catalog.json` — catálogo generado desde TCGdex (no editar a mano).
- `src/data/tengo.json` — ids de las cartas que tengo. Es la fuente de verdad.
- `src/data/sleeves.json` — ids de los sets cuyo sleeve de ETB tengo (se edita a mano).

```sh
npm run tengo -- sv08.5-059 sv10-112          # marcar como "la tengo"
npm run tengo -- --quitar sv08.5-059          # desmarcar
npm run catalog                               # regenerar catalog.json desde TCGdex
```

`npm run tengo` valida los ids contra el catálogo e ignora (y avisa) los desconocidos.

## Desarrollo

```sh
npm install
npm run dev     # servidor local
npm run build   # genera dist/
npm test        # tests (node --test)
```

Imágenes y datos: TCGdex · © Pokémon / Nintendo / Creatures / GAME FREAK.
