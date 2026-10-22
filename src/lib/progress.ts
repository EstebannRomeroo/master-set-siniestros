export interface Card {
  id: string;
  num: string;
  name: string;
  img: string;
}

export interface CardSet {
  id: string;
  name: string;
  official: number;
  releaseDate: string;
  cards: Card[];
}

export interface Progress {
  owned: number;
  total: number;
  pct: number;
}

export type Status = "all" | "missing" | "owned";

export function progress(cards: Card[], owned: Set<string>): Progress {
  const total = cards.length;
  const have = cards.filter((c) => owned.has(c.id)).length;
  return { owned: have, total, pct: total ? Math.round((have / total) * 100) : 0 };
}

export function normalize(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

// Query matches name or number ("59" matches "059", "#059" too).
export function matches(
  card: { num: string; name: string; owned: boolean },
  query: string,
  status: Status,
): boolean {
  if (status === "owned" && !card.owned) return false;
  if (status === "missing" && card.owned) return false;
  const q = normalize(query).replace(/^#/, "");
  if (!q) return true;
  if (normalize(card.name).includes(q)) return true;
  return /^\d+$/.test(q) && Number(card.num) === Number(q);
}
