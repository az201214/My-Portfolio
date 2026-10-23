// Asset obfuscation only: this public key does not provide access control.
const crypto = require("node:crypto");
const fs = require("node:fs");
const { pipeline } = require("node:stream/promises");
const path = require("node:path");
const MODEL_PASSWORD = "MyCharacter12";

async function main() {
  const input = process.argv[2];
  const output =
    process.argv[3] || path.join(__dirname, "../public/models/character.enc");
  if (!input)
    throw new Error(
      "Usage: node scripts/encrypt-model.cjs <character.glb> [output.enc]",
    );
  if (path.resolve(input) === path.resolve(output))
    throw new Error("Input and output must be different files");
  const header = Buffer.alloc(4);
  const fd = fs.openSync(input, "r");
  try {
    fs.readSync(fd, header, 0, 4, 0);
  } finally {
    fs.closeSync(fd);
  }
  if (header.toString() !== "glTF")
    throw new Error("Expected a binary glTF (.glb) model");
  const key = crypto.createHash("sha256").update(MODEL_PASSWORD).digest();
  const iv = crypto.randomBytes(16);
  fs.writeFileSync(output, iv);
  await pipeline(
    fs.createReadStream(input),
    crypto.createCipheriv("aes-256-cbc", key, iv),
    fs.createWriteStream(output, { flags: "a" }),
  );
  console.log(`Model encrypted: ${output}`);
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
