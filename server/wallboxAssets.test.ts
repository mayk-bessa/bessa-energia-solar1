import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const homeSource = readFileSync(resolve(projectRoot, "client/src/pages/Home.tsx"), "utf8");
const gallerySource = readFileSync(resolve(projectRoot, "client/src/pages/GaleriaWallBox.tsx"), "utf8");

const wallboxAssets = [
  "/manus-storage/wallbox-pulsar-plus_609cc9b4.jpg",
  "/manus-storage/wallbox-paineis-solares_3c556904.jpg",
  "/manus-storage/carport-carro-eletrico_6d129f8f.jpg",
  "/manus-storage/estacionamento-carregamento-solar_1ee10208.jpg",
  "/manus-storage/carport-solar-profissional_c2fb61cf.jpg",
];

describe("WallBox image assets", () => {
  it("uses the generated assets in the homepage section", () => {
    for (const asset of wallboxAssets) {
      expect(homeSource).toContain(asset);
    }
  });

  it("uses the same generated assets in the full gallery", () => {
    for (const asset of wallboxAssets) {
      expect(gallerySource).toContain(asset);
    }
  });

  it("does not retain the inaccessible legacy image paths", () => {
    expect(homeSource).not.toContain("Jg2RMUES7eYD_61169483.jpg");
    expect(homeSource).not.toContain("lxYPE647fL7H_0da93c84.jpg");
    expect(homeSource).not.toContain("Udy7cfQuAh7N_b63b45f2.png");
    expect(homeSource).not.toContain("oLceu0RoRFBv_7837a09a.jpg");
    expect(homeSource).not.toContain("carport_ddb7d756.jpeg");
    expect(gallerySource).not.toContain("Jg2RMUES7eYD_61169483.jpg");
    expect(gallerySource).not.toContain("lxYPE647fL7H_0da93c84.jpg");
    expect(gallerySource).not.toContain("Udy7cfQuAh7N_b63b45f2.png");
    expect(gallerySource).not.toContain("oLceu0RoRFBv_7837a09a.jpg");
    expect(gallerySource).not.toContain("carport_ddb7d756.jpeg");
  });
});
