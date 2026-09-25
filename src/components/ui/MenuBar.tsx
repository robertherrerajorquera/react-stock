import { useState } from "react";

export interface MenuItem {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  separator?: boolean;
}

export interface Menu {
  label: string;
  items: MenuItem[];
}

interface MenuBarProps {
  menus: Menu[];
}

export default function MenuBar({ menus }: MenuBarProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="win95-menubar">
      {openIndex !== null && (
        <div
          className="win95-menubar__backdrop"
          onClick={() => setOpenIndex(null)}
        />
      )}

      {menus.map((menu, index) => (
        <div
          key={menu.label}
          className="win95-menubar__menu"
          onMouseEnter={() => {
            if (openIndex !== null) setOpenIndex(index);
          }}
        >
          <button
            type="button"
            className="win95-menubar__item"
            data-open={openIndex === index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            {menu.label}
          </button>

          {openIndex === index && (
            <div className="win95-dropdown">
              {menu.items.map((item) =>
                item.separator ? (
                  <div key={`sep-${item.label}`} className="win95-menu-separator" />
                ) : (
                  <button
                    key={item.label}
                    type="button"
                    className="win95-menu-item"
                    disabled={item.disabled}
                    onClick={() => {
                      item.onClick?.();
                      setOpenIndex(null);
                    }}
                  >
                    {item.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
