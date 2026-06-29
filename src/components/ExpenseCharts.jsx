import React from 'react';
import { BarChart3, PieChart } from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CATEGORY_META = {
  alimentation: { label: 'Alimentation', color: '#fbbf24' },
  logement: { label: 'Logement', color: '#60a5fa' },
  transport: { label: 'Transport', color: '#a78bfa' },
  loisirs: { label: 'Loisirs', color: '#f472b6' },
  sante: { label: 'Santé', color: '#34d399' },
  autres: { label: 'Autres', color: '#9ca3af' }
};

export default function ExpenseCharts({ expenses }) {
  const hasExpenses = expenses.length > 0;

  // 1. Prepare data for Doughnut Chart (Categories)
  const categoryTotals = expenses.reduce((acc, exp) => {
    const cat = exp.category || 'autres';
    acc[cat] = (acc[cat] || 0) + exp.amount;
    return acc;
  }, {});

  const doughnutData = {
    labels: Object.keys(categoryTotals).map(
      (cat) => CATEGORY_META[cat]?.label || 'Autres'
    ),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: Object.keys(categoryTotals).map(
          (cat) => CATEGORY_META[cat]?.color || '#9ca3af'
        ),
        borderColor: 'rgba(15, 22, 38, 0.9)',
        borderWidth: 2,
        hoverOffset: 6
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#e5e7eb',
          font: {
            family: 'Outfit',
            size: 11
          },
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#f3f4f6',
        bodyColor: '#f3f4f6',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              }).format(context.parsed);
            }
            return label;
          }
        }
      }
    }
  };

  // 2. Prepare data for Line Chart (Monthly trend)
  // Group by YYYY-MM
  const monthlyTotals = expenses.reduce((acc, exp) => {
    if (!exp.date) return acc;
    const monthKey = exp.date.substring(0, 7); // "YYYY-MM"
    acc[monthKey] = (acc[monthKey] || 0) + exp.amount;
    return acc;
  }, {});

  // Sort monthly keys chronologically
  const sortedMonths = Object.keys(monthlyTotals).sort();

  // Helper to format "YYYY-MM" to readable French month names
  const formatMonthKey = (key) => {
    const [year, month] = key.split('-');
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
    return dateObj.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  };

  const lineData = {
    labels: sortedMonths.map(formatMonthKey),
    datasets: [
      {
        label: 'Dépenses mensuelles',
        data: sortedMonths.map((m) => monthlyTotals[m]),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1f2937',
        callbacks: {
          label: function (context) {
            return new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            }).format(context.parsed.y);
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.04)'
        },
        ticks: {
          color: '#9ca3af',
          font: { family: 'Outfit', size: 11 }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.04)'
        },
        ticks: {
          color: '#9ca3af',
          font: { family: 'Outfit', size: 11 },
          callback: function (value) {
            return value + ' €';
          }
        }
      }
    }
  };

  return (
    <div className="charts-grid">
      {/* Category breakdown Panel */}
      <div className="panel">
        <h3 className="panel-title">
          <PieChart size={18} className="kpi-icon-wrapper spent" />
          Répartition par catégorie
        </h3>
        <div className="chart-wrapper">
          {hasExpenses ? (
            <Doughnut data={doughnutData} options={doughnutOptions} />
          ) : (
            <div className="empty-state" style={{ fontSize: '0.9rem' }}>
              Aucune donnée à afficher.
            </div>
          )}
        </div>
      </div>

      {/* Monthly trend Panel */}
      <div className="panel">
        <h3 className="panel-title">
          <BarChart3 size={18} className="kpi-icon-wrapper budget" />
          Évolution mensuelle
        </h3>
        <div className="chart-wrapper">
          {hasExpenses ? (
            <Line data={lineData} options={lineOptions} />
          ) : (
            <div className="empty-state" style={{ fontSize: '0.9rem' }}>
              Aucune donnée à afficher.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
