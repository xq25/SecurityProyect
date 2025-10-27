import React from "react";
import { useUI } from "../../context/UIProvider";
import { BootstrapActionButton } from "./bootstrap/BootstrapActionButton";
// import { MaterialActionButton } from "./material/MaterialActionButton";

// 🔹 Estructura de un botón de acción reutilizable
export interface ActionButtonItem {
  text: string;                // Texto visible del botón
  onClick: () => void;         // Acción ejecutada al hacer clic
  icon?: React.ReactNode;      // Icono opcional
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
  size?: "small" | "medium" | "large";
}

// 🔹 Botón de acción genérico que adapta su diseño según la librería
export const AppActionButton: React.FC<ActionButtonItem> = ({ 
  text, 
  onClick, 
  icon, 
  variant = "success",
  size = "medium" 
}) => {
  const { library } = useUI();

  //if (library === "material")
  //  return <MaterialActionButton text={text} onClick={onClick} icon={icon} variant={variant} size={size} />;
  
  if (library === "bootstrap")
    return <BootstrapActionButton text={text} onClick={onClick} icon={icon} variant={variant} size={size} />;

  return null;
};