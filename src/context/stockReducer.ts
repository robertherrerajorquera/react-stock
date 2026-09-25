import { initialProducts, type Product } from "../data/products";
import type { StockAction, StockState } from "./StockContext";

const STORAGE_KEY = "react-stock-lab:products";

export const initialStockState: StockState = {
  products: initialProducts,
  selectedId: null,
  nextId: 4,
};

export function stockReducer(
  state: StockState,
  action: StockAction
): StockState {
  switch (action.type) {
    case "ADD_PRODUCT":
      return {
        ...state,
        products: [
          ...state.products,
          {
            id: state.nextId,
            name: action.payload.name,
            stock: action.payload.stock,
          },
        ],
        nextId: state.nextId + 1,
      };

    case "REMOVE_PRODUCT":
      return {
        ...state,
        products: state.products.filter(
          (product) => product.id !== action.payload
        ),
        selectedId:
          state.selectedId === action.payload ? null : state.selectedId,
      };

    case "UPDATE_STOCK":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id
            ? {
                ...product,
                stock: Math.max(0, product.stock + action.payload.delta),
              }
            : product
        ),
      };

    case "SELECT_PRODUCT":
      return { ...state, selectedId: action.payload };

    case "CLEAR_STOCK":
      return { ...state, products: [], selectedId: null };

    default:
      return state;
  }
}

const isProduct = (value: unknown): value is Product =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as Product).id === "number" &&
  typeof (value as Product).name === "string" &&
  typeof (value as Product).stock === "number";

export function loadStockState(): StockState {
  if (typeof localStorage === "undefined") return initialStockState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return initialStockState;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return initialStockState;

    const products = parsed.filter(isProduct);
    if (products.length !== parsed.length) return initialStockState;

    const nextId = products.reduce(
      (max, product) => Math.max(max, product.id + 1),
      4
    );
    return { products, selectedId: null, nextId };
  } catch {
    return initialStockState;
  }
}

export function saveStockProducts(products: Product[]): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    // Sin almacenamiento disponible: la app sigue funcionando en memoria.
  }
}
