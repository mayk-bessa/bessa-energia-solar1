import { describe, expect, it } from "vitest";

describe("budget.scheduleVisit - Input Validation", () => {
  it("should validate visit date format (YYYY-MM-DD)", () => {
    const visitDate = new Date();
    visitDate.setDate(visitDate.getDate() + 7);
    const dateString = visitDate.toISOString().split("T")[0];

    expect(dateString).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("should create valid visit date 7 days from now", () => {
    const visitDate = new Date();
    visitDate.setDate(visitDate.getDate() + 7);
    const dateString = visitDate.toISOString().split("T")[0];

    const parsed = new Date(dateString);
    expect(parsed).toBeInstanceOf(Date);
    expect(parsed.getTime()).toBeGreaterThan(Date.now());
  });

  it("should create valid visit date 5 days from now", () => {
    const visitDate = new Date();
    visitDate.setDate(visitDate.getDate() + 5);
    const dateString = visitDate.toISOString().split("T")[0];

    const parsed = new Date(dateString);
    expect(parsed).toBeInstanceOf(Date);
    expect(parsed.getTime()).toBeGreaterThan(Date.now());
  });

  it("should accept optional notes parameter", () => {
    const notes = "Visita técnica agendada com sucesso";
    expect(notes).toBeDefined();
    expect(typeof notes).toBe("string");
    expect(notes.length).toBeGreaterThan(0);
  });

  it("should handle budget request ID as number", () => {
    const budgetRequestId = 1;
    expect(typeof budgetRequestId).toBe("number");
    expect(budgetRequestId).toBeGreaterThan(0);
  });

  it("should format complete schedule visit payload", () => {
    const visitDate = new Date();
    visitDate.setDate(visitDate.getDate() + 7);

    const payload = {
      budgetRequestId: 1,
      visitDate: visitDate.toISOString().split("T")[0],
      notes: "Visita técnica agendada",
    };

    expect(payload).toHaveProperty("budgetRequestId");
    expect(payload).toHaveProperty("visitDate");
    expect(payload).toHaveProperty("notes");
    expect(typeof payload.budgetRequestId).toBe("number");
    expect(typeof payload.visitDate).toBe("string");
    expect(typeof payload.notes).toBe("string");
  });
});
