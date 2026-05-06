import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft, Share2, Instagram, Facebook } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useCalculatorParams } from '@/contexts/CalculatorContext';
import { Link } from 'wouter';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface ScenarioResult {
  systemSize: number;
  monthlyProduction: number;
  monthlyEconomy: number;
  annualEconomy: number;
  paybackYears: number;
  investmentEstimate: number;
}

export default function AdvancedCalculator() {
  const { params, setParams } = useCalculatorParams();
  const [monthlySpend, setMonthlySpend] = useState(params.monthlySpend);
  const [economyRate, setEconomyRate] = useState(params.economyRate);
  const [kwhCost, setKwhCost] = useState(params.kwhCost);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Formata o telefone enquanto o usuário digita
  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 11);
    if (limited.length === 0) return '';
    if (limited.length <= 2) return `(${limited}`;
    if (limited.length <= 7) return `(${limited.slice(0, 2)})${limited.slice(2)}`;
    return `(${limited.slice(0, 2)})${limited.slice(2, 7)}-${limited.slice(7)}`;
  };

  // Valida o formato do telefone
  const isValidPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 11;
  };
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  const generateReportMutation = trpc.budget.generateReport.useMutation();

  // Sincronizar parâmetros com o contexto em tempo real
  useEffect(() => {
    setParams({
      monthlySpend,
      economyRate,
      kwhCost,
    });
  }, [monthlySpend, economyRate, kwhCost, setParams]);

  // Cenários predefiníos: 3kW, 5kW, 10kW
  const scenarios = [3, 5, 10];

  const calculateScenario = (systemSizeKw: number): ScenarioResult => {
    // Produção mensal: 1 kW produz ~120 kWh/mês
    const monthlyProduction = systemSizeKw * 120;

    // Economia mensal: baseada no consumo estimado e custo do kWh
    // Economia = kWh produzidos * custo do kWh * taxa de economia
    const monthlyEconomy = monthlyProduction * (kwhCost || params.kwhCost) * (economyRate || params.economyRate);

    // Investimento médio: ~R$ 3.000 por kW
    const investmentPerKw = 3000;
    const investmentEstimate = systemSizeKw * investmentPerKw;

    // Payback: tempo para recuperar o investimento
    // Evitar divisão por zero
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

  const handleExportScenario = async (scenario: ScenarioResult) => {
    // Validar telefone se preenchido
    if (clientPhone && !isValidPhone(clientPhone)) {
      setPhoneError('Telefone deve ter formato (99) 999999-9999');
      return;
    }

    setIsExporting(true);
    try {
      const response = await generateReportMutation.mutateAsync({
        monthlySpend,
        monthlyEconomy: scenario.monthlyEconomy,
        annualEconomy: scenario.annualEconomy,
        monthlyProduction: scenario.monthlyProduction,
        annualProduction: scenario.monthlyProduction * 12,
        paybackYears: scenario.paybackYears,
        systemSize: `${scenario.systemSize} kW`,
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

        setTimeout(() => setExportMessage(''), 3000);
      }
    } catch (error) {
      setExportMessage('Erro ao gerar relatório. Tente novamente.');
      setTimeout(() => setExportMessage(''), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareOnInstagram = (scenario: ScenarioResult) => {
    const text = `Confira meu resultado na Calculadora de Energia Solar da @bessa.energia! 🌞\n\nSistema ${scenario.systemSize}kW:\n• Economia Mensal: R$ ${scenario.monthlyEconomy.toFixed(2)}\n• Economia Anual: R$ ${scenario.annualEconomy.toFixed(2)}\n• Tempo de Retorno: ${scenario.paybackYears.toFixed(1)} anos\n\nVocê também pode economizar! Acesse: bessa-solar-3wees8ow.manus.space`;
    
    navigator.clipboard.writeText(text).then(() => {
      setExportMessage('✓ Texto copiado! Abra o Instagram para compartilhar.');
      setTimeout(() => setExportMessage(''), 3000);
      window.open('https://www.instagram.com/bessa.energia/', '_blank');
    }).catch(() => {
      setExportMessage('Erro ao copiar. Abra o Instagram manualmente.');
      setTimeout(() => setExportMessage(''), 3000);
      window.open('https://www.instagram.com/bessa.energia/', '_blank');
    });
  };

  const handleShareOnFacebook = (scenario: ScenarioResult) => {
    const text = `Confira meu resultado na Calculadora de Energia Solar da Bessa Energia! ☀️\n\nSistema ${scenario.systemSize}kW:\n• Economia Mensal: R$ ${scenario.monthlyEconomy.toFixed(2)}\n• Economia Anual: R$ ${scenario.annualEconomy.toFixed(2)}\n• Tempo de Retorno: ${scenario.paybackYears.toFixed(1)} anos\n\nVocê também pode economizar! Acesse: bessa-solar-3wees8ow.manus.space`;
    
    try {
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://bessa-solar-3wees8ow.manus.space')}&quote=${encodeURIComponent(text)}`;
      window.open(fbUrl, '_blank', 'width=600,height=400');
      setExportMessage('✓ Abrindo Facebook para compartilhamento...');
      setTimeout(() => setExportMessage(''), 3000);
    } catch (error) {
      setExportMessage('Erro ao abrir Facebook. Tente novamente.');
      setTimeout(() => setExportMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={18} />
              Voltar
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Calculadora Avançada de Energia Solar
          </h1>
          <p className="text-lg text-slate-600">
            Ajuste os parâmetros e compare diferentes cenários de investimento
          </p>
        </div>

        {/* Controls Section */}
        <Card className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Parâmetros de Cálculo</h2>

          {/* Monthly Spend Slider */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <label className="block text-sm font-semibold text-slate-700">
                Gasto Mensal com Energia: R$ {monthlySpend.toFixed(2)}
              </label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-orange-500 rounded-full cursor-help">
                    ?
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  Insira o valor da sua conta de energia mensal. Este valor é usado para calcular quanto você economizará com o sistema solar.
                </TooltipContent>
              </Tooltip>
            </div>
            <input
              type="range"
              min="100"
              max="5000"
              step="50"
              value={monthlySpend}
              onChange={(e) => setMonthlySpend(parseFloat(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>R$ 100</span>
              <span>R$ 5.000</span>
            </div>
          </div>

          {/* Economy Rate Slider */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <label className="block text-sm font-semibold text-slate-700">
                Taxa de Economia: {(economyRate * 100).toFixed(0)}%
              </label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-orange-500 rounded-full cursor-help">
                    ?
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  Percentual de sua conta que será coberta pela energia solar. Varia de 70% a 95% dependendo da localização e consumo.
                </TooltipContent>
              </Tooltip>
            </div>
            <input
              type="range"
              min="0.70"
              max="0.95"
              step="0.01"
              value={economyRate}
              onChange={(e) => setEconomyRate(parseFloat(e.target.value))}
              className="w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>70%</span>
              <span>95%</span>
            </div>
          </div>

          {/* kWh Cost Slider */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <label className="block text-sm font-semibold text-slate-700">
                Custo do kWh: R$ {kwhCost.toFixed(2)}
              </label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-orange-500 rounded-full cursor-help">
                    ?
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  Valor que você paga por cada kWh de energia. Verifique sua conta de luz para o valor exato da sua região.
                </TooltipContent>
              </Tooltip>
            </div>
            <input
              type="range"
              min="0.50"
              max="1.50"
              step="0.05"
              value={kwhCost}
              onChange={(e) => setKwhCost(parseFloat(e.target.value))}
              className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>R$ 0,50</span>
              <span>R$ 1,50</span>
            </div>
          </div>

          {/* Client Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Informações do Cliente (Opcional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-sm font-semibold text-slate-700">Nome</label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-orange-500 rounded-full cursor-help">
                        ?
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      Seu nome completo será incluído no relatório PDF gerado.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-sm font-semibold text-slate-700">Email</label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-orange-500 rounded-full cursor-help">
                        ?
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      Seu email será usado para enviar o relatório PDF automaticamente.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-sm font-semibold text-slate-700">Telefone</label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-orange-500 rounded-full cursor-help">
                        ?
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      Seu telefone será incluído no relatório para contato posterior.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <input
                  type="tel"
                  placeholder="(31) 999999-9999"
                  value={clientPhone}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    setClientPhone(formatted);
                    if (phoneError && formatted) {
                      setPhoneError('');
                    }
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    phoneError ? 'border-red-500 bg-red-50' : 'border-slate-300'
                  }`}
                />
                {phoneError && (
                  <p className="text-sm text-red-600 mt-1">{phoneError}</p>
                )}
              </div>
            </div>
          </div>

          {exportMessage && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {exportMessage}
            </div>
          )}
        </Card>

        {/* Scenarios Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scenarios.map((size) => {
            const scenario = calculateScenario(size);
            return (
              <Card key={size} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{scenario.systemSize} kW</h3>
                  <p className="text-orange-100">Sistema Solar Fotovoltaico</p>
                </div>

                <div className="p-6 space-y-4">
                  {/* Monthly Production */}
                  <div>
                    <p className="text-sm text-slate-600">Produção Mensal</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {scenario.monthlyProduction.toFixed(0)} kWh
                    </p>
                  </div>

                  {/* Monthly Economy */}
                  <div>
                    <p className="text-sm text-slate-600">Economia Mensal</p>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {scenario.monthlyEconomy.toFixed(2)}
                    </p>
                  </div>

                  {/* Annual Economy */}
                  <div>
                    <p className="text-sm text-slate-600">Economia Anual</p>
                    <p className="text-xl font-semibold text-green-600">
                      R$ {scenario.annualEconomy.toFixed(2)}
                    </p>
                  </div>

                  {/* Investment Estimate */}
                  <div>
                    <p className="text-sm text-slate-600">Investimento Estimado</p>
                    <p className="text-xl font-semibold text-slate-900">
                      R$ {scenario.investmentEstimate.toFixed(2)}
                    </p>
                  </div>

                  {/* Payback */}
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-slate-600">Tempo de Retorno</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {scenario.paybackYears.toFixed(1)} anos
                    </p>
                  </div>

                  {/* Export Button */}
                  <Button
                    onClick={() => handleExportScenario(scenario)}
                    disabled={isExporting}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download size={18} />
                    {isExporting ? 'Gerando...' : 'Exportar PDF'}
                  </Button>

                  {/* Share Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleShareOnInstagram(scenario)}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Instagram size={16} />
                      Instagram
                    </Button>
                    <Button
                      onClick={() => handleShareOnFacebook(scenario)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Facebook size={16} />
                      Facebook
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Comparison Table */}
        <Card className="bg-white shadow-lg rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Comparativo Detalhado</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Métrica</th>
                  {scenarios.map((size) => (
                    <th key={size} className="text-center py-3 px-4 font-semibold text-slate-700">
                      {size} kW
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    label: 'Produção Mensal',
                    key: 'monthlyProduction',
                    format: (v: number) => `${v.toFixed(0)} kWh`,
                  },
                  {
                    label: 'Economia Mensal',
                    key: 'monthlyEconomy',
                    format: (v: number) => `R$ ${v.toFixed(2)}`,
                  },
                  {
                    label: 'Economia Anual',
                    key: 'annualEconomy',
                    format: (v: number) => `R$ ${v.toFixed(2)}`,
                  },
                  {
                    label: 'Investimento Estimado',
                    key: 'investmentEstimate',
                    format: (v: number) => `R$ ${v.toFixed(2)}`,
                  },
                  {
                    label: 'Tempo de Retorno',
                    key: 'paybackYears',
                    format: (v: number) => `${v.toFixed(1)} anos`,
                  },
                ].map((row) => (
                  <tr key={row.key} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-700">{row.label}</td>
                    {scenarios.map((size) => {
                      const scenario = calculateScenario(size);
                      const value = scenario[row.key as keyof ScenarioResult] as number;
                      return (
                        <td key={size} className="text-center py-3 px-4 text-slate-900">
                          {row.format(value)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Info Section */}
        <Card className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Como Usar</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Ajuste o gasto mensal com energia para ver cenários personalizados</li>
            <li>• Modifique a taxa de economia para refletir diferentes condições de consumo</li>
            <li>• Altere o custo do kWh conforme a tarifa da sua região</li>
            <li>• Compare os três cenários de investimento lado a lado</li>
            <li>• Exporte o relatório em PDF com suas informações de contato</li>
            <li>• Compartilhe seus resultados no Instagram e Facebook</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
