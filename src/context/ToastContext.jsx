import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const MSG_STOCK_MAX = "Este es el máximo de producto disponible en stock";
export const MSG_CANTIDAD_MIN = "La cantidad mínima es 1";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Elimina un toast por su ID
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Muestra un toast normal evitando duplicados consecutivos idénticos
  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    setToasts((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].message === message) {
        return prev;
      }
      const id = Date.now() + Math.random();
      const newToast = { id, message, type, isConfirm: false };

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return [...prev, newToast];
    });
  }, [removeToast]);

  // Muestra un toast interactivo de confirmación
  const showConfirmToast = useCallback((message, onConfirm, onCancel) => {
    setToasts((prev) => {
      const id = Date.now() + Math.random();
      const newToast = {
        id,
        message,
        type: 'warning',
        isConfirm: true,
        onConfirm: () => {
          onConfirm();
          removeToast(id);
        },
        onCancel: () => {
          if (onCancel) onCancel();
          removeToast(id);
        }
      };
      return [...prev, newToast];
    });
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, showConfirmToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser utilizado dentro de un ToastProvider');
  }
  return context;
};