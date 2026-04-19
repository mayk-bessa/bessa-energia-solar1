import React, { createContext, useContext, useState } from 'react';

export interface CalculatorParams {
  monthlySpend: number;
  economyRate: number;
  kwhCost: number;
}

interface CalculatorContextType {
  params: CalculatorParams;
  setParams: (params: CalculatorParams) => void;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [params, setParams] = useState<CalculatorParams>({
    monthlySpend: 500,
    economyRate: 0.95,
    kwhCost: 0.70,
  });

  return (
    <CalculatorContext.Provider value={{ params, setParams }}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculatorParams() {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculatorParams deve ser usado dentro de CalculatorProvider');
  }
  return context;
}
