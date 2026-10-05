import React, { createContext, useContext, useReducer, useEffect } from 'react';
import PRODUCTOS from '../data/productos';
import useToast from '../hooks/useToast';
import { MSG_STOCK_MAX, MSG_CANTIDAD_MIN } from './ToastContext';

const CarritoContext = createContext(null);
const STORAGE_KEY = 'TIENDA_PALMIRA_CARRITO_V1';

function cargarCarritoInicial() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];

    // Validar y sanitizar las cantidades contra el stock actual de cada producto
    return parsed.filter(item => {
      const prod = PRODUCTOS.find(p => p.id === item.id);
      return prod && item.cantidad > 0;
    }).map(item => {
      const prod = PRODUCTOS.find(p => p.id === item.id);
      return {
        ...item,
        cantidad: Math.min(item.cantidad, prod.stock)
      };
    });
  } catch (error) {
    console.error("Error al cargar carrito desde localStorage:", error);
    return [];
  }
}

function carritoReducer(state, action) {
  switch (action.type) {
    case 'SET_ITEMS':
      return action.payload;
    case 'AGREGAR_O_ACTUALIZAR': {
      const { id, cantidadAgregar, stockMax } = action.payload;
      const index = state.findIndex(item => item.id === id);

      if (index >= 0) {
        const itemExistente = state[index];
        const nuevaCantidad = Math.min(itemExistente.cantidad + cantidadAgregar, stockMax);
        const nuevoEstado = [...state];
        nuevoEstado[index] = { ...itemExistente, cantidad: nuevaCantidad };
        return nuevoEstado;
      } else {
        const prod = PRODUCTOS.find(p => p.id === id);
        return [...state, { ...prod, cantidad: Math.min(cantidadAgregar, stockMax) }];
      }
    }
    case 'CAMBIAR_CANTIDAD': {
      const { id, nuevaCantidad } = action.payload;
      return state.map(item => item.id === id ? { ...item, cantidad: nuevaCantidad } : item);
    }
    case 'ELIMINAR':
      return state.filter(item => item.id !== action.payload);
    default:
      return state;
  }
}

export function CarritoProvider({ children }) {
  const [items, dispatch] = useReducer(carritoReducer, [], cargarCarritoInicial);
  const { showToast, showConfirmToast } = useToast();

  // Guardar en localStorage ante cualquier cambio
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Error guardando en localStorage", e);
    }
  }, [items]);

  // Agregar producto desde el catálogo
  const agregarAlCarrito = (producto, cantidadDeseada) => {
    const itemExistente = items.find(i => i.id === producto.id);
    const cantActual = itemExistente ? itemExistente.cantidad : 0;
    const cantPermitida = producto.stock - cantActual;

    if (cantPermitida <= 0) {
      showToast(MSG_STOCK_MAX, 'warning');
      return;
    }

    if (cantidadDeseada > cantPermitida) {
      showToast(MSG_STOCK_MAX, 'warning');
      dispatch({
        type: 'AGREGAR_O_ACTUALIZAR',
        payload: { id: producto.id, cantidadAgregar: cantPermitida, stockMax: producto.stock }
      });
    } else {
      dispatch({
        type: 'AGREGAR_O_ACTUALIZAR',
        payload: { id: producto.id, cantidadAgregar: cantidadDeseada, stockMax: producto.stock }
      });
      showToast(`Se agregaron ${Math.min(cantidadDeseada, cantPermitida)} unidades de "${producto.nombre}"`, 'success');
    }
  };

  // Modificar cantidad directamente desde el input o botones +/- en el carrito
  const actualizarCantidadItem = (id, nuevaCantidad) => {
    const prod = PRODUCTOS.find(p => p.id === id);
    if (!prod) return;

    if (nuevaCantidad > prod.stock) {
      showToast(MSG_STOCK_MAX, 'warning');
      dispatch({ type: 'CAMBIAR_CANTIDAD', payload: { id, nuevaCantidad: prod.stock } });
      return;
    }

    if (nuevaCantidad <= 0) {
      solicitarEliminacion(id);
      return;
    }

    dispatch({ type: 'CAMBIAR_CANTIDAD', payload: { id, nuevaCantidad } });
  };

  const incrementarItem = (id) => {
    const item = items.find(i => i.id === id);
    const prod = PRODUCTOS.find(p => p.id === id);
    if (!item || !prod) return;

    if (item.cantidad >= prod.stock) {
      showToast(MSG_STOCK_MAX, 'warning');
    } else {
      dispatch({ type: 'CAMBIAR_CANTIDAD', payload: { id, nuevaCantidad: item.cantidad + 1 } });
    }
  };

  const decrementarItem = (id) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    if (item.cantidad === 1) {
      solicitarEliminacion(id);
    } else {
      dispatch({ type: 'CAMBIAR_CANTIDAD', payload: { id, nuevaCantidad: item.cantidad - 1 } });
    }
  };

  const solicitarEliminacion = (id) => {
    const item = items.find(i => i.id === id);
    const nombre = item ? item.nombre : 'este producto';
    
    showConfirmToast(
      `${MSG_CANTIDAD_MIN}. ¿Desea eliminar "${nombre}" del carrito?`,
      () => {
        dispatch({ type: 'ELIMINAR', payload: id });
        showToast(`Se eliminó "${nombre}" del carrito`, 'info');
      }
    );
  };

  const eliminarDirecto = (id) => {
    const item = items.find(i => i.id === id);
    dispatch({ type: 'ELIMINAR', payload: id });
    if (item) {
      showToast(`Se eliminó "${item.nombre}" del carrito`, 'info');
    }
  };

  const totalUnidades = items.reduce((acc, curr) => acc + curr.cantidad, 0);
  const totalPrecio = items.reduce((acc, curr) => acc + (curr.precio * curr.cantidad), 0);

  return (
    <CarritoContext.Provider
      value={{
        items,
        totalUnidades,
        totalPrecio,
        agregarAlCarrito,
        actualizarCantidadItem,
        incrementarItem,
        decrementarItem,
        eliminarDirecto
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  }
  return context;
};