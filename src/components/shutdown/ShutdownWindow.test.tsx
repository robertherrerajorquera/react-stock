import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import WindowProvider from "../../context/WindowProvider";
import ShutdownWindow from "./ShutdownWindow";

const renderShutdown = () =>
  render(
    <WindowProvider>
      <ShutdownWindow />
    </WindowProvider>
  );

describe("ShutdownWindow", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("pregunta si se quiere apagar con botones Sí y No", () => {
    renderShutdown();
    expect(
      screen.getByText("¿Seguro?")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sí" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "No" })).toBeInTheDocument();
  });

  it("al pulsar Sí intenta cerrar la página", async () => {
    const close = vi.spyOn(window, "close").mockImplementation(() => {});
    const user = userEvent.setup();
    renderShutdown();

    await user.click(screen.getByRole("button", { name: "Sí" }));

    expect(close).toHaveBeenCalledTimes(1);
  });

  it("al pulsar No muestra el mensaje y el botón Cerrar", async () => {
    const user = userEvent.setup();
    renderShutdown();

    await user.click(screen.getByRole("button", { name: "No" }));

    expect(screen.getByText("¡Qué bueno! :)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cerrar" })).toBeInTheDocument();
  });
});
