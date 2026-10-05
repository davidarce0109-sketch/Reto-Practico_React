import React from 'react';
import CartIcon from './CartIcon';

export default function Navbar({ totalUnidades, onOpenCart }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="brand">
          <h1>TIENDA PALMIRA</h1>
          <span className="sub-brand">SENA – CBI Palmira</span>
        </div>
        <CartIcon totalUnidades={totalUnidades} onClick={onOpenCart} />
      </div>
    </header>
  );
}