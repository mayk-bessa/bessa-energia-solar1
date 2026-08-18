import { beforeEach, describe, expect, it, vi } from "vitest";

const management = vi.hoisted(() => ({
  updateLocalSellerAccount: vi.fn(),
  setLocalSellerAccountActive: vi.fn(),
  deleteLocalSellerAccount: vi.fn(),
}));

vi.mock("./db", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./db")>()),
  updateLocalSellerAccount: management.updateLocalSellerAccount,
  setLocalSellerAccountActive: management.setLocalSellerAccountActive,
  deleteLocalSellerAccount: management.deleteLocalSellerAccount,
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function contextFor(role: "user" | "seller" | "admin"): TrpcContext {
  return {
    user: {
      id: role === "admin" ? 1 : 2,
      openId: `${role}-management-test`,
      email: `${role}@bessaenergia.com.br`,
      name: `${role} management test`,
      loginMethod: "local",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("gestão administrativa de vendedores locais", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("permite ao administrador editar dados sem redefinir a senha", async () => {
    const result = await appRouter.createCaller(contextFor("admin")).salesTeam.updateLocalSeller({
      id: 7,
      name: "Vendedor Atualizado",
      email: "vendedor.atualizado@bessaenergia.com.br",
    });

    expect(result).toEqual({ success: true });
    expect(management.updateLocalSellerAccount).toHaveBeenCalledWith({
      id: 7,
      name: "Vendedor Atualizado",
      email: "vendedor.atualizado@bessaenergia.com.br",
      passwordHash: undefined,
    });
  });

  it("permite ao administrador desativar uma conta local", async () => {
    const result = await appRouter.createCaller(contextFor("admin")).salesTeam.setLocalSellerActive({ id: 7, isActive: false });

    expect(result).toEqual({ success: true });
    expect(management.setLocalSellerAccountActive).toHaveBeenCalledWith(7, false);
  });

  it("permite ao administrador solicitar a exclusão permanente de uma conta local", async () => {
    const result = await appRouter.createCaller(contextFor("admin")).salesTeam.deleteLocalSeller({ id: 7 });

    expect(result).toEqual({ success: true });
    expect(management.deleteLocalSellerAccount).toHaveBeenCalledWith(7);
  });

  it("bloqueia vendedores de gerenciar outras contas", async () => {
    const caller = appRouter.createCaller(contextFor("seller"));

    await expect(caller.salesTeam.deleteLocalSeller({ id: 7 })).rejects.toThrow();
    expect(management.deleteLocalSellerAccount).not.toHaveBeenCalledWith(7);
  });
});
