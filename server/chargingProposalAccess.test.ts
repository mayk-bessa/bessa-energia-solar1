import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import type { User } from "../drizzle/schema";

function contextFor(role: User["role"]): TrpcContext {
  const user: User = {
    id: role === "seller" ? 2 : 3,
    openId: `${role}-proposal-test`,
    email: `${role}@example.com`,
    name: `${role} proposal test`,
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return { user, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

describe("charging proposal access", () => {
  it("blocks a regular user before accessing proposal data", async () => {
    const caller = appRouter.createCaller(contextFor("user"));
    await expect(caller.chargingProposals.list()).rejects.toThrow("Acesso restrito a vendedores autorizados");
  });

  it("allows a seller to access the seller-scoped proposal list", async () => {
    const caller = appRouter.createCaller(contextFor("seller"));
    const proposals = await caller.chargingProposals.list();
    expect(Array.isArray(proposals)).toBe(true);
  });

  it("blocks a seller from managing other user roles", async () => {
    const caller = appRouter.createCaller(contextFor("seller"));
    await expect(caller.salesTeam.listUsers()).rejects.toThrow();
  });
});
