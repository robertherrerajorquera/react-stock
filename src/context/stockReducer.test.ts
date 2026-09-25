import { beforeEach, describe, expect, it } from "vitest";
import { initialProducts } from "../data/products";
import type { StockAction } from "./StockContext";
import {
  initialStockState,
  loadStockState,
  saveStockProducts,
  stockReducer,
} from "./stockReducer";

const STORAGE_KEY = "react-stock-lab:products";

describe("stockReducer", () => {
  it("ADD_PRODUCT agrega con id asignado y sube nextId", () => {
    const next = stockReducer(initialStockState, {
      type: "ADD_PRODUCT",
      payload: { name: "Teclado", stock: 3 },
    });

    expect(next.products).toHaveLength(initialProducts.length + 1);
    expect(next.products.at(-1)).toEqual({
      id: initialStockState.nextId,
      name: "Teclado",
      stock: 3,
    });
    expect(next.nextId).toBe(initialStockState.nextId + 1);
  });

  it("REMOVE_PRODUCT borra el producto y limpia la selección", () => {
    const selected = {
      ...initialStockState,
      selectedId: initialProducts[0].id,
    };
    const next = stockReducer(selected, {
      type: "REMOVE_PRODUCT",
      payload: initialProducts[0].id,
    });

    expect(
      next.products.find((product) => product.id === initialProducts[0].id)
    ).toBeUndefined();
    expect(next.selectedId).toBeNull();
  });

  it("UPDATE_STOCK suma y resta sin bajar de 0", () => {
    const down = stockReducer(initialStockState, {
      type: "UPDATE_STOCK",
      payload: { id: 3, delta: -1 },
    });
    expect(down.products.find((p) => p.id === 3)?.stock).toBe(1);

    const floor = stockReducer(down, {
      type: "UPDATE_STOCK",
      payload: { id: 3, delta: -5 },
    });
    expect(floor.products.find((p) => p.id === 3)?.stock).toBe(0);
  });

  it("CLEAR_STOCK deja la lista vacía", () => {
    const next = stockReducer(
      { ...initialStockState, selectedId: 2 },
      { type: "CLEAR_STOCK" }
    );

    expect(next.products).toEqual([]);
    expect(next.selectedId).toBeNull();
  });

  it("acción desconocida devuelve el mismo estado", () => {
    const next = stockReducer(initialStockState, {
      type: "NO_EXISTE",
    } as unknown as StockAction);
    expect(next).toBe(initialStockState);
  });
});

describe("persistencia en localStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("sin datos guardados usa los productos iniciales", () => {
    expect(loadStockState()).toEqual(initialStockState);
  });

  it("guarda y recarga los productos con nextId derivado", () => {
    saveStockProducts([
      { id: 7, name: "Webcam", stock: 2 },
      { id: 3, name: "Monitor", stock: 5 },
    ]);

    const state = loadStockState();
    expect(state.products).toHaveLength(2);
    expect(state.nextId).toBe(8);
    expect(state.selectedId).toBeNull();
  });

  it("JSON inválido cae en el estado inicial", () => {
    localStorage.setItem(STORAGE_KEY, "{no es json");
    expect(loadStockState()).toEqual(initialStockState);
  });

  it("array con elementos corruptos cae en el estado inicial", () => {
    localStorage.setItem(
      STORAGE_KEY,
      '[{"id":"x","name":null,"stock":"muchos"}]'
    );
    expect(loadStockState()).toEqual(initialStockState);
  });

  it("array vacío es un estado válido (stock vaciado a propósito)", () => {
    localStorage.setItem(STORAGE_KEY, "[]");
    expect(loadStockState().products).toEqual([]);
    expect(loadStockState().nextId).toBe(4);
  });
});
