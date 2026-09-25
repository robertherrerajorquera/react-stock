export default function HelpWindow() {
  return (
    <div className="flex h-full flex-col gap-3">
      <h2 className="m-0 text-[13px] font-bold">React Stock Lab</h2>

      <p className="m-0">
        Aprende React construyendo un sistema de control de stock.
      </p>

      <p className="m-0">
        Cada lección del tutorial explica un concepto y te permite ver su
        resultado directamente en el Stock Manager.
      </p>

      <ul className="m-0 list-inside list-disc pl-4">
        <li>Doble clic en un icono: abre la ventana</li>
        <li>Arrastra la barra de título: mueve la ventana</li>
        <li>Arrastra desde una esquina: cambia el tamaño</li>
        <li>Botón _: minimiza (vuela a la barra de tareas)</li>
        <li>Botón □ : maximiza · Botón X : cierra</li>
      </ul>
    </div>
  );
}
