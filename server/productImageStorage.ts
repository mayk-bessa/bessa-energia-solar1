import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const allowedExtensions = new Set(["png", "jpg", "webp"]);

export function getProductImageDirectory() {
  const configuredDirectory = process.env.LOCAL_PRODUCT_IMAGE_DIR?.trim();
  return configuredDirectory || path.resolve(import.meta.dirname, "..", "uploaded-products");
}

export async function storeProductImageLocally(buffer: Buffer, extension: "png" | "jpg" | "webp") {
  if (!allowedExtensions.has(extension)) throw new Error("Extensão de imagem não permitida");
  const directory = getProductImageDirectory();
  const fileName = `${randomUUID()}.${extension}`;
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, fileName), buffer, { flag: "wx" });
  return { key: `local-products/${fileName}`, url: `/uploads/products/${fileName}` };
}
