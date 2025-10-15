import React from "react";
import { headerItem } from '../HeaderGeneric';
import { useUI } from "../../../context/UIProvider";
import "../../../styles/TailwindHeader/TalwindHeader.css";

interface TailwindHeaderProps {
  items: headerItem[];
}

export const TailwindHeader: React.FC<TailwindHeaderProps> = ({ items }) => {
  const { library } = useUI();

  return (
    <header className="tailwind-header" role="banner">
      <div className="tailwind-header-container">
        <div className="tailwind-header-inner">
          {/* 🏷️ Título */}
          <h1 className="tailwind-header-title">Security Project</h1>

          {/* 🎨 Botones de librerías */}
          <div className="tailwind-button-group">
            {items.map((item) => {
              const isActive = library === item.name;
              const isTailwind = item.name === "tailwind";
              return (
                <div key={item.name} className="tailwind-button-wrap">
                  <button
                    onClick={item.onClick}
                    className={`tailwind-button ${isActive ? "active" : ""} ${isTailwind ? "is-tailwind" : ""}`}
                    aria-label={`Cambiar a ${item.label}`}
                    aria-pressed={isActive}
                  >
                    <span className="tailwind-button-icon">{item.icon}</span>
                  </button>

                  {/* Tooltip */}
                  <div className="tailwind-tooltip">Cambiar a {item.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};