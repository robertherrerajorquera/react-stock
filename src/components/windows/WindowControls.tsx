interface WindowControlsProps {
  maximized: boolean;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onClose: () => void;
}

export default function WindowControls({
  maximized,
  onMinimize,
  onToggleMaximize,
  onClose,
}: WindowControlsProps) {
  return (
    <div className="win95-titlebar__controls">
      <button
        type="button"
        className="win95-control"
        title="Minimizar"
        onClick={onMinimize}
      >
        _
      </button>
      <button
        type="button"
        className="win95-control"
        title={maximized ? "Restaurar" : "Maximizar"}
        onClick={onToggleMaximize}
      >
        {maximized ? "❐" : "□"}
      </button>
      <button
        type="button"
        className="win95-control"
        title="Cerrar"
        onClick={onClose}
      >
        X
      </button>
    </div>
  );
}
