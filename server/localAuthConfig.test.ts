import { describe, expect, it } from "vitest";

describe("configuração de autenticação local", () => {
  it("possui credenciais administrativas válidas para o acesso local", () => {
    const email = process.env.LOCAL_AUTH_BOOTSTRAP_EMAIL?.trim() ?? "";
    const password = process.env.LOCAL_AUTH_BOOTSTRAP_PASSWORD ?? "";

    expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(password.length).toBeGreaterThanOrEqual(16);
  });
});
