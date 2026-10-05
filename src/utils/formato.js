/**
 * Formatea un valor numérico a divisa Pesos Colombianos (COP) sin decimales.
 */
export const formatearCOP = (valor) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
};