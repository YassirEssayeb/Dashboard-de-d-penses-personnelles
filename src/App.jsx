import React, { useState, useEffect } from 'react';
import { Wallet, TrendingDown, PiggyBank, Edit3, Check, X, AlertTriangle, AlertCircle } from 'lucide-react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseCharts from './components/ExpenseCharts';
import ExpenseList from './components/ExpenseList';

const INITIAL_EXPENSES = [
  { id: '1', description: 'Loyer mensuel', amount: 450, category: 'logement', date: '2026-06-01' },
  { id: '2', description: 'Courses supermarché', amount: 84.50, category: 'alimentation', date: '2026-06-12' },
  { id: '3', description: 'Abonnement Netflix', amount: 15.99, category: 'loisirs', date: '2026-06-15' },
  { id: '4', description: 'Carte de transport Navigo', amount: 86.40, category: 'transport', date: '2026-06-20' },
  { id: '5', description: 'Consultation médecin', amount: 25.00, category: 'sante', date: '2026-06-22' }
];

export default function App() {
  // Load expenses and budget from localStorage
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('personal_expenses');
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch (e) {
      console.error("Error parsing personal_expenses from localStorage", e);
      return INITIAL_EXPENSES;
    }
  });

  const [budget, setBudget] = useState(() => {
    try {
      const saved = localStorage.getItem('personal_budget');
      return saved ? parseFloat(saved) || 1000 : 1000;
    } catch (e) {
      console.error("Error parsing personal_budget from localStorage", e);
      return 1000;
    }
  });

  // Inline budget editing states
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(budget.toString());

  // Save to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem('personal_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Save to localStorage whenever budget changes
  useEffect(() => {
    localStorage.setItem('personal_budget', budget.toString());
  }, [budget]);

  // Core Calculations
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingBalance = budget - totalSpent;
  const spentPercentage = budget > 0 ? (totalSpent / budget) * 100 : 100;

  // Add Expense
  const handleAddExpense = (newExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
  };

  // Delete Expense
  const handleDeleteExpense = (id) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  // Budget Edit Submission
  const handleSaveBudget = () => {
    const parsed = parseFloat(tempBudget);
    if (!isNaN(parsed) && parsed >= 0) {
      setBudget(parsed);
      setIsEditingBudget(false);
    }
  };

  const handleCancelBudgetEdit = () => {
    setTempBudget(budget.toString());
    setIsEditingBudget(false);
  };

  // Progress Bar color determination
  const getProgressBarColor = () => {
    if (spentPercentage >= 100) return 'var(--danger)';
    if (spentPercentage >= 80) return 'var(--warning)';
    return 'var(--success)';
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-icon">
            <Wallet size={28} />
          </div>
          <div>
            <h1 className="brand-title">Dashboard de Dépenses</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Suivi financier et budgétaire personnel</p>
          </div>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          Données stockées localement
        </div>
      </header>

      {/* Alert Banners */}
      {spentPercentage >= 100 ? (
        <div className="alert-banner danger">
          <AlertCircle size={20} />
          <div className="alert-message">
            <strong>Attention !</strong> Vous avez dépassé votre budget mensuel de{' '}
            {Math.abs(remainingBalance).toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            })}.
          </div>
        </div>
      ) : spentPercentage >= 80 ? (
        <div className="alert-banner warning">
          <AlertTriangle size={20} />
          <div className="alert-message">
            <strong>Alerte budget !</strong> Vous avez consommé{' '}
            {spentPercentage.toFixed(0)}% de votre budget mensuel. Il vous reste{' '}
            {remainingBalance.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            })}.
          </div>
        </div>
      ) : null}

      {/* KPI Section */}
      <section className="kpi-grid">
        {/* Card 1: Budget */}
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Budget Mensuel</span>
            <div className="kpi-icon-wrapper budget">
              <Wallet size={20} />
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '42px' }}>
            {isEditingBudget ? (
              <div className="budget-configure">
                <input
                  type="number"
                  className="budget-input"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveBudget();
                    if (e.key === 'Escape') handleCancelBudgetEdit();
                  }}
                  autoFocus
                />
                <button className="action-btn" onClick={handleSaveBudget} title="Enregistrer">
                  <Check size={18} style={{ color: 'var(--success)' }} />
                </button>
                <button className="action-btn" onClick={handleCancelBudgetEdit} title="Annuler">
                  <X size={18} style={{ color: 'var(--danger)' }} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.50rem' }}>
                <span className="kpi-value">
                  {budget.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </span>
                <button
                  className="action-btn"
                  onClick={() => {
                    setTempBudget(budget.toString());
                    setIsEditingBudget(true);
                  }}
                  title="Modifier le budget"
                >
                  <Edit3 size={16} />
                </button>
              </div>
            )}
          </div>
          <div className="kpi-footer">Configurable à tout moment</div>
        </div>

        {/* Card 2: Spent */}
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Total Dépensé</span>
            <div className="kpi-icon-wrapper spent">
              <TrendingDown size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', height: '42px' }}>
            <span className="kpi-value" style={{ color: totalSpent > budget ? 'var(--danger)' : 'white' }}>
              {totalSpent.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
          <div className="kpi-footer">
            Sur l'ensemble des transactions enregistrées
          </div>
        </div>

        {/* Card 3: Remaining */}
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Solde Restant</span>
            <div className={`kpi-icon-wrapper remaining ${remainingBalance < 0 ? 'negative' : ''}`}>
              <PiggyBank size={20} />
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', height: '42px' }}>
            <span className="kpi-value" style={{ color: remainingBalance < 0 ? 'var(--danger)' : 'var(--success)' }}>
              {remainingBalance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${Math.min(spentPercentage, 100)}%`,
                  backgroundColor: getProgressBarColor()
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <span>Consommé : {spentPercentage.toFixed(0)}%</span>
              <span>{Math.max(0, 100 - spentPercentage).toFixed(0)}% restant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Form and Charts Grid */}
      <section className="main-content">
        <ExpenseForm onAddExpense={handleAddExpense} />
        <ExpenseCharts expenses={expenses} />
      </section>

      {/* Bottom Expenses List */}
      <section style={{ width: '100%' }}>
        <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />
      </section>
    </div>
  );
}
