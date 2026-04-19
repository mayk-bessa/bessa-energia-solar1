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
  ChartOptions,
  TooltipItem,
  LineController,
} from 'chart.js';
import { Card } from '@/components/ui/card';

ChartJS.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ROIChartProps {
  monthlyEconomy: number;
  systemSize: number;
}

export default function ROIChart({ monthlyEconomy, systemSize }: ROIChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Calcular ROI ao longo de 25 anos
    const investmentPerKw = 3000;
    const investment = systemSize * investmentPerKw;
    
    const years = Array.from({ length: 26 }, (_, i) => i);
    const roiData = years.map(year => {
      const monthlyTotal = monthlyEconomy * 12;
      const totalEconomy = monthlyTotal * year;
      
      // Custo de manutenção (1% ao ano após 5 anos)
      let maintenanceCost = 0;
      if (year > 5) {
        maintenanceCost = investment * 0.01 * (year - 5);
      }
      
      const netProfit = totalEconomy - maintenanceCost - investment;
      const roi = (netProfit / investment) * 100;
      
      return roi;
    });

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
          text: `ROI (Retorno sobre Investimento) - Sistema ${systemSize}kW`,
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
              return `ROI: ${value.toFixed(1)}%`;
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
                return `${value.toFixed(0)}%`;
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
            label: 'ROI (%)',
            data: roiData,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#f59e0b',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 6,
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
    <Card className="p-6 bg-white rounded-lg shadow-md">
      <canvas ref={chartRef} height={80} />
    </Card>
  );
}
