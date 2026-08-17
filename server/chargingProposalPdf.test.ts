import { describe, expect, it } from "vitest";
import { generateChargingProposalPDF } from "./chargingProposalPdf";

describe("charging proposal PDF", () => {
  it("generates a valid PDF with the commercial components", async () => {
    const pdf = await generateChargingProposalPDF({
      proposalId: 42,
      clientName: "Renata Coelho Teixeira",
      sellerName: "Vendedor Bessa",
      components: [
        { name: "Estação de recarga Intelbras Home EVE 0074H", quantity: 1, unitPrice: 3590 },
        { name: "Mão de obra de instalação", quantity: 1, unitPrice: 800 },
      ],
      totalCents: 439000,
      createdAt: new Date("2026-08-17T12:00:00Z"),
    });

    expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
    expect(pdf.length).toBeGreaterThan(1000);
  });
});
