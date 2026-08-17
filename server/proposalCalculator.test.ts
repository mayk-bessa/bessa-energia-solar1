import { describe, expect, it } from "vitest";
import { calculateLineTotal, calculateProposalTotal } from "../client/src/lib/proposalCalculator";

describe("proposal calculator", () => {
  it("calculates the subtotal from quantity and unit price", () => {
    expect(calculateLineTotal({ id: "cable", name: "Cabo", quantity: 3, unitPrice: 45.5 })).toBe(136.5);
  });

  it("does not allow a negative value to reduce the commercial total", () => {
    expect(calculateLineTotal({ id: "invalid", name: "Item", quantity: -2, unitPrice: -10 })).toBe(0);
  });

  it("sums every proposal component automatically", () => {
    expect(calculateProposalTotal([
      { id: "charger", name: "EVE 0074H", quantity: 1, unitPrice: 3590 },
      { id: "service", name: "Instalação", quantity: 1, unitPrice: 800 },
      { id: "cable", name: "Cabo", quantity: 4, unitPrice: 35 },
    ])).toBe(4530);
  });
});
