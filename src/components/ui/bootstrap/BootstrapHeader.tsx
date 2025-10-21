import React from "react";
import { headerItem } from '../HeaderGeneric';
import '../../../styles/Bootstrap/BootstrapHeader.css';
import { useUI } from "../../../context/UIProvider";

interface BootstrapHeaderProps {
  items: headerItem[];
}

export const BootstrapHeader: React.FC<BootstrapHeaderProps> = ({ items }) => {
  const { library } = useUI();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
      <div className="container-fluid">
        {/* Título */}
        <span className="navbar-brand fw-bold text-uppercase ms-5">Security Project</span>

        {/* Botones de librerías */}
        <div className="d-flex gap-2">
          {items.map((item) => (
            <button
              key={item.name}
              onClick={item.onClick}
              className={`btn btn-sm ${
                library === item.name ? "btn-light text-success" : "btn-outline-light"
              }`}
              title={`Cambiar a ${item.label}`}
            >
              {item.icon}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};