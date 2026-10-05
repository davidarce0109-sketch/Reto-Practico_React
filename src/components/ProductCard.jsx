import React, { useState } from 'react';
import CantidadInput from './CantidadInput';
import { formatearCOP } from '../utils/formato';
import useToast from '../hooks/useToast';
import { MSG_STOCK_MAX, MSG_CANTIDAD_MIN } from '../context/ToastContext';

export default function ProductCard({ producto, enCarritoCantidad, onAgregar }) {
  const [cantidadInput, setCantidadInput] = useState(1);
  const { showToast } = useToast();

  const stockDisponible = producto.stock - enCarritoCantidad;
  const estaAgotado = stockDisponible <= 0;

  const handleExceedMax = () => {
    showToast(MSG_STOCK_MAX, 'warning');
  };

  const handleBelowMin = () => {
    showToast(MSG_CANTIDAD_MIN, 'warning');
  };

  const handleAgregar = () => {
    if (estaAgotado) return;
    onAgregar(producto, cantidadInput);
    setCantidadInput(1); // Reiniciar input a 1 tras agregar exitosamente
  };

  return (
    <div className={`product-card ${estaAgotado ? 'product-card-out' : ''}`}>
      <div className="product-info">
        <h3 className="product-title">{producto.nombre}</h3>
        <p className="product-price">{formatearCOP(producto.precio)}</p>
        <p className="product-stock">
          Stock disponible: <strong>{stockDisponible}</strong> / {producto.stock}
        </p>
      </div>

      <div className="product-actions">
        <div className="cantidad-container">
          <label htmlFor={`cant-prod-${producto.id}`}>Cantidad:</label>
          <CantidadInput
            id={`cant-prod-${producto.id}`}
            valor={cantidadInput}
            max={Math.max(1, stockDisponible)}
            onChange={(val) => setCantidadInput(val)}
            onExceedMax={handleExceedMax}
            onBelowMin={handleBelowMin}
            ariaLabel={`Cantidad para ${producto.nombre}`}
          />
        </div>

        <button
          className="btn-agregar"
          onClick={handleAgregar}
          disabled={estaAgotado}
          aria-label={`Agregar ${producto.nombre} al carrito`}
        >
          {estaAgotado ? 'Agotado' : 'Agregar'}
        </button>
      </div>
    </div>
  );
}