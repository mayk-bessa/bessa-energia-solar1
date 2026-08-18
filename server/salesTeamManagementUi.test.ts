import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const proposalPage = readFileSync(resolve(process.cwd(), "client/src/pages/InteractiveChargingProposal.tsx"), "utf8");

describe("painel de gerenciamento de vendedores", () => {
  it("oferece criação, edição, desativação e exclusão para contas locais", () => {
    expect(proposalPage).toContain("Criar vendedor");
    expect(proposalPage).toContain("Editar vendedor");
    expect(proposalPage).toContain("Desativar");
    expect(proposalPage).toContain("Reativar");
    expect(proposalPage).toContain("Excluir");
    expect(proposalPage).toContain("updateLocalSeller.mutate");
    expect(proposalPage).toContain("setLocalSellerActive.mutate");
    expect(proposalPage).toContain("deleteLocalSeller.mutate");
  });
});
