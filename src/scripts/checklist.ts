import { matches, type Status } from "../lib/progress";

const q = document.getElementById("q") as HTMLInputElement;
const setSel = document.getElementById("setSel") as HTMLSelectElement;
const chips = [...document.querySelectorAll<HTMLButtonElement>("#status .chip")];
const sections = [...document.querySelectorAll<HTMLElement>(".set")];
const empty = document.getElementById("empty")!;
let status: Status = "all";

function apply() {
  let shown = 0;
  for (const section of sections) {
    let visible = 0;
    if (!setSel.value || section.dataset.set === setSel.value) {
      for (const li of section.querySelectorAll<HTMLElement>(".card")) {
        const ok = matches(
          { num: li.dataset.num!, name: li.dataset.name!, owned: !!li.dataset.owned },
          q.value,
          status,
        );
        li.hidden = !ok;
        if (ok) visible++;
      }
    }
    section.hidden = visible === 0;
    shown += visible;
  }
  empty.hidden = shown > 0;
}

q.addEventListener("input", apply);
setSel.addEventListener("change", apply);
for (const chip of chips) {
  chip.addEventListener("click", () => {
    status = chip.dataset.status as Status;
    for (const c of chips) c.setAttribute("aria-pressed", String(c === chip));
    apply();
  });
}

document.getElementById("pdfBtn")!.addEventListener("click", () => print());

const root = document.documentElement;
try {
  const saved = localStorage.getItem("binder-theme");
  if (saved) root.setAttribute("data-theme", saved);
} catch {}
document.getElementById("themeBtn")!.addEventListener("click", () => {
  const cur = root.getAttribute("data-theme");
  const dark = cur ? cur === "dark" : !matchMedia("(prefers-color-scheme: light)").matches;
  const next = dark ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try {
    localStorage.setItem("binder-theme", next);
  } catch {}
});
