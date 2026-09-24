import { useWindowManager } from "../../hooks/useWindowManager";

const code = `function Product() {
  return (
    <div>
      <h2>Teclado</h2>
      <p>Stock: 10</p>
    </div>
  );
}`;

export default function TutorialWindow() {
  const { openWindow } = useWindowManager();

  return (
    <div className="flex h-full flex-col gap-3">
      <h2 className="m-0 text-[13px] font-bold">¿Qué es JSX?</h2>

      <p className="m-0">
        JSX permite escribir una sintaxis parecida a HTML dentro de
        JavaScript. React transforma estas etiquetas en llamadas a
        funciones que crean elementos de la interfaz.
      </p>

      <pre className="win95-code m-0">{code}</pre>

      <div>
        <p className="m-0 mb-1 font-bold">Resultado</p>
        <button
          type="button"
          className="win95-button"
          onClick={() => openWindow("stock")}
        >
          Abrir Stock Manager
        </button>
      </div>

      <div className="mt-auto flex items-center justify-between">
        <button type="button" className="win95-button" disabled>
          ← Anterior
        </button>
        <span className="text-[11px]">Lección 1 de 14</span>
        <button type="button" className="win95-button">
          Siguiente →
        </button>
      </div>
    </div>
  );
}
