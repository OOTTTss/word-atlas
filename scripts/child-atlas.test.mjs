import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
execFileSync(process.execPath, ["scripts/build-child-atlas.mjs"], {
  cwd: root,
});
const pub = path.join(root, ".local/child-public/atlas");
const plan = JSON.parse(
  fs.readFileSync(path.join(root, "data/child-vocabulary.json"), "utf8"),
);
const allowed = new Set(plan.topics.flatMap((t) => t.words));

test("publishes only the selected vocabulary and its matching media", () => {
  const index = JSON.parse(
    fs.readFileSync(path.join(pub, "index.json"), "utf8"),
  );
  assert.deepEqual(new Set(index.words.map((row) => row[0])), allowed);
  for (const folder of ["img", "thumb", "audio/uk", "audio/us", "audio/ex"]) {
    const files = fs.readdirSync(path.join(pub, folder));
    assert.equal(files.length, allowed.size);
    for (const file of files)
      assert.ok(allowed.has(file.replace(/\.(webp|mp3)$/, "")));
  }
  assert.equal(fs.existsSync(path.join(pub, "audio/ex2")), false);
  for (const id of ["suicide", "sexual", "murder"])
    assert.equal(
      index.words.some((row) => row[0] === id),
      false,
    );
});

test("keeps each retained sentence identical to the text of its existing recording", () => {
  const originals = new Map();
  for (const file of fs.readdirSync(path.join(root, "public/atlas/entries"))) {
    for (const entry of JSON.parse(
      fs.readFileSync(path.join(root, "public/atlas/entries", file), "utf8"),
    ))
      originals.set(entry.id, entry);
  }
  for (const file of fs.readdirSync(path.join(pub, "entries"))) {
    for (const entry of JSON.parse(
      fs.readFileSync(path.join(pub, "entries", file), "utf8"),
    )) {
      assert.equal(entry.ex.length, 1);
      assert.deepEqual(entry.ex[0], originals.get(entry.id).ex[0]);
      assert.equal(entry.m & 16, 0);
    }
  }
});
