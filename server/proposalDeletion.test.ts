import { beforeEach, describe, expect, it, vi } from "vitest";

const proposals = vi.hoisted(() => ({
  getChargingProposalById: vi.fn(),
  deleteChargingProposal: vi.fn(),
}));

vi.mock("./db", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./db")>()),
  getChargingProposalById: proposals.getChargingProposalById,
  deleteChargingProposal: proposals.deleteChargingProposal,
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function contextFor(role: "seller" | "admin"): TrpcContext {
  return {
    user: { id: role === "admin" ? 1 : 2, openId: `proposal-${role}`, name: role, email: `${role}@bessaenergia.com.br`, loginMethod: "local", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("exclusão administrativa de propostas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    proposals.getChargingProposalById.mockResolvedValue({ id: 19, clientName: "Cliente", sellerId: 2 });
    proposals.deleteChargingProposal.mockResolvedValue({});
  });

  it("permite que administrador exclua uma proposta existente", async () => {
    await expect(appRouter.createCaller(contextFor("admin")).chargingProposals.delete({ id: 19 })).resolves.toEqual({ success: true });
    expect(proposals.deleteChargingProposal).toHaveBeenCalledWith(19);
  });

  it("bloqueia vendedores da exclusão de propostas", async () => {
    await expect(appRouter.createCaller(contextFor("seller")).chargingProposals.delete({ id: 19 })).rejects.toThrow();
    expect(proposals.deleteChargingProposal).not.toHaveBeenCalled();
  });

  it("não exclui uma proposta inexistente", async () => {
    proposals.getChargingProposalById.mockResolvedValue(undefined);
    await expect(appRouter.createCaller(contextFor("admin")).chargingProposals.delete({ id: 999 })).rejects.toThrow("Proposta não encontrada");
    expect(proposals.deleteChargingProposal).not.toHaveBeenCalled();
  });
});
