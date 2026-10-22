// Marks cards as owned (or removes them with --quitar) in src/data/tengo.json.
// Usage: npm run tengo -- sv08.5-059 sv10-112
//        npm run tengo -- --quitar sv08.5-059
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const CATALOG = new URL("../src/data/catalog.json", import.meta.url);
const TENGO = new URL("../src/data/tengo.json", import.meta.url);

export function applyTengo(catalog, current, ids, remove = false) {
  const order = catalog.flatMap((s) => s.cards.map((c) => c.id));
  const known = new Set(order);
  const unknown = ids.filter((id) => !known.has(id));
  const owned = new Set(current);
  for (const id of ids) {
    if (!known.has(id)) continue;
    if (remove) owned.delete(id);
    else owned.add(id);
  }
  return { owned: order.filter((id) => owned.has(id)), unknown };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const remove = args.includes("--quitar");
  const ids = args.filter((a) => a !== "--quitar");
  if (!ids.length) {
    console.error("Uso: npm run tengo -- [--quitar] <id> [<id>...]");
    process.exit(1);
  }
  const catalog = JSON.parse(readFileSync(CATALOG, "utf8"));
  const current = JSON.parse(readFileSync(TENGO, "utf8"));
  const { owned, unknown } = applyTengo(catalog, current, ids, remove);
  writeFileSync(TENGO, JSON.stringify(owned, null, 2) + "\n");
  if (unknown.length) console.warn(`IDs desconocidos (ignorados): ${unknown.join(", ")}`);
  const total = catalog.reduce((n, s) => n + s.cards.length, 0);
  console.log(`${remove ? "Quitadas" : "Añadidas"}: ${ids.length - unknown.length} · Tengo ${owned.length}/${total}`);
  if (unknown.length) process.exitCode = 1;
}
