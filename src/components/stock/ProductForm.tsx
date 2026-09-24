import { useContext, useState, type FormEvent } from "react";
import { StockContext } from "../../context/StockContext";

interface ProductFormProps {
  onDone: () => void;
}

export default function ProductForm({ onDone }: ProductFormProps) {
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");

  const context = useContext(StockContext);

  if (context === null) {
    throw new Error("ProductForm debe estar dentro de <StockProvider>");
  }

  const { dispatch } = context;
  const isValid = name.trim() !== "" && stock.trim() !== "";

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isValid) return;

    dispatch({
      type: "ADD_PRODUCT",
      payload: {
        name: name.trim(),
        stock: Math.max(0, Math.floor(Number(stock))),
      },
    });

    setName("");
    setStock("");
  };

  return (
    <form onSubmit={handleSubmit} className="win95-raised flex flex-col gap-2 p-2">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-1 text-xs">
          Producto:
          <input
            type="text"
            className="win95-input w-40"
            value={name}
            placeholder="Webcam"
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label className="flex items-center gap-1 text-xs">
          Stock:
          <input
            type="number"
            min={0}
            className="win95-input w-20"
            value={stock}
            placeholder="8"
            onChange={(event) => setStock(event.target.value)}
          />
        </label>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="win95-button" disabled={!isValid}>
          Agregar
        </button>
        <button type="button" className="win95-button" onClick={onDone}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
