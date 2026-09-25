import { BrowserRouter, Route, Routes } from "react-router-dom";
import WindowProvider from "./context/WindowProvider";
import StockProvider from "./context/StockProvider";
import Desktop from "./components/desktop/Desktop";

export default function App() {
  return (
    <BrowserRouter>
      <WindowProvider>
        <StockProvider>
          <Routes>
            <Route path="/" element={<Desktop />} />
            <Route path="/leccion/:slug" element={<Desktop />} />
          </Routes>
        </StockProvider>
      </WindowProvider>
    </BrowserRouter>
  );
}
