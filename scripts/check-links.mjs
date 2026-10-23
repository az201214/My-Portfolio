import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../dist/", import.meta.url));
const base = "/My-Portfolio/";
const errors = [];
let checked = 0;
async function exists(file) {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
}
async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(file)));
    else files.push(file);
  }
  return files;
}
function localFile(url, source) {
  if (!url || /^(?:https?:|data:|mailto:|tel:|blob:|#|\/\/)/.test(url))
    return null;
  const clean = decodeURIComponent(url.split(/[?#]/)[0]);
  if (clean.startsWith("/")) {
    if (!clean.startsWith(base)) {
      errors.push(`${source}: path escapes GitHub Pages base: ${url}`);
      return null;
    }
    return path.join(root, clean.slice(base.length));
  }
  return path.resolve(path.dirname(source), clean);
}
export async function checkBuiltLinks() {
  for (const file of await walk(root)) {
    if (!/\.(html|css|js)$/.test(file)) continue;
    const text = await readFile(file, "utf8");
    const refs = [];
    if (file.endsWith(".html")) {
      for (const match of text.matchAll(/(?:src|href)=["']([^"']+)["']/g))
        refs.push(match[1]);
    } else if (file.endsWith(".css")) {
      for (const match of text.matchAll(/url\(["']?([^\s)'" ]+)["']?\)/g))
        refs.push(match[1]);
    }
    // Vite's BASE_URL substitution also appears in runtime image, PDF and model strings.
    for (const match of text.matchAll(
      /(?:["'`])((?:\/My-Portfolio\/)[^"'`\s<>]+\.(?:webp|png|jpe?g|pdf|hdr|enc|wasm|js))(?=["'`])/g,
    ))
      refs.push(match[1]);
    for (const ref of new Set(refs)) {
      const target = localFile(ref, file);
      if (!target) continue;
      checked++;
      if (!(await exists(target)))
        errors.push(`${path.relative(root, file)}: missing ${ref}`);
    }
  }
  if (errors.length) throw new Error(errors.join("\n"));
  console.log(`Validated ${checked} local asset references under ${base}`);
}
await checkBuiltLinks();
