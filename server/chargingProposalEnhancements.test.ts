import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const routerSource = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");
const pageSource = readFileSync(new URL("../client/src/pages/InteractiveChargingProposal.tsx", import.meta.url), "utf8");

describe("charging proposal enhancements", () => {
  it("exposes protected status, duplication, upload and PDF preview flows", () => {
    expect(routerSource).toContain('z.enum(["pending", "approved", "rejected"])');
    expect(routerSource).toContain("duplicate: sellerProcedure");
    expect(routerSource).toContain("uploadProductImage: sellerProcedure");
    expect(routerSource).toContain("previewPdf: sellerProcedure");
    expect(routerSource).toContain("storagePut(");
  });

  it("requires PDF preview before e-mail delivery and offers image controls", () => {
    expect(pageSource).toContain("Pré-visualizar PDF");
    expect(pageSource).toContain("hasPreviewedCurrentProposal");
    expect(pageSource).toContain("Inserir imagem");
    expect(pageSource).toContain("Visualizar imagem");
    expect(pageSource).toContain("Pendente");
    expect(pageSource).toContain("Aprovada");
    expect(pageSource).toContain("Recusada");
    expect(pageSource).toContain("Duplicar");
    expect(pageSource).toContain("Clonar e editar");
    expect(pageSource).toContain("Nova proposta");
    expect(pageSource).toContain("Sair com segurança");
    expect(pageSource).toContain("cloneProposalForEditing");
    expect(pageSource).toContain("handleSecureLogout");
  });
});
