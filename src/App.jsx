import React, { useState } from 'react';
import { ToastProvider, useToast } from './context/ToastContext';
import { CarritoProvider, useCarrito } from './context/CarritoContext';
import Navbar from './components/NavBar';
import Catalogo from './components/Catalogo';
import CartPanel from './components/CartPanel';
import ToastContainer from './components/ToastContainer';

function MainLayout() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalUnidades } = useCarrito();
  const { toasts, removeToast } = useToast();

  return (
    <div className="app-container">
      <Navbar
        totalUnidades={totalUnidades}
        onOpenCart={() => setIsCartOpen(true)}
      />
      <main className="main-content">
        <Catalogo />
      </main>
      <CartPanel
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <CarritoProvider>
        <MainLayout />
      </CarritoProvider>
    </ToastProvider>
  );
}