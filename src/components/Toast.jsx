import React from 'react';

export default function Toast({ toast, onClose }) {
  const isConfirm = toast.isConfirm;

  return (
    <div
      className={`toast toast-${toast.type} ${isConfirm ? 'toast-confirm' : ''}`}
      role={isConfirm ? "alertdialog" : "status"}
      aria-live={isConfirm ? "assertive" : "polite"}
    >
      <div className="toast-content">
        <p className="toast-message">{toast.message}</p>
        {isConfirm && (
          <div className="toast-actions">
            <button
              className="btn-confirm-yes"
              onClick={toast.onConfirm}
              aria-label="Confirmar eliminación"
            >
              Sí, eliminar
            </button>
            <button
              className="btn-confirm-no"
              onClick={toast.onCancel}
              aria-label="Cancelar eliminación"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
      <button
        className="toast-close-btn"
        onClick={onClose}
        aria-label="Cerrar notificación"
      >
        &times;
      </button>
    </div>
  );
}