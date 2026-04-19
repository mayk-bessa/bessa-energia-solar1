import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  TooltipItem,
  BarController,
} from 'chart.js';
import { Card } from '@/components/ui/card';

ChartJS.register(BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface PaybackChartProps {
  paybackYears: number;
  systemSize: number;
}

export default function PaybackChart({ paybackYears, systemSize }: PaybackChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Destruir gráfico anterior se existir
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const scenarios = ['3kW', '5kW', '10kW'];
    const paybackData = scenarios.map((_, index) => {
      // Estimar payback para cada cenário baseado no tamanho
      const sizes = [3, 5, 10];
      const ratio = sizes[index] / systemSize;
      return paybackYears / ratio;
    });

    const options: ChartOptions<'bar'> = {
      responsive: true,
      maintainAspectRatio: true,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Tempo de Retorno do Investimento (Payback)',
          font: { size: 16, weight: 'bold' },
          padding: 20,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: { size: 13, weight: 'bold' },
          bodyFont: { size: 12 },
          callbacks: {
            label: (context: TooltipItem<'bar'>) => {
              const value = context.parsed.x ?? 0;
              const years = Math.floor(value);
              const months = Math.round((value - years) * 12);
              return `Payback: ${years} anos e ${months} meses`;
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: (value: string | number) => {
              if (typeof value === 'number') {
                return `${value.toFixed(1)} anos`;
              }
              return value;
            },
            font: { size: 11 },
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
          },
        },
        y: {
          ticks: {
            font: { size: 12, weight: 'bold' },
          },
          grid: {
            display: false,
          },
        },
      },
    };

    chartInstance.current = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: scenarios,
        datasets: [
          {
            label: 'Tempo de Retorno (anos)',
            data: paybackData,
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(245, 158, 11, 0.8)',
            ],
            borderColor: [
              '#22c55e',
              '#3b82f6',
              '#f59e0b',
            ],
            borderWidth: 2,
            borderRadius: 8,
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
  }, [paybackYears, systemSize]);

  return (
    <Card className="p-6 bg-white rounded-lg shadow-md">
      <canvas ref={chartRef} height={100} />
    </Card>
  );
}
