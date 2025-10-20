import React from "react";
import { useUI } from "../../context/UIProvider";
import { MaterialTable } from "./materialUI/MaterialTable";
import { TailwindTable } from "./tailwind/TailwindTable";

// 🔹 Interfaz que define la estructura esperada de los props
export interface Props {
  name?: string;               // Nombre descriptivo de la tabla
  header?: string[];           // Cabecera con nombres de columnas
  items?: Object[] | [];       // Lista de objetos que representan las filas
  options?: React.ReactElement[] | []; // Componentes React (botones, íconos, etc.) para cada fila
}

// 🔹 Este componente actúa como puente genérico entre la UI y las tablas específicas
export const AppTable: React.FC<Props> = ({ name, header, items, options }) => {
  const { library } = useUI();

  // Por ahora solo usamos la versión Material Design
  if (library === "material")
    return <MaterialTable name={name} header={header} items={items} options={options} />;

  if (library === "tailwind")
    return <TailwindTable name={name} header={header} items={items} options={options} />;

  return null;
};
