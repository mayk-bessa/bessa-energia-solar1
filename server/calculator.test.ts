import { describe, expect, it } from "vitest";

/**
 * Solar Calculator Logic Tests
 * Tests the economic calculations for solar energy systems
 */

describe("Solar Calculator", () => {
  // Constants based on Brazilian solar energy data
  const ECONOMY_RATE = 0.95; // 95% economy
  const KWH_COST = 0.70; // Average cost per kWh in Brazil
  const PRODUCTION_PER_KW = 120; // kWh per month per kW
  const INVESTMENT_PER_KW = 3000; // R$ per kW

  const calculateEconomy = (monthlySpend: number) => {
    const monthlyEconomy = monthlySpend * ECONOMY_RATE;
    const estimatedKwh = monthlySpend / KWH_COST;
    const requiredKw = estimatedKwh / PRODUCTION_PER_KW;
    const totalInvestment = requiredKw * INVESTMENT_PER_KW;
    const paybackMonths = totalInvestment / monthlyEconomy;
    const paybackYears = paybackMonths / 12;

    return {
      monthlySpend,
      monthlyProduction: estimatedKwh,
      monthlyEconomy,
      annualEconomy: monthlyEconomy * 12,
      paybackYears,
    };
  };

  it("should calculate economy for R$ 500 monthly spend", () => {
    const result = calculateEconomy(500);
    
    expect(result.monthlySpend).toBe(500);
    expect(result.monthlyEconomy).toBe(475); // 500 * 0.95
    expect(result.annualEconomy).toBe(5700); // 475 * 12
    expect(result.monthlyProduction).toBeCloseTo(714.29, 1); // 500 / 0.70
  });

  it("should calculate payback period correctly", () => {
    const result = calculateEconomy(500);
    
    // Payback should be positive and reasonable (typically 5-8 years in Brazil)
    expect(result.paybackYears).toBeGreaterThan(0);
    expect(result.paybackYears).toBeLessThan(15);
  });

  it("should scale proportionally for different spend amounts", () => {
    const result1 = calculateEconomy(500);
    const result2 = calculateEconomy(1000);
    
    // Double spend should double economy
    expect(result2.monthlyEconomy).toBeCloseTo(result1.monthlyEconomy * 2, 1);
    expect(result2.annualEconomy).toBeCloseTo(result1.annualEconomy * 2, 1);
  });

  it("should calculate production based on consumption", () => {
    const result = calculateEconomy(700);
    
    // 700 / 0.70 = 1000 kWh
    expect(result.monthlyProduction).toBeCloseTo(1000, 1);
  });

  it("should handle small monthly spends", () => {
    const result = calculateEconomy(100);
    
    expect(result.monthlyEconomy).toBe(95); // 100 * 0.95
    expect(result.monthlyProduction).toBeCloseTo(142.86, 1); // 100 / 0.70
    expect(result.paybackYears).toBeGreaterThan(0);
  });

  it("should handle large monthly spends", () => {
    const result = calculateEconomy(2000);
    
    expect(result.monthlyEconomy).toBe(1900); // 2000 * 0.95
    expect(result.annualEconomy).toBe(22800); // 1900 * 12
    expect(result.paybackYears).toBeGreaterThan(0);
  });

  it("should calculate realistic payback for typical scenario", () => {
    // Typical Brazilian household: R$ 300-500/month
    const result = calculateEconomy(400);
    
    expect(result.paybackYears).toBeGreaterThan(3);
    expect(result.paybackYears).toBeLessThan(10);
  });

  it("should maintain accuracy with decimal values", () => {
    const result = calculateEconomy(523.50);
    
    expect(result.monthlyEconomy).toBeCloseTo(497.325, 1);
    expect(result.annualEconomy).toBeCloseTo(5967.9, 0);
  });
});
