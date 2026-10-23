import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { createDecipheriv, createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
const root = new URL("../", import.meta.url);
const read = (file) => readFile(new URL(file, root), "utf8");

test("shipped character decrypts to a valid binary glTF with the runtime and tooling key", async () => {
  const source = await read("src/components/Character/utils/character.ts");
  const password = source.match(/decryptFile\([\s\S]*?,\s*"([^"]+)"/)?.[1];
  assert.ok(password, "runtime password is declared");
  assert.ok((await read("scripts/encrypt-model.cjs")).includes(password));
  const encrypted = await readFile(
    new URL("public/models/character.enc", root),
  );
  const decipher = createDecipheriv(
    "aes-256-cbc",
    createHash("sha256").update(password).digest(),
    encrypted.subarray(0, 16),
  );
  const glb = Buffer.concat([
    decipher.update(encrypted.subarray(16)),
    decipher.final(),
  ]);
  assert.equal(glb.subarray(0, 4).toString(), "glTF");
  assert.equal(glb.readUInt32LE(4), 2);
  assert.equal(glb.readUInt32LE(8), glb.length);
});

test("SEO metadata uses the deployed project URL and an existing share image", async () => {
  const html = await read("index.html");
  assert.match(
    html,
    /rel="canonical"[^>]*https:\/\/az201214.github.io\/My-Portfolio\//,
  );
  for (const property of ["og:title", "og:description", "og:image", "og:url"])
    assert.ok(html.includes(property));
  assert.ok(html.includes("twitter:card"));
  assert.ok((await stat(new URL("public/og-image.jpg", root))).size > 0);
  assert.match(
    await read("public/sitemap.xml"),
    /https:\/\/az201214.github.io\/My-Portfolio\//,
  );
});

test("project previews are optimized and their references resolve", async () => {
  const source = await read("src/components/Work.tsx");
  const references = [...source.matchAll(/images\/([^`"']+)/g)].map(
    (m) => m[1],
  );
  assert.equal(references.length, 4);
  for (const name of references) {
    assert.match(name, /\.webp$/);
    assert.ok(
      (await stat(new URL(`public/images/${name}`, root))).size < 200_000,
    );
  }
  const files = await readdir(new URL("public/images/", root));
  assert.equal(files.filter((file) => file.endsWith(".png")).length, 0);
});

test("Work replaces QuietLoad with the FormBridge demo", async () => {
  const source = await read("src/components/Work.tsx");
  assert.ok(source.includes("FormBridge"));
  assert.ok(source.includes("https://formbridge-october.vercel.app/"));
  assert.ok(source.includes("Built by Ali Zain to simplify scholarship applications"));
  assert.doesNotMatch(source, /hackathon/i);
  assert.ok(!source.includes("QuietLoad"));
});

test("resume generation uses a declared cross-platform browser dependency", async () => {
  const pkg = JSON.parse(await read("package.json"));
  assert.ok(pkg.devDependencies["@playwright/test"]);
  for (const file of ["generate-pdf.cjs", "build-resume.cjs"]) {
    const source = await read(file);
    assert.ok(source.includes("@playwright/test"));
    assert.ok(!source.includes("Program Files"));
    execFileSync(process.execPath, ["--check", new URL(file, root).pathname]);
  }
});

test("CI gates deploy on lint, regression tests, build, links, and dependency audit", async () => {
  const workflow = await read(".github/workflows/deploy.yml");
  for (const command of [
    "npm run lint",
    "npm test",
    "npm run build",
    "npm run check:links",
    "npm run test:e2e",
    "npm audit",
  ])
    assert.ok(workflow.includes(command), `${command} is a CI gate`);
});
