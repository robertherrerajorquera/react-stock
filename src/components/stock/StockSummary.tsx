import { useContext } from "react";
import { StockContext } from "../../context/StockContext";

export default function StockSummary() {
  const context = useContext(StockContext);

  if (context === null) {
    throw new Error("StockSummary debe estar dentro de <StockProvider>");
  }

  const { state } = context;

  const totalStock = state.products.reduce(
    (sum, product) => sum + product.stock,
    0
  );

  const selected = state.products.find(
    (product) => product.id === state.selectedId
  );

  return (
    <div className="win95-window__statusbar m-0">
      <span>
        {state.products.length} producto
        {state.products.length === 1 ? "" : "s"}
      </span>
      <span>
        {selected ? `Seleccionado: ${selected.name}` : "Sin selección"}
      </span>
      <span>Stock total: {totalStock}</span>
    </div>
  );
}
