import { describe, expect, it, vi } from "vitest";

const localAuth = vi.hoisted(() => ({ authenticateLocalUser: vi.fn() }));

vi.mock("./localAuth", () => ({
  authenticateLocalUser: localAuth.authenticateLocalUser,
  hashLocalPassword: vi.fn(),
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { COOKIE_NAME, ONE_YEAR_MS } from "../shared/const";

function contextWithCookieCapture() {
  const cookies: Array<{ name: string; value: string; options: Record<string, unknown> }> = [];
  const ctx: TrpcContext = {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { cookie: (name: string, value: string, options: Record<string, unknown>) => cookies.push({ name, value, options }) } as TrpcContext["res"],
  };
  return { ctx, cookies };
}

describe("auth.localLogin", () => {
  it("cria uma sessão persistente após credenciais locais válidas", async () => {
    localAuth.authenticateLocalUser.mockResolvedValue({
      id: 9,
      openId: "local:vendedor@bessaenergia.com.br",
      name: "Vendedor Bessa",
      email: "vendedor@bessaenergia.com.br",
      role: "seller",
    });
    const { ctx, cookies } = contextWithCookieCapture();

    const result = await appRouter.createCaller(ctx).auth.localLogin({ email: "vendedor@bessaenergia.com.br", password: "senha-segura" });

    expect(result).toMatchObject({ id: 9, role: "seller", email: "vendedor@bessaenergia.com.br" });
    expect(cookies).toHaveLength(1);
    expect(cookies[0]).toMatchObject({ name: COOKIE_NAME, options: { maxAge: ONE_YEAR_MS, httpOnly: true } });
    expect(cookies[0]?.value).toBeTruthy();
  });

  it("não cria sessão quando as credenciais não são aceitas", async () => {
    localAuth.authenticateLocalUser.mockResolvedValue(null);
    const { ctx, cookies } = contextWithCookieCapture();

    await expect(appRouter.createCaller(ctx).auth.localLogin({ email: "vendedor@bessaenergia.com.br", password: "senha-incorreta" })).rejects.toThrow("E-mail ou senha inválidos");
    expect(cookies).toHaveLength(0);
  });
});
