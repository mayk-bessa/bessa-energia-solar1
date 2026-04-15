import { describe, it, expect } from "vitest";

// Test calculation logic for scenarios
describe("AdvancedCalculator calculations", () => {
  const calculateScenario = (systemSizeKw: number, monthlySpend: number, economyRate: number, kwhCost: number = 0.70) => {
    const monthlyProduction = systemSizeKw * 120;
    // Economia = kWh produzidos * custo do kWh * taxa de economia
    const monthlyEconomy = monthlyProduction * kwhCost * economyRate;
    const investmentPerKw = 3000;
    const investmentEstimate = systemSizeKw * investmentPerKw;
    const paybackMonths = monthlyEconomy > 0 ? investmentEstimate / monthlyEconomy : 0;
    const paybackYears = paybackMonths / 12;

    return {
      systemSize: systemSizeKw,
      monthlyProduction,
      monthlyEconomy,
      annualEconomy: monthlyEconomy * 12,
      paybackYears,
      investmentEstimate,
    };
  };

  it("should calculate 3kW scenario correctly", () => {
    const result = calculateScenario(3, 500, 0.95, 0.70);

    expect(result.systemSize).toBe(3);
    expect(result.monthlyProduction).toBe(360); // 3 * 120
    expect(result.monthlyEconomy).toBeCloseTo(239.4, 0); // 360 * 0.70 * 0.95
    expect(result.annualEconomy).toBeCloseTo(2872.8, 0); // 239.4 * 12
    expect(result.investmentEstimate).toBe(9000); // 3 * 3000
    expect(result.paybackYears).toBeCloseTo(3.13, 1); // 9000 / 239.4 / 12
  });

  it("should calculate 5kW scenario correctly", () => {
    const result = calculateScenario(5, 500, 0.95, 0.70);

    expect(result.systemSize).toBe(5);
    expect(result.monthlyProduction).toBe(600); // 5 * 120
    expect(result.monthlyEconomy).toBeCloseTo(399, 0); // 600 * 0.70 * 0.95
    expect(result.annualEconomy).toBeCloseTo(4788, 0); // 399 * 12
    expect(result.investmentEstimate).toBe(15000); // 5 * 3000
    expect(result.paybackYears).toBeCloseTo(3.13, 1); // 15000 / 399 / 12
  });

  it("should calculate 10kW scenario correctly", () => {
    const result = calculateScenario(10, 500, 0.95, 0.70);

    expect(result.systemSize).toBe(10);
    expect(result.monthlyProduction).toBe(1200); // 10 * 120
    expect(result.monthlyEconomy).toBeCloseTo(798, 0); // 1200 * 0.70 * 0.95
    expect(result.annualEconomy).toBeCloseTo(9576, 0); // 798 * 12
    expect(result.investmentEstimate).toBe(30000); // 10 * 3000
    expect(result.paybackYears).toBeCloseTo(3.13, 1); // 30000 / 798 / 12
  });

  it("should handle different economy rates", () => {
    const result70 = calculateScenario(5, 500, 0.70, 0.70);
    const result95 = calculateScenario(5, 500, 0.95, 0.70);

    expect(result70.monthlyEconomy).toBeCloseTo(294, 0); // 600 * 0.70 * 0.70
    expect(result95.monthlyEconomy).toBeCloseTo(399, 0); // 600 * 0.70 * 0.95
    expect(result70.paybackYears).toBeGreaterThan(result95.paybackYears);
  });

  it("should handle different kWh costs", () => {
    const result050 = calculateScenario(5, 500, 0.95, 0.50);
    const result150 = calculateScenario(5, 500, 0.95, 1.50);

    expect(result050.monthlyEconomy).toBeCloseTo(285, 0); // 600 * 0.50 * 0.95
    expect(result150.monthlyEconomy).toBeCloseTo(855, 0); // 600 * 1.50 * 0.95
    expect(result150.paybackYears).toBeLessThan(result050.paybackYears);
  });

  it("should calculate payback years correctly", () => {
    const result = calculateScenario(5, 1000, 0.95, 0.70);

    // Investment: 15000, Monthly Economy: 600 * 0.70 * 0.95 = 399
    // Payback months: 15000 / 399 = 37.59
    // Payback years: 37.59 / 12 = 3.13
    expect(result.paybackYears).toBeCloseTo(3.13, 0);
  });

  it("should handle edge case with low kWh cost", () => {
    const result = calculateScenario(3, 100, 0.95, 0.50);

    expect(result.monthlyEconomy).toBeCloseTo(171, 0); // 360 * 0.50 * 0.95
    expect(result.investmentEstimate).toBe(9000); // 3 * 3000
    expect(result.paybackYears).toBeCloseTo(4.39, 0); // 9000 / 171 / 12
  });

  it("should handle edge case with high kWh cost", () => {
    const result = calculateScenario(10, 5000, 0.95, 1.50);

    expect(result.monthlyEconomy).toBeCloseTo(1710, 0); // 1200 * 1.50 * 0.95
    expect(result.investmentEstimate).toBe(30000); // 10 * 3000
    expect(result.paybackYears).toBeCloseTo(1.47, 0); // 30000 / 1710 / 12
  });

  it("should maintain consistent production calculation", () => {
    const scenarios = [3, 5, 10];
    const expectedProduction = [360, 600, 1200];

    scenarios.forEach((size, index) => {
      const result = calculateScenario(size, 500, 0.95, 0.70);
      expect(result.monthlyProduction).toBe(expectedProduction[index]);
    });
  });

  it("should maintain consistent investment calculation", () => {
    const scenarios = [3, 5, 10];
    const expectedInvestment = [9000, 15000, 30000];

    scenarios.forEach((size, index) => {
      const result = calculateScenario(size, 500, 0.95, 0.70);
      expect(result.investmentEstimate).toBe(expectedInvestment[index]);
    });
  });
});
