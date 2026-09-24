import { useState, type ReactNode } from "react";
import { StockContext } from "./StockContext";
import { initialProducts, type Product } from "../data/products";

interface StockProviderProps {
  children: ReactNode;
}

export default function StockProvider({ children }: StockProviderProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  return (
    <StockContext.Provider value={{ products, setProducts }}>
      {children}
    </StockContext.Provider>
  );
}
