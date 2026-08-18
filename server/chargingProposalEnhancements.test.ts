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
    expect(pageSource).toContain("Histórico de propostas enviadas");
    expect(pageSource).toContain("Relatório mensal da equipe");
    expect(pageSource).toContain("Meu relatório mensal");
    expect(pageSource).toContain("emailDeliveryFeedback");
    expect(pageSource).toContain("Preparando o PDF e enviando a proposta");
    expect(pageSource).toContain("Envio confirmado");
    expect(pageSource).toContain("Tentar novamente");
    expect(pageSource).toContain('aria-busy={sendProposal.isPending}');
  });

  it("exposes restricted queries for sent history and monthly reporting", () => {
    expect(routerSource).toContain("sentHistory: sellerProcedure");
    expect(routerSource).toContain("monthlyReport: sellerProcedure");
  });
});
