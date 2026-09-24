import type { Product } from "../../data/products";
import { LOW_STOCK_THRESHOLD } from "../../data/products";

interface ProductRowProps {
  product: Product;
  selected: boolean;
  onSelect: (id: number) => void;
  onAddStock: (id: number) => void;
  onRemoveStock: (id: number) => void;
  onRemove: (id: number) => void;
}

export default function ProductRow({
  product,
  selected,
  onSelect,
  onAddStock,
  onRemoveStock,
  onRemove,
}: ProductRowProps) {
  const isLow = product.stock < LOW_STOCK_THRESHOLD;

  return (
    <tr
      className="win95-row"
      data-selected={selected}
      onClick={() => onSelect(product.id)}
    >
      <td className="border-b border-[#c0c0c0] px-2 py-1">
        {String(product.id).padStart(2, "0")}
      </td>
      <td className="border-b border-[#c0c0c0] px-2 py-1">{product.name}</td>
      <td className="border-b border-[#c0c0c0] px-2 py-1">{product.stock}</td>
      <td
        className={
          isLow
            ? "win95-row__status win95-status--low border-b border-[#c0c0c0] px-2 py-1"
            : "win95-row__status border-b border-[#c0c0c0] px-2 py-1"
        }
      >
        {isLow ? "BAJO" : "OK"}
      </td>
      <td
        className="border-b border-[#c0c0c0] px-1 py-1"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-end gap-1">
          <button
            type="button"
            className="win95-button win95-button--small"
            title="Aumentar stock"
            onClick={() => onAddStock(product.id)}
          >
            +
          </button>
          <button
            type="button"
            className="win95-button win95-button--small"
            title="Disminuir stock"
            onClick={() => onRemoveStock(product.id)}
          >
            -
          </button>
          <button
            type="button"
            className="win95-button win95-button--small"
            title="Eliminar producto"
            onClick={() => onRemove(product.id)}
          >
            ✕
          </button>
        </div>
      </td>
    </tr>
  );
}
