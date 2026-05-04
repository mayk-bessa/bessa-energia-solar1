import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  TooltipItem,
  LineController,
} from 'chart.js';
import { Card } from '@/components/ui/card';

ChartJS.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface EconomyChartProps {
  monthlyEconomy: number;
  systemSize: number;
}

export default function EconomyChart({ monthlyEconomy, systemSize }: EconomyChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Calcular economia ao longo de 25 anos
    const years = Array.from({ length: 26 }, (_, i) => i);
    const economyData = years.map(year => {
      const monthlyTotal = monthlyEconomy * 12;
      return monthlyTotal * year;
    });

    // Calcular custo de manutenção (1% ao ano após 5 anos)
    const maintenanceCostData = years.map(year => {
      if (year < 5) return 0;
      const investmentPerKw = 3000;
      const investment = systemSize * investmentPerKw;
      return investment * 0.01 * (year - 5);
    });

    // Economia líquida = economia - manutenção
    const netEconomyData = years.map((_, i) => economyData[i] - maintenanceCostData[i]);

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Destruir gráfico anterior se existir
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const options: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: { size: 12, weight: 'bold' },
            padding: 15,
            usePointStyle: true,
          },
        },
        title: {
          display: true,
          text: `Economia ao Longo de 25 Anos - Sistema ${systemSize}kW`,
          font: { size: 16, weight: 'bold' },
          padding: 20,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: { size: 13, weight: 'bold' },
          bodyFont: { size: 12 },
          callbacks: {
            label: (context: TooltipItem<'line'>) => {
              const value = context.parsed.y ?? 0;
              return `${context.dataset.label}: R$ ${value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value: string | number) => {
              if (typeof value === 'number') {
                return `R$ ${(value / 1000).toFixed(0)}k`;
              }
              return value;
            },
            font: { size: 11 },
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
          },
        },
        x: {
          ticks: {
            font: { size: 11 },
          },
          grid: {
            display: false,
          },
        },
      },
    };

    chartInstance.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: years.map(y => `Ano ${y}`),
        datasets: [
          {
            label: 'Economia Acumulada (R$)',
            data: economyData,
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#22c55e',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 6,
          },
          {
            label: 'Economia Líquida (com manutenção)',
            data: netEconomyData,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 5,
          },
        ],
      },
      options,
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [monthlyEconomy, systemSize]);

  return (
    <Card className="p-6 bg-white rounded-lg shadow-md max-h-[600px] overflow-y-auto">
      <canvas ref={chartRef} height={100} />
    </Card>
  );
}
