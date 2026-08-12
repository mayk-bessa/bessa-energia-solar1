import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const homeSource = readFileSync(resolve(projectRoot, "client/src/pages/Home.tsx"), "utf8");
const gallerySource = readFileSync(resolve(projectRoot, "client/src/pages/GaleriaWallBox.tsx"), "utf8");

const wallboxAssets = [
  "/images/wallbox/wallbox-pulsar-plus.webp",
  "/images/wallbox/wallbox-paineis-solares.webp",
  "/images/wallbox/carport-carro-eletrico.webp",
  "/images/wallbox/estacionamento-carregamento-solar.webp",
  "/images/wallbox/carport-solar-profissional.webp",
];

describe("WallBox local image assets", () => {
  it("uses the local /images/wallbox paths in the homepage section", () => {
    for (const asset of wallboxAssets) {
      expect(homeSource).toContain(asset);
    }
  });

  it("uses the same local paths in the full gallery", () => {
    for (const asset of wallboxAssets) {
      expect(gallerySource).toContain(asset);
    }
  });

  it("has every static file ready under client/public", () => {
    for (const asset of wallboxAssets) {
      expect(existsSync(resolve(projectRoot, "client/public", asset.slice(1)))).toBe(true);
    }
  });

  it("does not retain inaccessible legacy image paths", () => {
    const legacyPaths = [
      "Jg2RMUES7eYD_61169483.jpg",
      "lxYPE647fL7H_0da93c84.jpg",
      "Udy7cfQuAh7N_b63b45f2.png",
      "oLceu0RoRFBv_7837a09a.jpg",
      "carport_ddb7d756.jpeg",
      "/manus-storage/wallbox-pulsar-plus_609cc9b4.jpg",
      "/manus-storage/wallbox-paineis-solares_3c556904.jpg",
      "/manus-storage/carport-carro-eletrico_6d129f8f.jpg",
      "/manus-storage/estacionamento-carregamento-solar_1ee10208.jpg",
      "/manus-storage/carport-solar-profissional_c2fb61cf.jpg",
    ];

    for (const legacyPath of legacyPaths) {
      expect(homeSource).not.toContain(legacyPath);
      expect(gallerySource).not.toContain(legacyPath);
    }
  });
});
