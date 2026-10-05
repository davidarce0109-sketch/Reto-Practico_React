import React from 'react';
import PRODUCTOS from '../data/productos';
import ProductCard from './ProductCard';
import { useCarrito } from '../context/CarritoContext';

export default function Catalogo() {
  const { items, agregarAlCarrito } = useCarrito();

  const getCantidadEnCarrito = (id) => {
    const item = items.find((i) => i.id === id);
    return item ? item.cantidad : 0;
  };

  return (
    <section className="catalogo-section">
      <h2 className="section-title">Catálogo de Productos</h2>
      <div className="productos-grid">
        {PRODUCTOS.map((producto) => (
          <ProductCard
            key={producto.id}
            producto={producto}
            enCarritoCantidad={getCantidadEnCarrito(producto.id)}
            onAgregar={agregarAlCarrito}
          />
        ))}
      </div>
    </section>
  );
}