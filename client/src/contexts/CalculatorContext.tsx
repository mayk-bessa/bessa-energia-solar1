import React, { createContext, useContext, useState, useEffect } from 'react';

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

const STORAGE_KEY = 'bessa-calculator-params';

const DEFAULT_PARAMS: CalculatorParams = {
  monthlySpend: 500,
  economyRate: 0.95,
  kwhCost: 0.70,
};

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [params, setParamsState] = useState<CalculatorParams>(DEFAULT_PARAMS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Carregar parâmetros do localStorage na montagem
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setParamsState(parsed);
      }
    } catch (error) {
      console.error('[CalculatorContext] Erro ao carregar localStorage:', error);
    }
    setIsHydrated(true);
  }, []);

  // Salvar parâmetros no localStorage quando mudam
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
        // Disparar evento customizado para sincronizar entre abas
        window.dispatchEvent(new CustomEvent('calculator-params-changed', { detail: params }));
      } catch (error) {
        console.error('[CalculatorContext] Erro ao salvar localStorage:', error);
      }
    }
  }, [params, isHydrated]);

  // Sincronizar com outras abas/janelas
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          setParamsState(parsed);
        } catch (error) {
          console.error('[CalculatorContext] Erro ao sincronizar:', error);
        }
      }
    };

    const handleCustomEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      setParamsState(customEvent.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('calculator-params-changed', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('calculator-params-changed', handleCustomEvent);
    };
  }, []);

  const setParams = (newParams: CalculatorParams) => {
    setParamsState(newParams);
  };

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
