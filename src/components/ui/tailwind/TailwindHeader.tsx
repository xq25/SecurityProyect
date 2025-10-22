import React from "react";
import { headerItem } from '../HeaderGeneric';
import { useUI } from "../../../context/UIProvider";
import "../../../styles/Tailwind/TalwindHeader.css";

interface TailwindHeaderProps {
  items: headerItem[];
  userDropdown?: React.ReactNode,
}

export const TailwindHeader: React.FC<TailwindHeaderProps> = ({ items, userDropdown}) => {
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
          {/* User Dropdown - Reemplazando Box con div */}
          {userDropdown && <div className="tailwind-user-dropdown">{userDropdown}</div>}
        </div>
      </div>
    </header>
  );
};