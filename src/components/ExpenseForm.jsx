import React, { useState } from 'react';
import { PlusCircle, Tag, DollarSign, Calendar, FileText } from 'lucide-react';

const CATEGORIES = [
  { id: 'alimentation', label: 'Alimentation' },
  { id: 'logement', label: 'Logement' },
  { id: 'transport', label: 'Transport' },
  { id: 'loisirs', label: 'Loisirs' },
  { id: 'sante', label: 'Santé' },
  { id: 'autres', label: 'Autres' }
];

export default function ExpenseForm({ onAddExpense }) {
  const getTodayDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('alimentation');
  const [date, setDate] = useState(getTodayDate());
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!description.trim()) {
      setError('Veuillez saisir une description.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Veuillez saisir un montant supérieur à 0.');
      return;
    }

    if (!date) {
      setError('Veuillez sélectionner une date.');
      return;
    }

    onAddExpense({
      id: Date.now().toString(),
      description: description.trim(),
      amount: parsedAmount,
      category,
      date
    });

    // Reset Form (except date and category, which can be reused)
    setDescription('');
    setAmount('');
  };

  return (
    <div className="panel">
      <h2 className="panel-title">
        <PlusCircle size={20} className="kpi-icon-wrapper spent" />
        Ajouter une dépense
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {error && (
          <div style={{ color: 'var(--danger)', fontSize: '0.875rem', fontWeight: 500, padding: '0.5rem', background: 'var(--danger-glow)', borderRadius: 'var(--radius-sm)' }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="description">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={14} /> Description
            </span>
          </label>
          <input
            id="description"
            type="text"
            className="form-input"
            placeholder="Ex. Courses hebdomadaires"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="amount">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <DollarSign size={14} /> Montant (€)
            </span>
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            className="form-input"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="category">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tag size={14} /> Catégorie
            </span>
          </label>
          <select
            id="category"
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="date">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={14} /> Date
            </span>
          </label>
          <input
            id="date"
            type="date"
            className="form-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
          <PlusCircle size={18} /> Ajouter
        </button>
      </form>
    </div>
  );
}
