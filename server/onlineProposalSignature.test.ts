import { beforeEach, describe, expect, it, vi } from "vitest";

const signature = vi.hoisted(() => ({
  getChargingProposalBySignatureToken: vi.fn(),
  signChargingProposal: vi.fn(),
}));

vi.mock("./db", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./db")>()),
  getChargingProposalBySignatureToken: signature.getChargingProposalBySignatureToken,
  signChargingProposal: signature.signChargingProposal,
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const publicContext: TrpcContext = { user: null, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
const token = "550e8400-e29b-41d4-a716-446655440000";

describe("aceite eletrônico de proposta", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    signature.getChargingProposalBySignatureToken.mockResolvedValue({ id: 31, clientEmail: "cliente@exemplo.com", signedAt: null, validUntil: new Date(Date.now() + 86_400_000) });
    signature.signChargingProposal.mockResolvedValue(new Date("2026-08-18T15:00:00Z"));
  });

  it("registra o aceite com o nome e o mesmo e-mail informado na proposta", async () => {
    await expect(appRouter.createCaller(publicContext).chargingProposals.signOnline({ token, name: "Cliente de Teste", email: "CLIENTE@EXEMPLO.COM" })).resolves.toMatchObject({ success: true, alreadySigned: false });
    expect(signature.signChargingProposal).toHaveBeenCalledWith({ id: 31, name: "Cliente de Teste", email: "CLIENTE@EXEMPLO.COM" });
  });

  it("recusa aceite com e-mail diferente do cadastro", async () => {
    await expect(appRouter.createCaller(publicContext).chargingProposals.signOnline({ token, name: "Cliente de Teste", email: "outro@exemplo.com" })).rejects.toThrow("Use o mesmo e-mail");
    expect(signature.signChargingProposal).not.toHaveBeenCalled();
  });

  it("recusa aceite após o prazo de validade", async () => {
    signature.getChargingProposalBySignatureToken.mockResolvedValue({ id: 31, clientEmail: "cliente@exemplo.com", signedAt: null, validUntil: new Date(Date.now() - 1_000) });
    await expect(appRouter.createCaller(publicContext).chargingProposals.signOnline({ token, name: "Cliente de Teste", email: "cliente@exemplo.com" })).rejects.toThrow("expirada");
    expect(signature.signChargingProposal).not.toHaveBeenCalled();
  });
});
