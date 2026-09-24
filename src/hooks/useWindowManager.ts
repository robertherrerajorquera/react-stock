import { useContext } from "react";
import {
  WindowContext,
  type WindowContextValue,
} from "../context/WindowContext";

export function useWindowManager(): WindowContextValue {
  const context = useContext(WindowContext);

  if (context === null) {
    throw new Error("useWindowManager debe usarse dentro de <WindowProvider>");
  }

  return context;
}
