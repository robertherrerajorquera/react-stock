import WindowProvider from "./context/WindowProvider";
import StockProvider from "./context/StockProvider";
import Desktop from "./components/desktop/Desktop";

export default function App() {
  return (
    <WindowProvider>
      <StockProvider>
        <Desktop />
      </StockProvider>
    </WindowProvider>
  );
}
