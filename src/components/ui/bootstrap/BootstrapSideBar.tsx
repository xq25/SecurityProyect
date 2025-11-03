import React from "react";
import { Props } from "../SidebarGeneric";
import "../../../styles/Bootstrap/BootstrapSidebar.css";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUsers, FaShieldAlt, FaLock, FaBars, FaChevronLeft, FaQuestionCircle, FaReply} from "react-icons/fa";

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
    "Security Questions": <FaQuestionCircle className="me-2" />,
    Answers: <FaReply className="me-2" />,
  };
  
  const navigate = useNavigate();

  return (
    <>
      {/* Botón para abrir el sidebar */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="btn btn-success position-fixed top-0 start-0 m-3 shadow"
          style={{ zIndex: 1030 }}
        >
          <FaBars />
        </button>
      )}

      {/* Sidebar con Offcanvas de Bootstrap */}
      <div 
        className={`offcanvas offcanvas-start bg-success text-white ${sidebarOpen ? 'show' : ''}`}
        tabIndex={-1}
        style={{ visibility: sidebarOpen ? 'visible' : 'hidden', width: '260px' }}
      >
        {/* ✅ Encabezado con mejor espaciado */}
        <div className="offcanvas-header bg-dark border-bottom border-secondary">
          <h5 className="offcanvas-title fw-bold m-0">Menú Principal</h5>
          <button
            type="button"
            className="btn btn-sm btn-outline-light d-flex align-items-center justify-content-center"
            onClick={() => setSidebarOpen(false)}
            style={{ 
              padding: '0.4rem 0.6rem',
              minWidth: '32px',
              marginLeft: 'auto' // ✅ Empuja el botón a la derecha
            }}
          >
            <FaChevronLeft size={14} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="offcanvas-body p-0">
          <ul className="list-group list-group-flush">
            {items.map((item) => (
              <li
                key={item.label}
                className="list-group-item list-group-item-success border-0"
              >
                <button
                  onClick={() => {
                    navigate(item.path);
                  }}
                  className="btn btn-link text-white text-decoration-none w-100 text-start d-flex align-items-center"
                >
                  {item.icon ?? iconMap[item.label]}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};