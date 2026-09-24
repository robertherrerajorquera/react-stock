import { useContext } from "react";
import { StockContext } from "../../context/StockContext";
import { LOW_STOCK_THRESHOLD } from "../../data/products";

const menuItems = ["Archivo", "Productos", "Ver"];

export default function StockWindow() {
  const context = useContext(StockContext);

  if (context === null) {
    throw new Error("StockWindow debe estar dentro de <StockProvider>");
  }

  const { products } = context;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="win95-window__menubar">
        {menuItems.map((item) => (
          <button key={item} type="button" className="win95-menubar__item">
            {item}
          </button>
        ))}
      </div>

      <div>
        <button type="button" className="win95-button" disabled>
          Nuevo producto
        </button>
      </div>

      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className="win95-raised px-2 py-1 text-left">ID</th>
            <th className="win95-raised px-2 py-1 text-left">Producto</th>
            <th className="win95-raised px-2 py-1 text-left">Stock</th>
            <th className="win95-raised px-2 py-1 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const isLow = product.stock < LOW_STOCK_THRESHOLD;

            return (
              <tr key={product.id} className="bg-white">
                <td className="border-b border-[#c0c0c0] px-2 py-1">
                  {String(product.id).padStart(2, "0")}
                </td>
                <td className="border-b border-[#c0c0c0] px-2 py-1">
                  {product.name}
                </td>
                <td className="border-b border-[#c0c0c0] px-2 py-1">
                  {product.stock}
                </td>
                <td
                  className={
                    isLow
                      ? "border-b border-[#c0c0c0] px-2 py-1 font-bold text-[#ff0000]"
                      : "border-b border-[#c0c0c0] px-2 py-1"
                  }
                >
                  {isLow ? "BAJO" : "OK"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="win95-window__statusbar mt-auto">
        <span>
          {products.length} producto{products.length === 1 ? "" : "s"}
        </span>
        <span>Stock total: {totalStock}</span>
      </div>
    </div>
  );
}
