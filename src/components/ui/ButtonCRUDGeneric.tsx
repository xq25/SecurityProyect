import React from "react";
import { useUI } from "../../context/UIProvider";
import { MaterialButton } from "./materialUI/MaterialButtonCRUD";
import { TailwindButton } from "./tailwind/TailwindButtonCRUD";

// 🔹 Estructura de un botón reutilizable
export interface ButtonItem {
  name: string;                // Nombre visible del botón
  item?: any;                  // Objeto (ej: usuario) sobre el cual actúa
  action?: (item: any) => void; // Acción ejecutada al hacer clic
}

// 🔹 Botón genérico que adapta su diseño según la librería actual (Material, Bootstrap, etc.)
export const AppButton: React.FC<ButtonItem> = ({ name, action, item }) => {
  const { library } = useUI();

  // Solo usamos Material por ahora
  if (library === "material")
    return <MaterialButton name={name} action={() => action?.(item)} />;

  if (library === "tailwind")
    return <TailwindButton name={name} action={() => action?.(item)} />;

  return null;
};
