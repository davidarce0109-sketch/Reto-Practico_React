import React, { useEffect } from 'react';
import CartItem from './CartItem';
import { useCarrito } from '../context/CarritoContext';
import { formatearCOP } from '../utils/formato';

export default function CartPanel({ isOpen, onClose }) {
  const {
    items,
    totalUnidades,
    totalPrecio,
    incrementarItem,
    decrementarItem,
    actualizarCantidadItem,
    eliminarDirecto
  } = useCarrito();

  // Escuchar tecla ESC para cerrar el panel lateral
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose} aria-hidden="true">
      <div
        className="cart-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Panel de Carrito de Compras"
      >
        <div className="cart-header">
          <h2>Tu Carrito</h2>
          <button
            className="btn-close-cart"
            onClick={onClose}
            aria-label="Cerrar panel del carrito"
          >
            &times;
          </button>
        </div>

        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrementar={incrementarItem}
                  onDecrementar={decrementarItem}
                  onActualizarCantidad={actualizarCantidadItem}
                  onEliminar={eliminarDirecto}
                />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="summary-row">
              <span>Total de unidades:</span>
              <strong>{totalUnidades}</strong>
            </div>
            <div className="summary-row total-row">
              <span>Total de la compra:</span>
              <strong>{formatearCOP(totalPrecio)}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}