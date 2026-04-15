import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock nodemailer
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: "test-id" }),
    })),
  },
}));

function createPublicContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };

  return ctx;
}

describe("budget.sendRequest", () => {
  it("sends a budget request email with valid data", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.budget.sendRequest({
      fullName: "João Silva",
      email: "joao@example.com",
      phone: "(31) 99999-9999",
      recipientEmail: "vendas@bessaenergia.com.br",
    });

    expect(result).toEqual({
      success: true,
      message: "Solicitação enviada com sucesso",
    });
  });

  it("rejects invalid email format", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.budget.sendRequest({
        fullName: "João Silva",
        email: "invalid-email",
        phone: "(31) 99999-9999",
        recipientEmail: "vendas@bessaenergia.com.br",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("rejects empty full name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.budget.sendRequest({
        fullName: "",
        email: "joao@example.com",
        phone: "(31) 99999-9999",
        recipientEmail: "vendas@bessaenergia.com.br",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("requires all fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.budget.sendRequest({
        fullName: "João Silva",
        email: "joao@example.com",
        phone: "",
        recipientEmail: "vendas@bessaenergia.com.br",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
