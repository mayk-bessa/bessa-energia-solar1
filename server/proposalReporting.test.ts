import { describe, expect, it } from "vitest";
import { buildMonthlyProposalMetrics } from "./db";

describe("relatórios mensais de propostas", () => {
  it("agrega volume, status, envios e valores por vendedor", () => {
    const metrics = buildMonthlyProposalMetrics("2026-08", [
      { sellerId: 1, sellerName: "Ana", totalCents: 150000, sentAt: new Date("2026-08-03T10:00:00Z"), status: "approved" },
      { sellerId: 1, sellerName: "Ana", totalCents: 50000, sentAt: null, status: "pending" },
      { sellerId: 2, sellerName: "Bruno", totalCents: 90000, sentAt: new Date("2026-08-08T10:00:00Z"), status: "rejected" },
    ]);

    expect(metrics).toMatchObject({
      month: "2026-08",
      totalProposals: 3,
      sentProposals: 2,
      pendingProposals: 1,
      approvedProposals: 1,
      rejectedProposals: 1,
      totalCents: 290000,
      sentTotalCents: 240000,
    });
    expect(metrics.bySeller).toEqual([
      { sellerId: 1, sellerName: "Ana", totalProposals: 2, sentProposals: 1, totalCents: 200000 },
      { sellerId: 2, sellerName: "Bruno", totalProposals: 1, sentProposals: 1, totalCents: 90000 },
    ]);
  });
});
