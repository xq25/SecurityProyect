import React from "react";
import { headerItem } from '../HeaderGeneric';
import '../../../styles/Bootstrap/BootstrapHeader.css';
import { useUI } from "../../../context/UIProvider";

interface BootstrapHeaderProps {
  items: headerItem[];
  userDropdown?: React.ReactNode;
  onToggleSidebar?: () => void; // ✅ Prop para toggle del sidebar
}

export const BootstrapHeader: React.FC<BootstrapHeaderProps> = ({ 
  items, 
  userDropdown,
  onToggleSidebar 
}) => {
  const { library } = useUI();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
      <div className="container-fluid">
        {/* ✅ Botón de menú + Nombre del proyecto (izquierda) */}
        <div className="d-flex align-items-center gap-2">
          {onToggleSidebar && (
            <button 
              className="btn-menu"
              onClick={onToggleSidebar}
              title="Toggle Sidebar"
            >
              <i className="bi bi-list"></i>
            </button>
          )}
          <span className="navbar-brand mb-0 h1">SECURITY PROJECT</span>
        </div>

        {/* ✅ Botones centrados con estética original */}
        <div className="d-flex justify-content-center align-items-center flex-grow-1">
          <div className="d-flex gap-3 align-items-center">
            {items.map((item) => (
              <button
                key={item.name}
                onClick={item.onClick}
                className={`btn-library ${
                  library === item.name ? "active" : ""
                }`}
                title={`Cambiar a ${item.label}`}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>

        {/* ✅ Dropdown de usuario a la derecha */}
        {userDropdown && <div className="ms-3">{userDropdown}</div>}
      </div>
    </nav>
  );
};