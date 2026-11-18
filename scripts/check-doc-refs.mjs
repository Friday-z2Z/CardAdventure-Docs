#!/usr/bin/env node
/**
 * 文档交叉引用校验（对应里程碑 A7）
 *
 * 检查项：
 *   1. 文件引用可达：正文里提到的 xx_NN_*.md 是否存在
 *   2. 章节引用可达：`xx_y.md §3.1` / `xx_y.md 第 3 节` 指向的标题是否存在
 *   3. 标题编号：`## N.` 单调递增无重复；`### N.M` 的父节 `## N` 存在
 *   4. 表格列数：表头与每行单元格数一致（`\|` 视为单元格内字符）
 *   5. 文档计数：README 的"（N 份）"与各目录括注数量与实际文件数一致
 *
 * 用法：node scripts/check-doc-refs.mjs
 * 退出码：0 全通过；1 存在问题
 * 依赖：无（Node 18+）
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = path.join(ROOT, "docs");

const problems = [];
const add = (file, line, kind, message) =>
  problems.push({ file, line, kind, message });

/** 递归收集 markdown 文件 */
function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith(".md")) out.push(full);
  }
  return out;
}

/** 粗略剥离围栏代码块，返回 {text, isCode[]} */
function splitCodeFences(lines) {
  const isCode = new Array(lines.length).fill(false);
  let inside = false;
  lines.forEach((line, i) => {
    if (/^\s*```/.test(line)) {
      isCode[i] = inside; // 开/闭围栏本身也视为代码区
      inside = !inside;
      return;
    }
    isCode[i] = inside;
  });
  return isCode;
}

const HEADING_RE = /^(#{2,4})\s+(.+?)\s*$/;
const NUM_RE = /^(\d+(?:\.\d+)*)\.?(?=\s|$)/;

function parseDoc(file) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);
  const isCode = splitCodeFences(lines);
  const headings = [];
  lines.forEach((line, i) => {
    if (isCode[i]) return;
    const m = HEADING_RE.exec(line);
    if (!m) return;
    const title = m[2].replace(/\s+#+\s*$/, "");
    const nm = NUM_RE.exec(title);
    headings.push({
      line: i + 1,
      level: m[1].length,
      num: nm ? nm[1] : null,
      title,
    });
  });
  const rel = path.relative(ROOT, file).split(path.sep).join("/");
  return { file, rel, lines, isCode, headings };
}

/** 拆表格单元格（保留 \| 为普通字符） */
function splitCells(line) {
  const s = line.trim();
  if (!s.startsWith("|")) return null;
  const cells = [];
  let cur = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "\\" && s[i + 1] === "|") {
      cur += "\\|";
      i++;
      continue;
    }
    if (ch === "|") {
      cells.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  cells.push(cur);
  if (cells.length && cells[0].trim() === "") cells.shift();
  if (cells.length && cells[cells.length - 1].trim() === "") cells.pop();
  return cells;
}

const SEPARATOR_RE = /^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$/;

// ---------- 收集文档 ----------
if (!fs.existsSync(DOCS)) {
  console.error(`找不到 docs 目录：${DOCS}`);
  process.exit(1);
}
const docFiles = walk(DOCS);
const extraFiles = ["README.md", "AGENTS.md"]
  .map((n) => path.join(ROOT, n))
  .filter((p) => fs.existsSync(p));
const allFiles = [...docFiles, ...extraFiles].map(parseDoc);

const byBase = new Map();
for (const d of allFiles) byBase.set(path.basename(d.file), d);

// ---------- 逐文件检查 ----------
for (const doc of allFiles) {
  const { lines, isCode, headings, rel } = doc;

  // 3. 标题编号
  const h2 = headings.filter((h) => h.level === 2 && h.num && !h.num.includes("."));
  let prev = null;
  for (const h of h2) {
    const n = Number(h.num);
    if (prev !== null && n <= prev) {
      add(rel, h.line, "标题编号", `## ${h.num} 出现在 ## ${prev} 之后，应为递增`);
    }
    prev = n;
  }
  const nums = new Set(headings.map((h) => h.num).filter(Boolean));
  for (const h of headings) {
    if (h.level !== 3 || !h.num || !h.num.includes(".")) continue;
    const parent = h.num.split(".")[0];
    if (!h2.some((p) => p.num === parent)) {
      add(rel, h.line, "标题编号", `### ${h.num} 缺少父节 ## ${parent}`);
    }
  }

  // 1 & 2. 引用检查
  lines.forEach((line, i) => {
    if (isCode[i]) return;
    const lineNo = i + 1;

    for (const m of line.matchAll(/([0-9]{2}_[A-Za-z0-9_]+\.md)/g)) {
      if (!byBase.has(m[1])) {
        add(rel, lineNo, "文件引用", `找不到 ${m[1]}`);
      }
    }
    for (const m of line.matchAll(/(README|AGENTS)\.md/g)) {
      if (!byBase.has(m[1] + ".md")) {
        add(rel, lineNo, "文件引用", `找不到 ${m[1]}.md`);
      }
    }

    const refPatterns = [
      /([0-9]{2}_[A-Za-z0-9_]+)(?:\.md)?\s*§\s*(\d+(?:\.\d+)*)/g,
      /([0-9]{2}_[A-Za-z0-9_]+)(?:\.md)?\s*第\s*(\d+(?:\.\d+)*)\s*节/g,
    ];
    for (const re of refPatterns) {
      for (const m of line.matchAll(re)) {
        const target = byBase.get(`${m[1]}.md`);
        if (!target) {
          add(rel, lineNo, "章节引用", `${m[1]}.md 不存在`);
          continue;
        }
        if (!target.headings.some((h) => h.num === m[2])) {
          add(rel, lineNo, "章节引用", `${m[1]}.md 中找不到 §${m[2]}`);
        }
      }
    }
  });

  // 4. 表格列数
  let tableHeader = null;
  lines.forEach((line, i) => {
    if (isCode[i]) return;
    const cells = splitCells(line);
    if (!cells) {
      tableHeader = null;
      return;
    }
    if (tableHeader === null) {
      const next = lines[i + 1];
      if (next && SEPARATOR_RE.test(next)) tableHeader = cells.length;
      return;
    }
    if (cells.length !== tableHeader) {
      add(
        rel,
        i + 1,
        "表格列数",
        `本行 ${cells.length} 列，表头 ${tableHeader} 列`
      );
    }
  });
}

// ---------- 5. README 文档计数 ----------
const readme = byBase.get("README.md");
if (readme) {
  const totalLine = readme.lines.findIndex((l) => /^##\s+文档结构（\d+\s*份）/.test(l));
  if (totalLine >= 0) {
    const claimed = Number(/（(\d+)\s*份）/.exec(readme.lines[totalLine])[1]);
    const actual = docFiles.length;
    if (claimed !== actual) {
      add("README.md", totalLine + 1, "文档计数", `声明 ${claimed} 份，实际 ${actual} 份`);
    }
  }
  readme.lines.forEach((line, i) => {
    const m = /[├└]──\s+([0-9]{2}_[A-Za-z0-9_]+)\/\s+\((\d+)\)/.exec(line);
    if (!m) return;
    const dir = path.join(DOCS, m[1]);
    if (!fs.existsSync(dir)) {
      add("README.md", i + 1, "文档计数", `目录 ${m[1]} 不存在`);
      return;
    }
    const actual = fs.readdirSync(dir).filter((f) => f.endsWith(".md")).length;
    if (actual !== Number(m[2])) {
      add("README.md", i + 1, "文档计数", `${m[1]} 声明 ${m[2]} 份，实际 ${actual} 份`);
    }
  });
}

// ---------- 6. 新文件必须在 Index 登记 ----------
const indexDoc = byBase.get("00_Index.md");
if (indexDoc) {
  const indexText = indexDoc.lines.join("\n");
  for (const file of docFiles) {
    const base = path.basename(file);
    if (base === "00_Index.md") continue;
    if (!indexText.includes(base)) {
      add("00_Index.md", 0, "索引登记", `未登记 ${path.relative(DOCS, file).split(path.sep).join("/")}`);
    }
  }
}

// ---------- 7. 决策编号唯一 ----------
const decisionDoc = byBase.get("00_DecisionLog.md");
if (decisionDoc) {
  const seen = new Map();
  decisionDoc.lines.forEach((line, i) => {
    const m = /^\|\s*(D-\d{3})\s*\|/.exec(line);
    if (!m) return;
    if (seen.has(m[1])) {
      add(decisionDoc.rel, i + 1, "编号重复", `${m[1]} 已在第 ${seen.get(m[1])} 行出现`);
    } else {
      seen.set(m[1], i + 1);
    }
  });
}

// ---------- 8. 内容密度预算（18_LevelProduction.md §12） ----------
const cardsDoc = byBase.get("03_Cards.md");
const itemsDoc = byBase.get("04_Items.md");
if (cardsDoc && itemsDoc) {
  const counts = { eq: {}, enemy: {}, elite: {}, trap: {}, event: {}, item: {} };
  let stage = null;
  for (const line of cardsDoc.lines) {
    const h = /^### 阶段([二三四五])/.exec(line);
    if (h) {
      stage = h[1];
      continue;
    }
    if (/^##\s/.test(line)) stage = null;
    if (!stage || !line.startsWith("|")) continue;
    const cells = splitCells(line);
    if (!cells || cells.length < 3) continue;
    const t = cells[2].trim();
    if (t === "equipment") counts.eq[stage] = (counts.eq[stage] || 0) + 1;
    else if (t === "enemy") counts.enemy[stage] = (counts.enemy[stage] || 0) + 1;
    else if (t.startsWith("enemy") && t.indexOf("精英") >= 0) counts.elite[stage] = (counts.elite[stage] || 0) + 1;
    else if (t === "trap") counts.trap[stage] = (counts.trap[stage] || 0) + 1;
    else if (t === "event") counts.event[stage] = (counts.event[stage] || 0) + 1;
  }
  for (const line of itemsDoc.lines) {
    if (!line.startsWith("|")) continue;
    const cells = splitCells(line);
    if (!cells || cells.length < 6) continue;
    const m = /^([一二三四五])/.exec(cells[5].trim());
    if (!m) continue;
    counts.item[m[1]] = (counts.item[m[1]] || 0) + 1;
  }
  const budget = {
    二: { eq: 2, item: 2, enemy: 4, elite: 0, trap: 1, event: 1 },
    三: { eq: 2, item: 1, enemy: 3, elite: 2, trap: 2, event: 1 },
    四: { eq: 2, item: 2, enemy: 3, elite: 2, trap: 2, event: 2 },
    五: { eq: 2, item: 2, enemy: 3, elite: 2, trap: 1, event: 2 },
  };
  const labels = { eq: "装备", item: "道具", enemy: "普通敌人", elite: "精英", trap: "陷阱", event: "事件" };
  for (const s of Object.keys(budget)) {
    for (const k of Object.keys(budget[s])) {
      const got = counts[k][s] || 0;
      if (got < budget[s][k]) {
        add("18_LevelProduction.md", 0, "内容密度", `阶段${s} ${labels[k]} ${got} 项，预算 ≥${budget[s][k]}`);
      }
    }
  }
}

// ---------- 9. CopyDeck key 唯一 ----------
const copyDoc = byBase.get("02_CopyDeck.md");
if (copyDoc) {
  const seen = new Map();
  copyDoc.lines.forEach((line, i) => {
    if (!line.startsWith("|")) return;
    const first = line.split("|")[1]?.trim();
    if (!first || !first.startsWith("key:")) return;
    if (seen.has(first)) {
      add("02_CopyDeck.md", i + 1, "key 重复", `${first} 已在第 ${seen.get(first)} 行出现`);
    } else {
      seen.set(first, i + 1);
    }
  });
}

// ---------- 输出 ----------
if (problems.length === 0) {
  console.log(`文档引用校验通过：${allFiles.length} 个文件，0 处问题。`);
  process.exit(0);
}

const byFile = new Map();
for (const p of problems) {
  if (!byFile.has(p.file)) byFile.set(p.file, []);
  byFile.get(p.file).push(p);
}
for (const [file, list] of byFile) {
  console.log(`\n${file}`);
  for (const p of list) {
    console.log(`  ${String(p.line).padStart(4, " ")}  [${p.kind}] ${p.message}`);
  }
}
console.log(`\n共 ${problems.length} 处问题，涉及 ${byFile.size} 个文件。`);
process.exit(1);
