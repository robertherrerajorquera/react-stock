import { useEffect, useReducer, type ReactNode } from "react";
import { StockContext } from "./StockContext";
import {
  loadStockState,
  saveStockProducts,
  stockReducer,
} from "./stockReducer";

interface StockProviderProps {
  children: ReactNode;
}

export default function StockProvider({ children }: StockProviderProps) {
  const [state, dispatch] = useReducer(stockReducer, undefined, loadStockState);

  useEffect(() => {
    document.title = `Productos: ${state.products.length}`;
  }, [state.products]);

  useEffect(() => {
    saveStockProducts(state.products);
  }, [state.products]);

  return (
    <StockContext.Provider value={{ state, dispatch }}>
      {children}
    </StockContext.Provider>
  );
}
