import React from "react";
import { useUI } from "../../context/UIProvider";
import { MaterialButton } from "./materialUI/MaterialButton";

// 🔹 Estructura de un botón reutilizable
export interface ButtonItem {
  name: string;                // Nombre visible del botón
  item?: any;                  // Objeto (ej: usuario) sobre el cual actúa
  action?: (item: any) => void; // Acción ejecutada al hacer clic
  icon? : React.ReactNode;
}

// 🔹 Botón genérico que adapta su diseño según la librería actual (Material, Bootstrap, etc.)
export const AppButton: React.FC<ButtonItem> = ({ name, action, item, icon }) => {
  const { library } = useUI();

  // Solo usamos Material por ahora
  if (library === "material")
    return <MaterialButton name={name} action={() => action?.(item)} icon = {icon} />;

  return null;
};
