import { useContext, useState } from "react";
import { StockContext } from "../../context/StockContext";
import MenuBar, { type Menu } from "../ui/MenuBar";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import StockSummary from "./StockSummary";
import StockAlerts from "./StockAlerts";

export default function StockWindow() {
  const [showForm, setShowForm] = useState(false);

  const context = useContext(StockContext);

  if (context === null) {
    throw new Error("StockWindow debe estar dentro de <StockProvider>");
  }

  const { state, dispatch } = context;

  const handleNew = () => setShowForm(true);

  const handleRemoveSelected = () => {
    if (state.selectedId !== null) {
      dispatch({ type: "REMOVE_PRODUCT", payload: state.selectedId });
    }
  };

  const menus: Menu[] = [
    {
      label: "Archivo",
      items: [
        { label: "Nuevo producto", onClick: handleNew },
        { label: "sep", separator: true },
        {
          label: "Vaciar stock",
          onClick: () => dispatch({ type: "CLEAR_STOCK" }),
        },
      ],
    },
    {
      label: "Productos",
      items: [
        { label: "Nuevo producto", onClick: handleNew },
        {
          label: "Eliminar seleccionado",
          disabled: state.selectedId === null,
          onClick: handleRemoveSelected,
        },
      ],
    },
    {
      label: "Ver",
      items: [
        { label: "Alertas de stock", disabled: true },
        { label: "Lista detallada", disabled: true },
      ],
    },
  ];

  return (
    <div className="flex h-full flex-col gap-2">
      <MenuBar menus={menus} />

      <div className="flex flex-wrap gap-2">
        <button type="button" className="win95-button" onClick={handleNew}>
          Nuevo producto
        </button>
        <button
          type="button"
          className="win95-button"
          disabled={state.selectedId === null}
          onClick={handleRemoveSelected}
        >
          Eliminar
        </button>
        <button
          type="button"
          className="win95-button"
          disabled={state.products.length === 0}
          onClick={() => dispatch({ type: "CLEAR_STOCK" })}
        >
          Vaciar
        </button>
      </div>

      {showForm && <ProductForm onDone={() => setShowForm(false)} />}

      <StockAlerts />

      <div className="min-h-0 flex-1 overflow-auto">
        <ProductTable />
      </div>

      <StockSummary />
    </div>
  );
}
