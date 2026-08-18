import { beforeEach, describe, expect, it, vi } from "vitest";

const database = vi.hoisted(() => ({
  createLocalUserAccount: vi.fn(),
  getLocalAccountByEmail: vi.fn(),
  touchLocalUser: vi.fn(),
}));

vi.mock("./db", () => database);

import { authenticateLocalUser, hashLocalPassword, verifyLocalPassword } from "./localAuth";

const adminUser = {
  id: 1,
  openId: "local:admin@bessaenergia.com.br",
  name: "Administrador Bessa Energia",
  email: "admin@bessaenergia.com.br",
  loginMethod: "local",
  role: "admin" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

describe("autenticação local", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.LOCAL_AUTH_BOOTSTRAP_EMAIL = "admin@bessaenergia.com.br";
    process.env.LOCAL_AUTH_BOOTSTRAP_PASSWORD = "senha-administrativa-segura";
  });

  it("gera hash scrypt e valida apenas a senha correta", async () => {
    const hash = await hashLocalPassword("senha-de-teste-segura");

    expect(hash).toMatch(/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/);
    await expect(verifyLocalPassword("senha-de-teste-segura", hash)).resolves.toBe(true);
    await expect(verifyLocalPassword("senha-incorreta", hash)).resolves.toBe(false);
    await expect(verifyLocalPassword("senha-de-teste-segura", "formato-inválido")).resolves.toBe(false);
  });

  it("autentica uma conta ativa, normaliza o e-mail e atualiza o último acesso", async () => {
    const sellerUser = {
      ...adminUser,
      id: 2,
      openId: "local:vendedor@bessaenergia.com.br",
      email: "vendedor@bessaenergia.com.br",
      name: "Vendedor Bessa",
      role: "seller" as const,
    };
    const sellerPasswordHash = await hashLocalPassword("senha-do-vendedor-segura");
    database.getLocalAccountByEmail.mockImplementation(async (email: string) => {
      if (email === adminUser.email) return { user: adminUser };
      if (email === sellerUser.email) return { user: sellerUser, account: { isActive: 1, passwordHash: sellerPasswordHash } };
      return undefined;
    });

    await expect(authenticateLocalUser("  VENDEDOR@BESSAENERGIA.COM.BR ", "senha-do-vendedor-segura")).resolves.toEqual(sellerUser);
    expect(database.touchLocalUser).toHaveBeenCalledWith(sellerUser.id);
  });

  it("recusa senha inválida ou uma conta inativa", async () => {
    const passwordHash = await hashLocalPassword("senha-do-vendedor-segura");
    database.getLocalAccountByEmail.mockImplementation(async (email: string) => {
      if (email === adminUser.email) return { user: adminUser };
      return { user: { ...adminUser, id: 2, role: "seller" as const }, account: { isActive: 0, passwordHash } };
    });

    await expect(authenticateLocalUser("vendedor@bessaenergia.com.br", "senha-incorreta")).resolves.toBeNull();
    expect(database.touchLocalUser).not.toHaveBeenCalled();
  });
});
