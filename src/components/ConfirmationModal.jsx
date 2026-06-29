import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-wrapper">
            <AlertTriangle size={24} />
          </div>
          <span>Confirmation requise</span>
        </div>
        <div className="modal-body">
          <p>{message || "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible."}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Confirmer la suppression
          </button>
        </div>
      </div>
    </div>
  );
}
