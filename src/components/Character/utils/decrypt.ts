async function generateAESKey(password: string): Promise<CryptoKey> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(password),
  );
  return crypto.subtle.importKey("raw", digest, { name: "AES-CBC" }, false, [
    "encrypt",
    "decrypt",
  ]);
}

export const decryptFile = async (
  url: string,
  password: string,
): Promise<ArrayBuffer> => {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Character asset request failed (${response.status})`);
  const encryptedData = await response.arrayBuffer();
  if (encryptedData.byteLength <= 16)
    throw new Error("Character asset is empty or invalid");
  return crypto.subtle.decrypt(
    { name: "AES-CBC", iv: new Uint8Array(encryptedData.slice(0, 16)) },
    await generateAESKey(password),
    encryptedData.slice(16),
  );
};
