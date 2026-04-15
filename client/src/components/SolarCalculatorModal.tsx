import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SolarCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SolarCalculatorModal({ isOpen, onClose }: SolarCalculatorModalProps) {
  const [monthlySpend, setMonthlySpend] = useState('');
  const [results, setResults] = useState<{
    monthlySpend: number;
    monthlyProduction: number;
    monthlyEconomy: number;
    annualEconomy: number;
    paybackYears: number;
  } | null>(null);

  // Dados baseados em estudos de energia solar no Brasil
  // Média de economia: 95% da conta de luz
  // Custo médio do kWh no Brasil: ~R$ 0,70
  // Produção média de usina solar: 1 kW produz ~120 kWh/mês
  // Investimento médio: ~R$ 3.000 por kW instalado

  const calculateEconomy = () => {
    const spend = parseFloat(monthlySpend);
    
    if (isNaN(spend) || spend <= 0) {
      alert('Por favor, insira um valor válido');
      return;
    }

    // Cálculo baseado em dados reais de economia solar
    // Taxa de economia: 95% (conforme informado no site)
    const economyRate = 0.95;
    const monthlyEconomy = spend * economyRate;
    
    // Custo médio do kWh: R$ 0,70
    const kwhCost = 0.70;
    
    // Consumo estimado em kWh baseado no gasto
    const estimatedKwh = spend / kwhCost;
    
    // Produção mensal: 1 kW produz ~120 kWh/mês
    // Então para o consumo estimado, precisamos de (estimatedKwh / 120) kW
    const requiredKw = estimatedKwh / 120;
    
    // Investimento médio: ~R$ 3.000 por kW
    const investmentPerKw = 3000;
    const totalInvestment = requiredKw * investmentPerKw;
    
    // Payback: tempo para recuperar o investimento
    const paybackMonths = totalInvestment / monthlyEconomy;
    const paybackYears = paybackMonths / 12;

    setResults({
      monthlySpend: spend,
      monthlyProduction: estimatedKwh,
      monthlyEconomy: monthlyEconomy,
      annualEconomy: monthlyEconomy * 12,
      paybackYears: paybackYears,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Calculadora de Economia Solar</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!results ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consumo Mensal de Energia (R$)
                </label>
                <input
                type="number"
                value={monthlySpend}
                onChange={(e) => setMonthlySpend(e.target.value)}
                placeholder="Ex: 500"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Dica:</strong> Insira o valor da sua conta de energia mensal para calcular quanto você pode economizar com energia solar.
                </p>
              </div>

              <Button
                onClick={calculateEconomy}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2"
              >
                Calcular Economia
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Consumo Mensal Atual</p>
                  <p className="text-2xl font-bold text-orange-600">R$ {results.monthlySpend.toFixed(2)}</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Economia Mensal com Solar</p>
                  <p className="text-2xl font-bold text-green-600">R$ {results.monthlyEconomy.toFixed(2)}</p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Economia Anual</p>
                  <p className="text-2xl font-bold text-blue-600">R$ {results.annualEconomy.toFixed(2)}</p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Tempo de Retorno (Payback)</p>
                  <p className="text-2xl font-bold text-purple-600">{results.paybackYears.toFixed(1)} anos</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                  <p className="mb-2">
                    <strong>Produção Mensal Estimada:</strong> {results.monthlyProduction.toFixed(0)} kWh
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    * Cálculos baseados em dados médios de energia solar no Brasil (economia de 95%, custo médio do kWh de R$ 0,70)
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setResults(null);
                    setMonthlySpend('');
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2"
                >
                  Novo Cálculo
                </Button>
                <Button
                  onClick={onClose}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2"
                >
                  Fechar
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
