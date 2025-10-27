import React from "react";
import { ButtonItem } from "../ButtonGeneric";

export const BootstrapButton: React.FC<ButtonItem> = ({
  name = "Acción",
  action = () => {},
  icon,
}) => {
  // Mapeo de nombres a clases de Bootstrap
  const buttonClassMap: Record<string, string> = {
    crear: "btn-success",
    editar: "btn-warning text-white",
    eliminar: "btn-danger",
    ver: "btn-info text-white",
    view: "btn-info text-white",
    actualizar: "btn-primary",
    update: "btn-warning text-white",
    delete: "btn-danger",
    profile: "btn-primary",
    address: "btn-secondary",
    devices: "btn-success",
    passwords: "btn-warning text-white",
    sessions: "btn-info text-white",
    answers: "btn-primary", 
    signatures: "btn-dark",
  };

  const normalizedName = name.toLowerCase();
  const bootstrapClass = buttonClassMap[normalizedName] || "btn-success";

  return (
    <button
      onClick={action}
      className={`btn btn-sm ${bootstrapClass} d-flex align-items-center gap-1`}
    >
      {icon && <span>{icon}</span>}
      <span className="d-none d-lg-inline">{name}</span>
    </button>
  );
};