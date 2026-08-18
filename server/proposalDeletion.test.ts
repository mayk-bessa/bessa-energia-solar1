import { beforeEach, describe, expect, it, vi } from "vitest";

const proposals = vi.hoisted(() => ({
  getChargingProposalById: vi.fn(),
  moveChargingProposalToTrash: vi.fn(),
  getTrashedChargingProposals: vi.fn(),
  restoreChargingProposal: vi.fn(),
  getProposalDeletionAudits: vi.fn(),
}));

vi.mock("./db", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./db")>()),
  getChargingProposalById: proposals.getChargingProposalById,
  moveChargingProposalToTrash: proposals.moveChargingProposalToTrash,
  getTrashedChargingProposals: proposals.getTrashedChargingProposals,
  restoreChargingProposal: proposals.restoreChargingProposal,
  getProposalDeletionAudits: proposals.getProposalDeletionAudits,
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

describe("lixeira e auditoria administrativa de propostas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    proposals.getChargingProposalById.mockResolvedValue({ id: 19, clientName: "Cliente", sellerId: 2 });
    proposals.moveChargingProposalToTrash.mockResolvedValue({});
    proposals.getTrashedChargingProposals.mockResolvedValue([{ id: 19, clientName: "Cliente" }]);
    proposals.restoreChargingProposal.mockResolvedValue({});
    proposals.getProposalDeletionAudits.mockResolvedValue([{ id: 5, proposalId: 19 }]);
  });

  it("move a proposta para a lixeira com o responsável e o motivo", async () => {
    await expect(appRouter.createCaller(contextFor("admin")).chargingProposals.delete({ id: 19, reason: "Proposta substituída" })).resolves.toEqual({ success: true });
    expect(proposals.moveChargingProposalToTrash).toHaveBeenCalledWith(expect.objectContaining({
      proposal: expect.objectContaining({ id: 19 }),
      deletedBy: 1,
      deletedByName: "admin",
      reason: "Proposta substituída",
    }));
  });

  it("bloqueia vendedores da exclusão e da consulta à lixeira", async () => {
    const seller = appRouter.createCaller(contextFor("seller")).chargingProposals;
    await expect(seller.delete({ id: 19 })).rejects.toThrow();
    await expect(seller.listTrash()).rejects.toThrow();
    expect(proposals.moveChargingProposalToTrash).not.toHaveBeenCalled();
  });

  it("permite ao administrador listar, restaurar e auditar exclusões", async () => {
    const admin = appRouter.createCaller(contextFor("admin")).chargingProposals;
    await expect(admin.listTrash()).resolves.toEqual([{ id: 19, clientName: "Cliente" }]);
    await expect(admin.restoreFromTrash({ id: 19 })).resolves.toEqual({ success: true });
    await expect(admin.listDeletionAudits()).resolves.toEqual([{ id: 5, proposalId: 19 }]);
    expect(proposals.restoreChargingProposal).toHaveBeenCalledWith(19);
  });

  it("não movimenta para a lixeira uma proposta inexistente", async () => {
    proposals.getChargingProposalById.mockResolvedValue(undefined);
    await expect(appRouter.createCaller(contextFor("admin")).chargingProposals.delete({ id: 999 })).rejects.toThrow("Proposta não encontrada");
    expect(proposals.moveChargingProposalToTrash).not.toHaveBeenCalled();
  });
});
