import { useWindowManager } from "../../hooks/useWindowManager";
import type { WindowId } from "../../context/WindowContext";

interface StartMenuProps {
  onClose: () => void;
}

const menuItems: { id: WindowId; icon: string; label: string }[] = [
  { id: "explorer", icon: "🗂️", label: "Explorador de lecciones" },
  { id: "tutorial", icon: "📖", label: "React Tutorial" },
  { id: "code", icon: "💻", label: "Code Editor" },
  { id: "stock", icon: "📦", label: "Stock Manager" },
  { id: "help", icon: "❓", label: "Ayuda" },
];

export default function StartMenu({ onClose }: StartMenuProps) {
  const { openWindow } = useWindowManager();

  const handleSelect = (id: WindowId) => {
    openWindow(id);
    onClose();
  };

  return (
    <div className="win95-start-menu">
      <div className="win95-start-menu__sidebar">React Stock Lab</div>
      <div className="win95-start-menu__items">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className="win95-menu-item"
            onClick={() => handleSelect(item.id)}
          >
            <span className="win95-menu-item__icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
        <div className="win95-menu-separator" />
        <button type="button" className="win95-menu-item" onClick={onClose}>
          <span className="win95-menu-item__icon">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              aria-hidden="true"
            >
              <path
                d="M3.4 3.2 A4.2 4.2 0 1 0 8.6 3.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M6 1.4 V5.6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          Apagar...
        </button>
      </div>
    </div>
  );
}
