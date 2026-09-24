import { useEffect, useReducer, type ReactNode } from "react";
import {
  StockContext,
  type StockAction,
  type StockState,
} from "./StockContext";
import { initialProducts } from "../data/products";

interface StockProviderProps {
  children: ReactNode;
}

const initialState: StockState = {
  products: initialProducts,
  selectedId: null,
  nextId: 4,
};

function stockReducer(state: StockState, action: StockAction): StockState {
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

export default function StockProvider({ children }: StockProviderProps) {
  const [state, dispatch] = useReducer(stockReducer, initialState);

  useEffect(() => {
    document.title = `Productos: ${state.products.length}`;
  }, [state.products]);

  return (
    <StockContext.Provider value={{ state, dispatch }}>
      {children}
    </StockContext.Provider>
  );
}
