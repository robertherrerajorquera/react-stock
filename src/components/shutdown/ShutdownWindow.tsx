import { useState } from "react";
import { useWindowManager } from "../../hooks/useWindowManager";

type Phase = "confirm" | "bye" | "blocked";

export default function ShutdownWindow() {
  const { closeWindow } = useWindowManager();
  const [phase, setPhase] = useState<Phase>("confirm");

  const handleYes = () => {
    window.close();
    setPhase("blocked");
  };

  if (phase === "confirm") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <div className="flex items-center gap-3">
          <span className="text-[26px]" aria-hidden="true">
            🖥️
          </span>
          <p className="m-0 text-left">
            ¿Seguro?
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="win95-button" onClick={handleYes}>
            Sí
          </button>
          <button
            type="button"
            className="win95-button"
            onClick={() => setPhase("bye")}
          >
            No
          </button>
        </div>
      </div>
    );
  }

  if (phase === "bye") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <p className="m-0">¡Qué bueno! :)</p>
        <button
          type="button"
          className="win95-button"
          onClick={() => closeWindow("shutdown")}
        >
          Cerrar
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <p className="m-0">
        disculpa no puedo cerrar la pestaña desde la web.
         Ciérrala con Ctrl+W o con la X de la pestaña.
      </p>
      <button
        type="button"
        className="win95-button"
        onClick={() => closeWindow("shutdown")}
      >
        Cerrar
      </button>
    </div>
  );
}
