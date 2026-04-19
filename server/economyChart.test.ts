import { describe, it, expect } from "vitest";

// Test calculation logic for EconomyChart
describe("EconomyChart calculations", () => {
  const calculateEconomyData = (monthlyEconomy: number, years: number = 25) => {
    const yearArray = Array.from({ length: years + 1 }, (_, i) => i);
    const economyData = yearArray.map(year => {
      const monthlyTotal = monthlyEconomy * 12;
      return monthlyTotal * year;
    });
    return economyData;
  };

  const calculateMaintenanceCost = (systemSize: number, years: number = 25) => {
    const investmentPerKw = 3000;
    const investment = systemSize * investmentPerKw;
    const yearArray = Array.from({ length: years + 1 }, (_, i) => i);
    
    const maintenanceCostData = yearArray.map(year => {
      if (year < 5) return 0;
      return investment * 0.01 * (year - 5);
    });
    return maintenanceCostData;
  };

  const calculateNetEconomy = (economyData: number[], maintenanceCostData: number[]) => {
    return economyData.map((_, i) => economyData[i] - maintenanceCostData[i]);
  };

  it("should calculate 25-year economy data correctly", () => {
    const monthlyEconomy = 399; // 5kW system at 0.70 kWh cost
    const economyData = calculateEconomyData(monthlyEconomy);

    expect(economyData.length).toBe(26); // 0 to 25 years
    expect(economyData[0]).toBe(0); // Year 0
    expect(economyData[1]).toBe(monthlyEconomy * 12); // Year 1
    expect(economyData[25]).toBe(monthlyEconomy * 12 * 25); // Year 25
  });

  it("should calculate maintenance costs correctly", () => {
    const systemSize = 5;
    const maintenanceCostData = calculateMaintenanceCost(systemSize);

    expect(maintenanceCostData[0]).toBe(0); // Year 0
    expect(maintenanceCostData[4]).toBe(0); // Year 4 (before maintenance starts)
    expect(maintenanceCostData[5]).toBe(0); // Year 5 (maintenance starts at year 6)
    expect(maintenanceCostData[6]).toBe(15000 * 0.01); // Year 6: 1% of 15000
    expect(maintenanceCostData[10]).toBe(15000 * 0.01 * 5); // Year 10: 5 years of maintenance
  });

  it("should calculate net economy correctly", () => {
    const monthlyEconomy = 399;
    const systemSize = 5;
    const economyData = calculateEconomyData(monthlyEconomy);
    const maintenanceCostData = calculateMaintenanceCost(systemSize);
    const netEconomyData = calculateNetEconomy(economyData, maintenanceCostData);

    expect(netEconomyData[0]).toBe(0);
    expect(netEconomyData[5]).toBe(economyData[5]); // No maintenance yet
    expect(netEconomyData[10]).toBe(economyData[10] - maintenanceCostData[10]);
  });

  it("should handle different system sizes", () => {
    const monthlyEconomy = 399;
    const maintenanceCost3kW = calculateMaintenanceCost(3);
    const maintenanceCost5kW = calculateMaintenanceCost(5);
    const maintenanceCost10kW = calculateMaintenanceCost(10);

    expect(maintenanceCost3kW[10]).toBe(9000 * 0.01 * 5);
    expect(maintenanceCost5kW[10]).toBe(15000 * 0.01 * 5);
    expect(maintenanceCost10kW[10]).toBe(30000 * 0.01 * 5);
  });

  it("should show positive net economy after payback period", () => {
    const monthlyEconomy = 399; // 5kW system
    const systemSize = 5;
    const economyData = calculateEconomyData(monthlyEconomy);
    const maintenanceCostData = calculateMaintenanceCost(systemSize);
    const netEconomyData = calculateNetEconomy(economyData, maintenanceCostData);

    // After 25 years, net economy should be positive
    expect(netEconomyData[25]).toBeGreaterThan(0);
  });

  it("should calculate annual totals correctly", () => {
    const monthlyEconomy = 399;
    const annualEconomy = monthlyEconomy * 12;
    const economyData = calculateEconomyData(monthlyEconomy);

    expect(economyData[1]).toBe(annualEconomy);
    expect(economyData[5]).toBe(annualEconomy * 5);
    expect(economyData[10]).toBe(annualEconomy * 10);
  });

  it("should handle edge case with zero monthly economy", () => {
    const monthlyEconomy = 0;
    const economyData = calculateEconomyData(monthlyEconomy);

    expect(economyData[0]).toBe(0);
    expect(economyData[25]).toBe(0);
  });

  it("should handle different monthly economy values", () => {
    const economyData100 = calculateEconomyData(100);
    const economyData500 = calculateEconomyData(500);

    expect(economyData500[10]).toBe(economyData100[10] * 5);
  });

  it("should maintain 26 data points for 25-year period", () => {
    const monthlyEconomy = 399;
    const economyData = calculateEconomyData(monthlyEconomy, 25);

    expect(economyData).toHaveLength(26);
    expect(economyData[0]).toBe(0);
    expect(economyData[economyData.length - 1]).toBe(monthlyEconomy * 12 * 25);
  });
});
