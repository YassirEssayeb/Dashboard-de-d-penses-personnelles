import React, { useState } from 'react';
import { Trash2, Search, Download, ArrowUpDown, SlidersHorizontal, Info } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

const CATEGORIES = {
  alimentation: 'Alimentation',
  logement: 'Logement',
  transport: 'Transport',
  loisirs: 'Loisirs',
  sante: 'Santé',
  autres: 'Autres'
};

export default function ExpenseList({ expenses, onDeleteExpense }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Handle delete click
  const handleDeleteClick = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedExpense) {
      onDeleteExpense(selectedExpense.id);
    }
    setIsModalOpen(false);
    setSelectedExpense(null);
  };

  // Filter & Search Logic
  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch = exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (CATEGORIES[exp.category] || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || exp.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Sorting Logic
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === 'date-desc') {
      return new Date(b.date) - new Date(a.date);
    }
    if (sortBy === 'date-asc') {
      return new Date(a.date) - new Date(b.date);
    }
    if (sortBy === 'amount-desc') {
      return b.amount - a.amount;
    }
    if (sortBy === 'amount-asc') {
      return a.amount - b.amount;
    }
    return 0;
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (expenses.length === 0) return;

    // Header row
    const headers = ['Date', 'Description', 'Categorie', 'Montant (EUR)'];
    
    // Rows
    const rows = expenses.map(exp => [
      exp.date,
      `"${exp.description.replace(/"/g, '""')}"`, // escape quotes
      CATEGORIES[exp.category] || 'Autres',
      exp.amount.toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Add BOM for Excel compatibility with French accents
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `depenses_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="panel" style={{ width: '100%' }}>
      <h3 className="panel-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SlidersHorizontal size={18} className="kpi-icon-wrapper remaining" />
          Historique des dépenses
        </span>
        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {sortedExpenses.length} dépense{sortedExpenses.length > 1 ? 's' : ''} trouvée{sortedExpenses.length > 1 ? 's' : ''}
        </span>
      </h3>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Rechercher une dépense..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="form-group filter-select">
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Toutes catégories</option>
            {Object.entries(CATEGORIES).map(([key, val]) => (
              <option key={key} value={key}>{val}</option>
            ))}
          </select>
        </div>

        <div className="form-group filter-select">
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-desc">Date (Récent → Ancien)</option>
            <option value="date-asc">Date (Ancien → Récent)</option>
            <option value="amount-desc">Montant (Max → Min)</option>
            <option value="amount-asc">Montant (Min → Max)</option>
          </select>
        </div>

        {expenses.length > 0 && (
          <button onClick={handleExportCSV} className="btn btn-secondary export-btn">
            <Download size={16} /> Export CSV
          </button>
        )}
      </div>

      {/* Expenses Table */}
      <div className="table-container">
        {sortedExpenses.length === 0 ? (
          <div className="empty-state">
            <Info size={32} />
            <p>Aucune dépense enregistrée correspondant à vos critères.</p>
          </div>
        ) : (
          <table className="expense-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Catégorie</th>
                <th>Montant</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedExpenses.map((exp) => (
                <tr key={exp.id}>
                  <td data-label="Date">{new Date(exp.date).toLocaleDateString('fr-FR')}</td>
                  <td data-label="Description" style={{ fontWeight: 500 }}>{exp.description}</td>
                  <td data-label="Catégorie">
                    <span className={`category-tag tag-${exp.category}`}>
                      {CATEGORIES[exp.category] || 'Autres'}
                    </span>
                  </td>
                  <td data-label="Montant" className="expense-amount danger">
                    -{exp.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </td>
                  <td data-label="Actions" style={{ textAlign: 'right' }}>
                    <button
                      className="action-btn"
                      onClick={() => handleDeleteClick(exp)}
                      title="Supprimer la dépense"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message={
          selectedExpense
            ? `Êtes-vous sûr de vouloir supprimer la dépense "${selectedExpense.description}" de ${selectedExpense.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} ?`
            : null
        }
      />
    </div>
  );
}
