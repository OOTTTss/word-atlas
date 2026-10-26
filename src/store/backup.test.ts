import assert from "node:assert/strict";
import { test } from "node:test";
import {
  emptyProgress,
  flush,
  getPreviousBackup,
  importBackup,
  parseBackup,
  store,
} from "./store";

test("validates before replacing progress, retains the previous backup, and cancels when it cannot save it", () => {
  const memory = new Map<string, string>();
  let rejectPrevious = false;
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => {
        if (rejectPrevious && key.includes(":previous:"))
          throw new Error("Storage is full");
        memory.set(key, value);
      },
    },
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { setTimeout, clearTimeout },
  });
  const card = {
    due: 1,
    s: 2,
    d: 5,
    el: 0,
    sd: 1,
    ls: 0,
    reps: 1,
    lapses: 0,
    st: 2 as const,
    seen: 1,
  };
  store.useDataset("word-atlas-child");
  store.progress((p) => ({ ...p, cards: { school: card } }));
  flush();
  const incoming = JSON.stringify({
    app: "word-atlas",
    version: 2,
    progress: { ...emptyProgress("word-atlas-child"), cards: { apple: card } },
    settings: { startLevel: 5 },
  });
  assert.equal(parseBackup(incoming, "word-atlas-child").ok, true);
  assert.deepEqual(Object.keys(store.get().progress.cards), ["school"]);
  assert.equal(importBackup("{}").ok, false);
  assert.equal(parseBackup(incoming, "other-dataset").ok, false);
  assert.equal(getPreviousBackup(), null);
  rejectPrevious = true;
  assert.equal(importBackup(incoming).ok, false);
  assert.deepEqual(Object.keys(store.get().progress.cards), ["school"]);
  rejectPrevious = false;
  assert.equal(importBackup(incoming).ok, true);
  assert.deepEqual(Object.keys(store.get().progress.cards), ["apple"]);
  assert.equal(store.get().settings.startLevel, 0);
  const previous = getPreviousBackup();
  assert.ok(previous);
  assert.equal(importBackup(previous).ok, true);
  assert.deepEqual(Object.keys(store.get().progress.cards), ["school"]);
  assert.deepEqual(
    Object.keys(
      JSON.parse(memory.get("word-atlas-child:v2:word-atlas-child")!).cards,
    ),
    ["school"],
  );
});
