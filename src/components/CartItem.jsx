import React from 'react';
import CantidadInput from './CantidadInput';
import { formatearCOP } from '../utils/formato';
import useToast from '../hooks/useToast';
import { MSG_STOCK_MAX } from '../context/ToastContext';

export default function CartItem({
  item,
  onIncrementar,
  onDecrementar,
  onActualizarCantidad,
  onEliminar
}) {
  const { showToast } = useToast();

  const handleExceedMax = () => {
    showToast(MSG_STOCK_MAX, 'warning');
  };

  const subtotal = item.precio * item.cantidad;

  return (
    <div className="cart-item">
      <div className="cart-item-details">
        <h4 className="cart-item-title">{item.nombre}</h4>
        <p className="cart-item-price">{formatearCOP(item.precio)} c/u</p>
        <p className="cart-item-subtotal">
          Subtotal: <strong>{formatearCOP(subtotal)}</strong>
        </p>
      </div>

      <div className="cart-item-controls">
        <div className="qty-control-group">
          <button
            className="btn-qty"
            onClick={() => onDecrementar(item.id)}
            aria-label={`Disminuir cantidad de ${item.nombre}`}
          >
            -
          </button>
          
          <CantidadInput
            valor={item.cantidad}
            max={item.stock}
            onChange={(val) => onActualizarCantidad(item.id, val)}
            onExceedMax={handleExceedMax}
            onBelowMin={() => onDecrementar(item.id)}
            ariaLabel={`Cantidad de ${item.nombre} en carrito`}
          />

          <button
            className="btn-qty"
            onClick={() => onIncrementar(item.id)}
            aria-label={`Aumentar cantidad de ${item.nombre}`}
          >
            +
          </button>
        </div>

        <button
          className="btn-delete"
          onClick={() => onEliminar(item.id)}
          aria-label={`Eliminar ${item.nombre} del carrito`}
          title="Eliminar producto"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}