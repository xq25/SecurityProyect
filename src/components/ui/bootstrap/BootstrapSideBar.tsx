import React from "react";
import { Props } from "../SidebarGeneric";
import "../../../styles/Bootstrap/BootstrapSidebar.css";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUsers, FaShieldAlt, FaLock, FaBars, FaChevronLeft } from "react-icons/fa";

export const BootstrapSideBar: React.FC<Props> = ({
  items = [],
  sidebarOpen,
  setSidebarOpen,
}) => {
  const iconMap: Record<string, React.ReactNode> = {
    Inicio: <FaHome className="me-2" />,
    Usuarios: <FaUsers className="me-2" />,
    Roles: <FaShieldAlt className="me-2" />,
    Permissions: <FaLock className="me-2" />,
  };
  
  const navigate = useNavigate();

  return (
    <>
      {/* Botón para abrir el sidebar */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="btn btn-success bootstrap-sidebar-toggle"
        >
          <FaBars />
        </button>
      )}

      {/* Sidebar */}
      <div className={`bootstrap-sidebar bg-success ${sidebarOpen ? "open" : ""}`}>
        {/* Encabezado */}
        <div className="sidebar-header d-flex justify-content-between align-items-center p-3 bg-dark text-white">
          <h5 className="m-0">Menú Principal</h5>
          <button
            onClick={() => setSidebarOpen(false)}
            className="btn btn-sm btn-outline-light"
          >
            <FaChevronLeft />
          </button>
        </div>

        <hr className="bg-light" />

        {/* Lista de opciones */}
        <ul className="list-group list-group-flush">
          {items.map((item) => (
            <li
              key={item.label}
              className="list-group-item list-group-item-success border-0"
            >
              <button
                onClick={() => navigate(item.path)}
                className="btn btn-link text-white text-decoration-none w-100 text-start"
              >
                {item.icon ?? iconMap[item.label]}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay cuando está abierto */}
      {sidebarOpen && (
        <div
          className="bootstrap-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};