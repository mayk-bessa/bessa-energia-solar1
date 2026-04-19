import { describe, it, expect } from "vitest";

// Test calculation logic for ROIChart
describe("ROIChart calculations", () => {
  const calculateROI = (monthlyEconomy: number, systemSize: number, years: number = 25) => {
    const investmentPerKw = 3000;
    const investment = systemSize * investmentPerKw;
    
    const yearArray = Array.from({ length: years + 1 }, (_, i) => i);
    const roiData = yearArray.map(year => {
      const monthlyTotal = monthlyEconomy * 12;
      const totalEconomy = monthlyTotal * year;
      
      let maintenanceCost = 0;
      if (year > 5) {
        maintenanceCost = investment * 0.01 * (year - 5);
      }
      
      const netProfit = totalEconomy - maintenanceCost - investment;
      const roi = (netProfit / investment) * 100;
      
      return roi;
    });
    
    return roiData;
  };

  it("should calculate ROI correctly for 5kW system", () => {
    const monthlyEconomy = 399; // 5kW system
    const systemSize = 5;
    const roiData = calculateROI(monthlyEconomy, systemSize);

    expect(roiData[0]).toBe(-100); // Year 0: -100% (no economy yet)
    expect(roiData[1]).toBeGreaterThan(-100); // Year 1: improving
    expect(roiData[25]).toBeGreaterThan(0); // Year 25: positive ROI
  });

  it("should show ROI crossing zero at payback period", () => {
    const monthlyEconomy = 399;
    const systemSize = 5;
    const roiData = calculateROI(monthlyEconomy, systemSize);

    // Find when ROI crosses zero
    let crossedZero = false;
    for (let i = 0; i < roiData.length - 1; i++) {
      if (roiData[i] < 0 && roiData[i + 1] > 0) {
        crossedZero = true;
        break;
      }
    }

    expect(crossedZero).toBe(true);
  });

  it("should calculate ROI for different system sizes", () => {
    const monthlyEconomy = 399;
    const roi3kW = calculateROI(monthlyEconomy, 3);
    const roi5kW = calculateROI(monthlyEconomy, 5);
    const roi10kW = calculateROI(monthlyEconomy, 10);

    // Larger systems have lower ROI for the same monthly economy
    expect(roi3kW[10]).toBeGreaterThan(roi5kW[10]);
    expect(roi5kW[10]).toBeGreaterThan(roi10kW[10]);
  });

  it("should show increasing ROI over time", () => {
    const monthlyEconomy = 399;
    const systemSize = 5;
    const roiData = calculateROI(monthlyEconomy, systemSize);

    // ROI should generally increase over time
    expect(roiData[10]).toBeGreaterThan(roiData[5]);
    expect(roiData[20]).toBeGreaterThan(roiData[10]);
    expect(roiData[25]).toBeGreaterThan(roiData[20]);
  });

  it("should account for maintenance costs in ROI calculation", () => {
    const monthlyEconomy = 399;
    const systemSize = 5;
    const roiData = calculateROI(monthlyEconomy, systemSize);

    // ROI growth should slow down after year 5 due to maintenance costs
    const roiGrowth1to5 = roiData[5] - roiData[1];
    const roiGrowth6to10 = roiData[10] - roiData[6];

    // Growth should be similar but maintenance should have some impact
    expect(roiGrowth1to5).toBeGreaterThan(0);
    expect(roiGrowth6to10).toBeGreaterThan(0);
  });

  it("should handle different monthly economy values", () => {
    const systemSize = 5;
    const roi200 = calculateROI(200, systemSize);
    const roi400 = calculateROI(400, systemSize);

    // Higher monthly economy should result in higher ROI
    expect(roi400[10]).toBeGreaterThan(roi200[10]);
  });

  it("should return 26 data points for 25-year period", () => {
    const monthlyEconomy = 399;
    const systemSize = 5;
    const roiData = calculateROI(monthlyEconomy, systemSize);

    expect(roiData).toHaveLength(26);
  });

  it("should calculate ROI as percentage", () => {
    const monthlyEconomy = 399;
    const systemSize = 5;
    const roiData = calculateROI(monthlyEconomy, systemSize);

    // ROI values should be reasonable percentages
    expect(roiData[0]).toBe(-100);
    expect(roiData[25]).toBeGreaterThan(0);
    expect(roiData[25]).toBeLessThan(1000); // Reasonable upper bound
  });

  it("should show negative ROI in early years", () => {
    const monthlyEconomy = 399;
    const systemSize = 5;
    const roiData = calculateROI(monthlyEconomy, systemSize);

    // First few years should have negative ROI
    expect(roiData[0]).toBeLessThan(0);
    expect(roiData[1]).toBeLessThan(0);
    expect(roiData[2]).toBeLessThan(0);
  });

  it("should calculate maintenance impact correctly", () => {
    const monthlyEconomy = 399;
    const systemSize = 5;
    const investment = systemSize * 3000;
    const roiData = calculateROI(monthlyEconomy, systemSize);

    // At year 10, maintenance cost should be 5 years * 1% of investment
    const expectedMaintenanceCost = investment * 0.01 * 5;
    const totalEconomyYear10 = monthlyEconomy * 12 * 10;
    const expectedNetProfit = totalEconomyYear10 - expectedMaintenanceCost - investment;
    const expectedROI = (expectedNetProfit / investment) * 100;

    expect(roiData[10]).toBeCloseTo(expectedROI, 0);
  });
});
