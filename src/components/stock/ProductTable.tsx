import { useContext } from "react";
import { StockContext } from "../../context/StockContext";
import ProductRow from "./ProductRow";

export default function ProductTable() {
  const context = useContext(StockContext);

  if (context === null) {
    throw new Error("ProductTable debe estar dentro de <StockProvider>");
  }

  const { state, dispatch } = context;

  if (state.products.length === 0) {
    return (
      <div className="win95-sunken p-3 text-center text-xs">
        No hay productos. Usa [Nuevo producto] para agregar el primero.
      </div>
    );
  }

  return (
    <table className="w-full border-collapse text-xs">
      <thead>
        <tr>
          <th className="win95-raised px-2 py-1 text-left">ID</th>
          <th className="win95-raised px-2 py-1 text-left">Producto</th>
          <th className="win95-raised px-2 py-1 text-left">Stock</th>
          <th className="win95-raised px-2 py-1 text-left">Estado</th>
          <th className="win95-raised px-2 py-1 text-right">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {state.products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            selected={product.id === state.selectedId}
            onSelect={(id) =>
              dispatch({ type: "SELECT_PRODUCT", payload: id })
            }
            onAddStock={(id) =>
              dispatch({ type: "UPDATE_STOCK", payload: { id, delta: 1 } })
            }
            onRemoveStock={(id) =>
              dispatch({ type: "UPDATE_STOCK", payload: { id, delta: -1 } })
            }
            onRemove={(id) =>
              dispatch({ type: "REMOVE_PRODUCT", payload: id })
            }
          />
        ))}
      </tbody>
    </table>
  );
}
