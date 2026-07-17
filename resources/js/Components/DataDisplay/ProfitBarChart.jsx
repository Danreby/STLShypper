import { useTheme } from '@/Hooks/useTheme';
import { formatCurrency } from '@/Utils/format';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    LinearScale,
    Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function ProfitBarChart({ data, color = '#6366f1' }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.06)';
    const tickColor = isDark ? '#94a3b8' : '#64748b';

    if (!data || data.length === 0) {
        return <p className="text-sm text-slate-500 dark:text-slate-400">Sem dados suficientes ainda.</p>;
    }

    const chartData = {
        labels: data.map((d) => d.label),
        datasets: [
            {
                data: data.map((d) => d.profit),
                backgroundColor: color,
                borderRadius: 4,
                maxBarThickness: 22,
                categoryPercentage: 0.7,
                barPercentage: 0.9,
            },
        ],
    };

    const options = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => formatCurrency(ctx.parsed.x),
                },
            },
        },
        scales: {
            x: {
                grid: { color: gridColor },
                border: { display: false },
                ticks: { color: tickColor, callback: (v) => formatCurrency(v) },
            },
            y: {
                grid: { display: false },
                border: { display: false },
                ticks: { color: tickColor },
            },
        },
    };

    return (
        <div style={{ height: `${Math.max(data.length, 1) * 38 + 24}px` }}>
            <Bar data={chartData} options={options} />
        </div>
    );
}
