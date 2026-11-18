import fs from "node:fs";

const lines = fs.readFileSync("docs/01_GameDesign/04_Items.md", "utf8").split(/\r?\n/);
const excluded = new Set(["key", "bomb", "item_bomb_large", "item_void_bomb"]);
const sellable = { common: 0, uncommon: 0, rare: 0, epic: 0 };
const all = { common: 0, uncommon: 0, rare: 0, epic: 0 };

for (const line of lines) {
  if (!line.startsWith("|")) continue;
  const c = line.split("|").slice(1, -1).map((s) => s.trim());
  if (c.length < 6) continue;
  const id = c[0].replace(/`/g, "");
  const rarity = c[4];
  if (!(rarity in all)) continue;
  all[rarity]++;
  if (!excluded.has(id)) sellable[rarity]++;
}

console.log("全池:", JSON.stringify(all));
console.log("可售:", JSON.stringify(sellable));
