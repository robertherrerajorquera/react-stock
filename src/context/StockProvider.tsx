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
    saveStockProducts(state.products);
  }, [state.products]);

  return (
    <StockContext.Provider value={{ state, dispatch }}>
      {children}
    </StockContext.Provider>
  );
}
