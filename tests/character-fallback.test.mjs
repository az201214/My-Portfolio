import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = (file) => readFile(new URL(file, root), "utf8");

test("the app shell never gates the character on reduced motion or WebGL", async () => {
  const app = await read("src/App.tsx");
  assert.doesNotMatch(app, /prefers-reduced-motion|showCharacter/);
  assert.match(app, /<ErrorBoundary fallback=\{<CharacterStill \/>\}>/);
  assert.match(app, /<Suspense fallback=\{<CharacterStill \/>\}>/);
});

test("the static character image ships and the scene falls back to it", async () => {
  const still = await stat(new URL("public/images/character-still.webp", root));
  assert.ok(still.size > 1_000 && still.size < 200_000);
  const scene = await read("src/components/Character/Scene.tsx");
  assert.ok(scene.includes("images/character-still.webp"));
  assert.match(scene, /showStill\("model", error\)/);
  assert.match(scene, /showStill\("WebGL", error\)/);
  assert.doesNotMatch(scene, /if \(!root\) return;/);
});

test("reduced motion shows a still lit model rather than no model", async () => {
  const scene = await read("src/components/Character/Scene.tsx");
  assert.match(scene, /animationApi\.showStillPose\(\)/);
  assert.match(scene, /light\.turnOnLights\(true\)/);
  const animation = await read("src/components/Character/utils/animationUtils.ts");
  assert.match(animation, /function showStillPose\(/);
});
