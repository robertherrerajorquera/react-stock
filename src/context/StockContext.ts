import { createContext, type Dispatch } from "react";
import type { Product } from "../data/products";

export interface StockState {
  products: Product[];
  selectedId: number | null;
  nextId: number;
}

export type StockAction =
  | { type: "ADD_PRODUCT"; payload: { name: string; stock: number } }
  | { type: "REMOVE_PRODUCT"; payload: number }
  | { type: "UPDATE_STOCK"; payload: { id: number; delta: number } }
  | { type: "SELECT_PRODUCT"; payload: number | null }
  | { type: "CLEAR_STOCK" };

export interface StockContextValue {
  state: StockState;
  dispatch: Dispatch<StockAction>;
}

export const StockContext = createContext<StockContextValue | null>(null);
