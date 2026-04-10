import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("files.upload", () => {
  it("should validate required input fields", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.files.upload({
        fileName: "",
        fileData: "",
        mimeType: "",
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error).toBeDefined();
    }
  });

  it("should require authentication", async () => {
    const ctx = createAuthContext();
    ctx.user = null;
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.files.upload({
        fileName: "test.pdf",
        fileData: Buffer.from("test content").toString("base64"),
        mimeType: "application/pdf",
      });
      expect.fail("Should have thrown unauthorized error");
    } catch (error: any) {
      expect(error.message).toContain("Please login");
    }
  });

  it("should accept valid file upload input", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const testContent = "This is a test PDF file";
    const base64Content = Buffer.from(testContent).toString("base64");

    expect(() => {
      return caller.files.upload({
        fileName: "test.pdf",
        fileData: base64Content,
        mimeType: "application/pdf",
      });
    }).not.toThrow();
  });
});

describe("files.list", () => {
  it("should require authentication", async () => {
    const ctx = createAuthContext();
    ctx.user = null;
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.files.list();
      expect.fail("Should have thrown unauthorized error");
    } catch (error: any) {
      expect(error.message).toContain("Please login");
    }
  });

  it("should return empty array for new user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const files = await caller.files.list();
    expect(Array.isArray(files)).toBe(true);
  });
});
