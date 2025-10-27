import React from "react";
import { Props } from "../SidebarGeneric";
import { useNavigate } from "react-router-dom";
import "../../../styles/Tailwind/TailwindSidebar.css";

// Iconos para el menú
import { 
  FaHome, 
  FaUsers, 
  FaShieldAlt, 
  FaLock, 
  FaBars, 
  FaChevronLeft 
} from "react-icons/fa";

export const TailwindSideBar: React.FC<Props> = ({
  items = [],
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navigate = useNavigate();
  
  // Mapa de iconos para cada opción del menú
  const iconMap: Record<string, React.ReactNode> = {
    Inicio: <FaHome className="w-5 h-5" />,
    Usuarios: <FaUsers className="w-5 h-5" />,
    Roles: <FaShieldAlt className="w-5 h-5" />,
    Permissions: <FaLock className="w-5 h-5" />,
  };

  return (
    <>
      {/* Botón para abrir el sidebar cuando está cerrado */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="tailwind-sidebar-toggle-btn"
          aria-label="Abrir menú"
        >
          <FaBars className="w-6 h-6" />
        </button>
      )}

      {/* El sidebar */}
      <aside 
        className={`tailwind-sidebar ${sidebarOpen ? "open" : ""}`}
        aria-hidden={!sidebarOpen}
      >
        {/* Encabezado del sidebar */}
        <div className="tailwind-sidebar-header">
          <h2 className="tailwind-sidebar-title">Menú Principal</h2>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="tailwind-sidebar-close-btn"
            aria-label="Cerrar menú"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Línea divisoria */}
        <div className="tailwind-sidebar-divider"></div>

        {/* Lista de opciones del menú */}
        <nav className="tailwind-sidebar-nav">
          <ul className="tailwind-sidebar-list">
            {items.map((item) => (
              <li key={item.label} className="tailwind-sidebar-item">
                <button
                  className="tailwind-sidebar-button"
                  onClick={() => navigate(item.path)}
                >
                  <span className="tailwind-sidebar-icon">
                    {item.icon ?? iconMap[item.label]}
                  </span>
                  <span className="tailwind-sidebar-text">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};