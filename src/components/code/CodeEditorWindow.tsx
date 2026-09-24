const codeLines = [
  "function Product() {",
  "  return (",
  "    <div>",
  "      <h2>Teclado</h2>",
  "      <p>Stock: 10</p>",
  "    </div>",
  "  );",
  "}",
];

const menuItems = ["Archivo", "Editar", "Buscar"];

export default function CodeEditorWindow() {
  const numbered = codeLines
    .map((line, index) => `${String(index + 1).padStart(3, " ")}  ${line}`)
    .join("\n");

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="win95-window__menubar">
        {menuItems.map((item) => (
          <button key={item} type="button" className="win95-menubar__item">
            {item}
          </button>
        ))}
      </div>

      <pre className="win95-code m-0 flex-1">{numbered}</pre>

      <div className="win95-window__statusbar m-0">
        <span>01-jsx.js</span>
        <span>Solo lectura</span>
      </div>
    </div>
  );
}
