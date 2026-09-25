import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import StockProvider from "../../context/StockProvider";
import StockWindow from "./StockWindow";

const renderWindow = () =>
  render(
    <StockProvider>
      <StockWindow />
    </StockProvider>
  );

describe("StockWindow", () => {
  beforeEach(() => {
    localStorage.clear();
    document.title = "";
  });

  it("muestra los productos iniciales, alertas y el total", () => {
    renderWindow();

    expect(screen.getByText("Teclado")).toBeInTheDocument();
    expect(screen.getByText("Monitor")).toBeInTheDocument();
    expect(screen.getByText(/Stock bajo:/)).toBeInTheDocument();
    expect(document.title).toBe("Productos: 3");
  });

  it("agrega un producto desde el formulario", async () => {
    const user = userEvent.setup();
    renderWindow();

    await user.click(screen.getAllByRole("button", { name: "Nuevo producto" })[0]);
    await user.type(screen.getByPlaceholderText("Webcam"), "Webcam");
    await user.type(screen.getByPlaceholderText("8"), "4");
    await user.click(screen.getByRole("button", { name: "Agregar" }));

    expect(screen.getByText("Webcam")).toBeInTheDocument();
    expect(document.title).toBe("Productos: 4");
  });

  it("vaciar stock deja la tabla vacía", async () => {
    const user = userEvent.setup();
    renderWindow();

    await user.click(screen.getByRole("button", { name: "Vaciar" }));

    expect(screen.getByText(/No hay productos/)).toBeInTheDocument();
    expect(screen.queryByText("Teclado")).not.toBeInTheDocument();
    expect(document.title).toBe("Productos: 0");
  });
});
