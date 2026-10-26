import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "public");
const target = path.join(root, ".local/child-public");
const plan = JSON.parse(
  fs.readFileSync(path.join(root, "data/child-vocabulary.json"), "utf8"),
);
const original = JSON.parse(
  fs.readFileSync(path.join(source, "atlas/index.json"), "utf8"),
);
const originals = new Map();
for (let n = 0; n * original.chunk < original.count; n++) {
  for (const entry of JSON.parse(
    fs.readFileSync(path.join(source, `atlas/entries/${n}.json`), "utf8"),
  ))
    originals.set(entry.id, entry);
}

const ids = new Set();
const entries = [];
const cefr = ["A1", "A2"];
const longest = Math.max(...plan.topics.map((t) => t.words.length));
for (let position = 0; position < longest; position++) {
  for (const topic of plan.topics) {
    const id = topic.words[position];
    if (!id) continue;
    const entry = originals.get(id);
    if (!entry || ids.has(id) || !cefr.includes(entry.cefr))
      throw new Error(`检查儿童词单：${id}`);
    if (!entry.ex[0] || (entry.m & 15) !== 15)
      throw new Error(`词条缺少插画或录音：${id}`);
    ids.add(id);
    entries.push({
      ...entry,
      topic: topic.id,
      senses: entry.senses.slice(0, plan.extraSenses.includes(id) ? 2 : 1),
      ex: entry.ex.slice(0, 1),
      col: [],
      fam: [],
      syn: [],
      ant: [],
      tip: plan.tips[id] ?? "",
      m: entry.m & 15,
    });
  }
}

fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(path.join(target, "atlas/entries"), { recursive: true });
for (const name of [
  "brand",
  "sfx",
  "favicon.svg",
  "icon-512.png",
  "manifest.webmanifest",
])
  fs.cpSync(path.join(source, name), path.join(target, name), {
    recursive: true,
  });
for (const entry of entries) {
  for (const file of [
    `img/${entry.id}.webp`,
    `thumb/${entry.id}.webp`,
    `audio/uk/${entry.id}.mp3`,
    `audio/us/${entry.id}.mp3`,
    `audio/ex/${entry.id}.mp3`,
  ]) {
    const dest = path.join(target, "atlas", file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(source, "atlas", file), dest);
  }
}

const chunk = 100;
const index = {
  id: plan.id,
  name: plan.name,
  description: plan.description,
  count: entries.length,
  examples: entries.length,
  illustrated: entries.length,
  chunk,
  topics: plan.topics.map((t) => [t.id, t.name]),
  cefr,
  words: entries.map((e) => [
    e.id,
    e.w,
    `${e.senses[0].pos} ${e.senses[0].zh}`,
    e.uk || e.us,
    cefr.indexOf(e.cefr),
    plan.topics.findIndex((t) => t.id === e.topic),
    e.m,
  ]),
};
fs.writeFileSync(path.join(target, "atlas/index.json"), JSON.stringify(index));
for (let n = 0; n * chunk < entries.length; n++)
  fs.writeFileSync(
    path.join(target, `atlas/entries/${n}.json`),
    JSON.stringify(entries.slice(n * chunk, (n + 1) * chunk)),
  );
for (const name of ["LICENSE", "CONTENT_LICENSE.md"])
  fs.copyFileSync(path.join(root, name), path.join(target, name));

const hash = createHash("sha256").update(JSON.stringify(entries));
for (const dir of ["src", "public"]) {
  const base = path.join(root, dir);
  for (const file of fs
    .readdirSync(base, { recursive: true })
    .filter((p) => /\.(tsx?|css|js|webmanifest)$/.test(p))
    .sort())
    hash.update(fs.readFileSync(path.join(base, file)));
}
const worker = fs
  .readFileSync(path.join(source, "sw.js"), "utf8")
  .replace("__BUILD_ID__", hash.digest("hex").slice(0, 12));
fs.writeFileSync(path.join(target, "sw.js"), worker);
console.log(
  `儿童词包：${entries.length} 个词，${plan.topics.length} 个主题；仅复制对应插画与录音。`,
);
