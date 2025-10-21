import React from "react";
import { ButtonItem } from "../ButtonCRUDGeneric";

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
    actualizar: "btn-primary",
  };

  const normalizedName = name.toLowerCase();
  const bootstrapClass = buttonClassMap[normalizedName] || "btn-success";

  return (
    <button
      onClick={action}
      className={`btn btn-sm ${bootstrapClass} d-flex align-items-center gap-1`}
    >
      {icon && <span>{icon}</span>}
      {name}
    </button>
  );
};