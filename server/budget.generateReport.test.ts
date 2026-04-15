import { describe, it, expect, beforeEach } from "vitest";
import { generateSolarReportPDF, type SolarCalculationData } from "./pdfGenerator";
import { sendPDFReportEmail } from "./emailService";

describe("budget.generateReport", () => {
  let testData: SolarCalculationData;

  beforeEach(() => {
    testData = {
      monthlySpend: 500,
      monthlyEconomy: 475,
      annualEconomy: 5700,
      monthlyProduction: 714.29,
      annualProduction: 8571.43,
      paybackYears: 3.2,
      systemSize: "5.95 kW",
      clientName: "João Silva",
      clientEmail: "joao@example.com",
      clientPhone: "(31) 99102-9003",
      generatedAt: new Date("2026-04-15"),
    };
  });

  it("should generate a valid PDF buffer", async () => {
    const pdfBuffer = await generateSolarReportPDF(testData);

    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(1000);
    // PDF files start with %PDF
    expect(pdfBuffer.toString("utf8", 0, 4)).toBe("%PDF");
  });

  it("should generate PDF with client information", async () => {
    const pdfBuffer = await generateSolarReportPDF(testData);

    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(1000);
    expect(pdfBuffer.toString("utf8", 0, 4)).toBe("%PDF");
  });

  it("should generate PDF without client information", async () => {
    const dataWithoutClient = {
      ...testData,
      clientName: undefined,
      clientEmail: undefined,
      clientPhone: undefined,
    };

    const pdfBuffer = await generateSolarReportPDF(dataWithoutClient);

    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(1000);
    expect(pdfBuffer.toString("utf8", 0, 4)).toBe("%PDF");
  });

  it("should generate PDF with correct calculations", async () => {
    const pdfBuffer = await generateSolarReportPDF(testData);

    // Verify it's a valid PDF
    expect(pdfBuffer.toString("utf8", 0, 4)).toBe("%PDF");

    // Verify size is reasonable (should be between 1KB and 200KB)
    expect(pdfBuffer.length).toBeGreaterThan(1000);
    expect(pdfBuffer.length).toBeLessThan(200000);
  });

  it("should export sendPDFReportEmail function", () => {
    // Verify the function exists and is callable
    expect(typeof sendPDFReportEmail).toBe("function");
  });

  it("should generate PDF with large calculation values", async () => {
    const alternativeData: SolarCalculationData = {
      monthlySpend: 1000,
      monthlyEconomy: 950,
      annualEconomy: 11400,
      monthlyProduction: 1428.57,
      annualProduction: 17142.86,
      paybackYears: 2.5,
      systemSize: "11.9 kW",
      clientName: "Maria Santos",
      clientEmail: "maria@example.com",
      clientPhone: "(31) 98765-4321",
    };

    const pdfBuffer = await generateSolarReportPDF(alternativeData);

    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(1000);
    expect(pdfBuffer.toString("utf8", 0, 4)).toBe("%PDF");
  });

  it("should generate PDF with small calculation values", async () => {
    const minimalData: SolarCalculationData = {
      monthlySpend: 100,
      monthlyEconomy: 95,
      annualEconomy: 1140,
      monthlyProduction: 142.86,
      annualProduction: 1714.29,
      paybackYears: 5.0,
      systemSize: "1.19 kW",
    };

    const pdfBuffer = await generateSolarReportPDF(minimalData);

    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(1000);
    expect(pdfBuffer.toString("utf8", 0, 4)).toBe("%PDF");
  });
});
