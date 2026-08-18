import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { extractInsertId } from "./db";
import { storeProductImageLocally } from "./productImageStorage";

const originalDirectory = process.env.LOCAL_PRODUCT_IMAGE_DIR;
const directories: string[] = [];

afterEach(async () => {
  if (originalDirectory === undefined) delete process.env.LOCAL_PRODUCT_IMAGE_DIR;
  else process.env.LOCAL_PRODUCT_IMAGE_DIR = originalDirectory;
  await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe("armazenamento local de imagens de produto", () => {
  it("persiste uma imagem no diretório local e retorna uma URL pública estável", async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "bessa-product-images-"));
    directories.push(directory);
    process.env.LOCAL_PRODUCT_IMAGE_DIR = directory;

    const stored = await storeProductImageLocally(Buffer.from("imagem de teste"), "webp");

    expect(stored.key).toMatch(/^local-products\/.+\.webp$/);
    expect(stored.url).toMatch(/^\/uploads\/products\/.+\.webp$/);
    await expect(readFile(path.join(directory, stored.key.replace("local-products/", "")), "utf8")).resolves.toBe("imagem de teste");
  });
});

describe("identificador de proposta salva", () => {
  it("extrai insertId das formas de resposta do driver MySQL", () => {
    expect(extractInsertId({ insertId: 42 })).toBe(42);
    expect(extractInsertId([{ insertId: "43" }, undefined])).toBe(43);
    expect(extractInsertId({ insertId: 0 })).toBeUndefined();
  });
});
