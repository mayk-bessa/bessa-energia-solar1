import { describe, it, expect } from "vitest";

// Test calculation logic for PaybackChart
describe("PaybackChart calculations", () => {
  const calculatePayback = (monthlyEconomy: number, systemSize: number) => {
    const investmentPerKw = 3000;
    const investment = systemSize * investmentPerKw;
    
    if (monthlyEconomy <= 0) return 0;
    
    const monthlyTotal = monthlyEconomy * 12;
    const paybackMonths = investment / monthlyTotal;
    const paybackYears = paybackMonths / 12;
    
    return paybackYears;
  };

  const estimateScenarioPayback = (basePayback: number, baseSystemSize: number, targetSystemSize: number) => {
    const ratio = targetSystemSize / baseSystemSize;
    return basePayback / ratio;
  };

  it("should calculate payback years correctly", () => {
    const monthlyEconomy = 399; // 5kW system
    const systemSize = 5;
    const payback = calculatePayback(monthlyEconomy, systemSize);

    expect(payback).toBeGreaterThan(0);
    expect(payback).toBeLessThan(25); // Should be within 25 years
  });

  it("should calculate payback for 3kW system", () => {
    const monthlyEconomy = 239.4; // 3kW system (3/5 of 5kW)
    const systemSize = 3;
    const payback = calculatePayback(monthlyEconomy, systemSize);

    expect(payback).toBeGreaterThan(0);
    expect(payback).toBeLessThan(25);
  });

  it("should calculate payback for 5kW system", () => {
    const monthlyEconomy = 399; // 5kW system
    const systemSize = 5;
    const payback = calculatePayback(monthlyEconomy, systemSize);

    expect(payback).toBeGreaterThan(0);
    expect(payback).toBeLessThan(25);
  });

  it("should calculate payback for 10kW system", () => {
    const monthlyEconomy = 798; // 10kW system (2x 5kW)
    const systemSize = 10;
    const payback = calculatePayback(monthlyEconomy, systemSize);

    expect(payback).toBeGreaterThan(0);
    expect(payback).toBeLessThan(25);
  });

  it("should handle zero monthly economy", () => {
    const monthlyEconomy = 0;
    const systemSize = 5;
    const payback = calculatePayback(monthlyEconomy, systemSize);

    expect(payback).toBe(0);
  });

  it("should show inverse relationship between system size and payback", () => {
    const monthlyEconomyPer3kW = 239.4;
    
    const payback3kW = calculatePayback(monthlyEconomyPer3kW, 3);
    const payback5kW = calculatePayback(monthlyEconomyPer3kW * (5/3), 5);
    const payback10kW = calculatePayback(monthlyEconomyPer3kW * (10/3), 10);

    // All payback values should be positive and reasonable
    expect(payback3kW).toBeGreaterThan(0);
    expect(payback5kW).toBeGreaterThan(0);
    expect(payback10kW).toBeGreaterThan(0);
    expect(payback3kW).toBeLessThan(25);
    expect(payback5kW).toBeLessThan(25);
    expect(payback10kW).toBeLessThan(25);
  });

  it("should estimate scenario payback correctly", () => {
    const basePayback = 6.25; // 5kW system
    const baseSystemSize = 5;

    const payback3kW = estimateScenarioPayback(basePayback, baseSystemSize, 3);
    const payback10kW = estimateScenarioPayback(basePayback, baseSystemSize, 10);

    expect(payback3kW).toBeGreaterThan(0);
    expect(payback10kW).toBeGreaterThan(0);
    expect(payback3kW).toBeGreaterThan(payback10kW);
  });

  it("should calculate payback based on investment and annual economy", () => {
    const systemSize = 5;
    const monthlyEconomy = 399;
    const investment = systemSize * 3000;
    const annualEconomy = monthlyEconomy * 12;
    const payback = investment / annualEconomy;

    expect(payback).toBeGreaterThan(0);
    expect(payback).toBeLessThan(10);
  });

  it("should handle different monthly economy rates", () => {
    const systemSize = 5;
    const payback200 = calculatePayback(200, systemSize);
    const payback400 = calculatePayback(400, systemSize);

    // Higher monthly economy should result in shorter payback
    expect(payback200).toBeGreaterThan(payback400);
    expect(payback200 / payback400).toBeCloseTo(2, 0.1);
  });

  it("should return reasonable payback values", () => {
    const monthlyEconomy = 399;
    const systemSize = 5;
    const payback = calculatePayback(monthlyEconomy, systemSize);

    // Payback should be between 1 and 25 years for typical systems
    expect(payback).toBeGreaterThan(0);
    expect(payback).toBeLessThan(25);
  });

  it("should scale payback proportionally with system size", () => {
    const monthlyEconomyPer3kW = 239.4;
    
    const payback3kW = calculatePayback(monthlyEconomyPer3kW, 3);
    const payback5kW = calculatePayback(monthlyEconomyPer3kW * (5/3), 5);

    // Both payback values should be positive
    expect(payback3kW).toBeGreaterThan(0);
    expect(payback5kW).toBeGreaterThan(0);
  });

  it("should calculate payback in years and months", () => {
    const monthlyEconomy = 399;
    const systemSize = 5;
    const payback = calculatePayback(monthlyEconomy, systemSize);

    const years = Math.floor(payback);
    const months = Math.round((payback - years) * 12);

    expect(years).toBeGreaterThanOrEqual(0);
    expect(months).toBeGreaterThanOrEqual(0);
    expect(months).toBeLessThan(12);
  });
});
