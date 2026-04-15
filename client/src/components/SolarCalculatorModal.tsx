import { useState } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

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
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  const generateReportMutation = trpc.budget.generateReport.useMutation();

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

  const handleExportPDF = async () => {
    if (!results) return;

    setIsExporting(true);
    try {
      const response = await generateReportMutation.mutateAsync({
        monthlySpend: results.monthlySpend,
        monthlyEconomy: results.monthlyEconomy,
        annualEconomy: results.annualEconomy,
        monthlyProduction: results.monthlyProduction,
        annualProduction: results.monthlyProduction * 12,
        paybackYears: results.paybackYears,
        systemSize: `${(results.monthlyProduction / 120).toFixed(1)} kW`,
        clientName: clientName || undefined,
        clientEmail: clientEmail || undefined,
        clientPhone: clientPhone || undefined,
      });

      if (response.success) {
        // Download PDF
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${response.pdf}`;
        link.download = response.filename;
        link.click();

        if (clientEmail) {
          setExportMessage('✓ Relatório gerado e enviado para seu email!');
        } else {
          setExportMessage('✓ Relatório baixado com sucesso!');
        }
      }
    } catch (error) {
      setExportMessage('Erro ao gerar relatório. Tente novamente.');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
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

              <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold text-gray-900">Exportar Relatório (Opcional)</p>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="email"
                  placeholder="Seu email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="tel"
                  placeholder="Seu telefone"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {exportMessage && (
                  <p className="text-sm text-green-600 bg-green-50 p-2 rounded">{exportMessage}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setResults(null);
                    setMonthlySpend('');
                    setClientName('');
                    setClientEmail('');
                    setClientPhone('');
                    setExportMessage('');
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2"
                >
                  Novo Cálculo
                </Button>
                <Button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {isExporting ? 'Gerando...' : 'Exportar PDF'}
                </Button>
              </div>

              <Button
                onClick={onClose}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2"
              >
                Fechar
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
