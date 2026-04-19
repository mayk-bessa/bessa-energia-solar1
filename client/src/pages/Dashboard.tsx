import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import EconomyChart from '@/components/EconomyChart';
import ROIChart from '@/components/ROIChart';
import PaybackChart from '@/components/PaybackChart';
import { ArrowLeft } from 'lucide-react';

export default function Dashboard() {
  const [selectedScenario, setSelectedScenario] = useState(5);
  
  // Valores padrão para demonstração
  const monthlyEconomy = selectedScenario * 120 * 0.70 * 0.95;
  const paybackYears = (selectedScenario * 3000) / (monthlyEconomy * 12);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4 flex items-center gap-2">
              <ArrowLeft size={18} />
              Voltar
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Dashboard de Análise Solar
          </h1>
          <p className="text-lg text-slate-600">
            Visualize a economia e o retorno sobre investimento ao longo de 25 anos
          </p>
        </div>

        {/* Scenario Selector */}
        <Card className="p-6 bg-white rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Selecione um Cenário</h2>
          <div className="flex gap-4 flex-wrap">
            {[3, 5, 10].map(size => (
              <Button
                key={size}
                onClick={() => setSelectedScenario(size)}
                className={`px-6 py-3 font-semibold rounded-lg transition-all ${
                  selectedScenario === size
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                }`}
              >
                Sistema {size}kW
              </Button>
            ))}
          </div>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md">
            <h3 className="text-sm font-semibold text-green-900 mb-2">Economia Mensal</h3>
            <p className="text-3xl font-bold text-green-600">
              R$ {monthlyEconomy.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-green-700 mt-2">
              Economia anual: R$ {(monthlyEconomy * 12).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Investimento Estimado</h3>
            <p className="text-3xl font-bold text-blue-600">
              R$ {(selectedScenario * 3000).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-blue-700 mt-2">
              Por kW: R$ 3.000
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg shadow-md">
            <h3 className="text-sm font-semibold text-amber-900 mb-2">Tempo de Retorno</h3>
            <p className="text-3xl font-bold text-amber-600">
              {Math.floor(paybackYears)}a {Math.round((paybackYears - Math.floor(paybackYears)) * 12)}m
            </p>
            <p className="text-xs text-amber-700 mt-2">
              Payback: {paybackYears.toFixed(2)} anos
            </p>
          </Card>
        </div>

        {/* Charts */}
        <div className="space-y-8">
          <EconomyChart monthlyEconomy={monthlyEconomy} systemSize={selectedScenario} />
          <ROIChart monthlyEconomy={monthlyEconomy} systemSize={selectedScenario} />
          <PaybackChart paybackYears={paybackYears} systemSize={selectedScenario} />
        </div>

        {/* Info Section */}
        <Card className="p-6 bg-blue-50 border border-blue-200 rounded-lg mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Sobre os Gráficos</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>
              <strong>Economia Acumulada:</strong> Mostra quanto você economiza em reais ao longo de 25 anos
            </li>
            <li>
              <strong>Economia Líquida:</strong> Desconta custos de manutenção (1% ao ano após 5 anos)
            </li>
            <li>
              <strong>ROI:</strong> Retorno sobre investimento em percentual - quando atinge 0%, você recupera o investimento
            </li>
            <li>
              <strong>Payback:</strong> Tempo necessário para recuperar o investimento inicial
            </li>
          </ul>
        </Card>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link href="/calculadora-avancada">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
              Usar Calculadora Avançada
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
