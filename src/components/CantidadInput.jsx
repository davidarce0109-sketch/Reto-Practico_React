import React, { useState, useEffect } from 'react';

export default function CantidadInput({
  valor,
  max,
  onChange,
  onExceedMax,
  onBelowMin,
  ariaLabel = "Cantidad de producto"
}) {
  const [valLocal, setValLocal] = useState(String(valor));

  useEffect(() => {
    setValLocal(String(valor));
  }, [valor]);

  const handleKeyDown = (e) => {
    // Bloquear explícitamente caracteres de notaciones exponenciales, signos y decimales
    const prohibidos = ['e', 'E', '+', '-', '.', ','];
    if (prohibidos.includes(e.key)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    // Permitir pegar única y exclusivamente dígitos numéricos
    if (/^\d+$/.test(pastedText)) {
      procesarNuevoValor(pastedText);
    }
  };

  const handleChange = (e) => {
    const inputVal = e.target.value.replace(/\D/g, ''); // Filtrado de seguridad
    setValLocal(inputVal);

    if (inputVal === '') {
      return; // Permite estar temporalmente vacío durante la edición
    }

    procesarNuevoValor(inputVal);
  };

  const procesarNuevoValor = (strVal) => {
    const num = parseInt(strVal, 10);

    if (isNaN(num) || num === 0) {
      if (onBelowMin) onBelowMin();
      return;
    }

    if (num > max) {
      if (onExceedMax) onExceedMax();
      setValLocal(String(max));
      onChange(max);
    } else {
      setValLocal(String(num));
      onChange(num);
    }
  };

  const handleBlur = () => {
    if (valLocal === '' || parseInt(valLocal, 10) === 0) {
      if (valLocal === '0' || valLocal === '') {
        if (onBelowMin) onBelowMin();
      }
      setValLocal(String(valor));
    }
  };

  const handleWheel = (e) => {
    e.target.blur(); // Evita cambios de valor involuntarios por scroll del mouse
  };

  return (
    <input
      type="number"
      inputMode="numeric"
      className="cantidad-input"
      value={valLocal}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onChange={handleChange}
      onBlur={handleBlur}
      onWheel={handleWheel}
      aria-label={ariaLabel}
      min="1"
      max={max}
    />
  );
}