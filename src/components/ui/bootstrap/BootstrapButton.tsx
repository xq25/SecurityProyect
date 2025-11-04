import React from "react";
import { ButtonItem } from "../ButtonGeneric";
import '../../../styles/Bootstrap/BootstrapButton.css'

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
    
    // ✅ Botones sociales
    google: "btn-social btn-google",
    microsoft: "btn-social btn-microsoft",
    github: "btn-social btn-github",
  };

  const normalizedName = name.toLowerCase();
  const bootstrapClass = buttonClassMap[normalizedName] || "btn-success";

  // ✅ Verificar si es un botón social
  const isSocialButton = ["google", "microsoft", "github"].includes(normalizedName);

  // ✅ Renderizado diferente para botones sociales
  if (isSocialButton) {
    return (
      <button
        onClick={action}
        className={`btn ${bootstrapClass}`}
        type="button"
      >
        {icon && <span className="btn-icon">{icon}</span>}
        <span>{name.toUpperCase()}</span>
      </button>
    );
  }

  // ✅ Renderizado normal para otros botones - SIEMPRE VISIBLE
  return (
    <button
      onClick={action}
      className={`btn btn-sm ${bootstrapClass}`}
      type="button"
    >
      <span>{name}</span> {/* ✅ Siempre visible, sin iconos */}
    </button>
  );
};