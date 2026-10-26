import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { test } from "node:test";

const source = fs.readFileSync(
  new URL("../public/sw.js", import.meta.url),
  "utf8",
);

function worker(keys = []) {
  const listeners = new Map();
  const deleted = [];
  const opened = [];
  vm.runInNewContext(source, {
    URL,
    Response,
    self: {
      registration: { scope: "https://example.test/word-atlas/" },
      addEventListener: (name, fn) => listeners.set(name, fn),
      skipWaiting() {},
      clients: { claim() {} },
    },
    caches: {
      keys: async () => keys,
      delete: async (key) => {
        deleted.push(key);
        return true;
      },
      open: async (key) => {
        opened.push(key);
        return { match: async () => undefined, put: async () => {} };
      },
    },
    fetch: async () => new Response("fresh"),
  });
  return { listeners, deleted, opened };
}

test("updates only this application's old caches and preserves other apps on the same origin", async () => {
  const old = "word-atlas-child:/word-atlas/:old:shell";
  const current = "word-atlas-child:/word-atlas/:__BUILD_ID__:shell";
  const app = worker([
    old,
    current,
    "another-app-cache",
    "word-atlas-child:/other/:old:shell",
    "atlas-v1-shell",
  ]);
  let finished;
  app.listeners.get("activate")({
    waitUntil: (p) => {
      finished = p;
    },
  });
  await finished;
  assert.deepEqual(app.deleted, [old]);
});

test("does not intercept another application's paths or audio range requests", () => {
  const app = worker();
  for (const [url, range] of [
    ["https://example.test/another-app/index.json", false],
    ["https://example.test/word-atlas/atlas/audio/uk/apple.mp3", true],
  ]) {
    app.listeners.get("fetch")({
      request: { url, method: "GET", headers: { has: () => range } },
      respondWith: () => assert.fail("request must pass through"),
    });
  }
});

test("does not serve resources from a different cache version", async () => {
  const app = worker();
  let response;
  app.listeners.get("fetch")({
    request: {
      url: "https://example.test/word-atlas/atlas/entries/0.json",
      method: "GET",
      headers: { has: () => false },
    },
    respondWith: (p) => {
      response = p;
    },
    waitUntil() {},
  });
  assert.equal(await (await response).text(), "fresh");
  assert.deepEqual(app.opened, [
    "word-atlas-child:/word-atlas/:__BUILD_ID__:shell",
  ]);
});
