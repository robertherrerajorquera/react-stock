import { useContext } from "react";
import { StockContext } from "../../context/StockContext";
import { LOW_STOCK_THRESHOLD } from "../../data/products";

export default function StockAlerts() {
  const context = useContext(StockContext);

  if (context === null) {
    throw new Error("StockAlerts debe estar dentro de <StockProvider>");
  }

  const { state } = context;

  const lowProducts = state.products.filter(
    (product) => product.stock < LOW_STOCK_THRESHOLD
  );

  if (lowProducts.length === 0) {
    return null;
  }

  return (
    <div className="win95-warning">
      ⚠ Stock bajo:{" "}
      {lowProducts
        .map((product) => `${product.name} (${product.stock})`)
        .join(", ")}
    </div>
  );
}
