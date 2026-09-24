import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Product } from "../data/products";

export interface StockContextValue {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
}

export const StockContext = createContext<StockContextValue | null>(null);
