import React from "react";
import "../../../styles/Bootstrap/BootstrapButtonCRUD.css";
import { ButtonItem } from "../ButtonCRUDGeneric";

export const BootstrapButton: React.FC<ButtonItem> = ({
  name = "Acción",
  action = () => {},
  icon,
}) => {
  // Mapeo de nombres a clases de Bootstrap
  const buttonClassMap: Record<string, string> = {
    crear: "btn-success",
    editar: "btn-warning",
    eliminar: "btn-danger",
    ver: "btn-info",
    actualizar: "btn-primary",
  };

  const normalizedName = name.toLowerCase();
  const bootstrapClass = buttonClassMap[normalizedName] || "btn-success";

  return (
    <button
      onClick={action}
      className={`btn ${bootstrapClass} bootstrap-button`}
    >
      {icon && <span className="me-1">{icon}</span>}
      {name}
    </button>
  );
};