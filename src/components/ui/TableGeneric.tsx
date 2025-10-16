import React from "react";
import { useUI } from "../../context/UIProvider";
import { MaterialTable } from "./materialUI/MaterialTable";



export interface Props {
  name?: string;
  header?: string[];
  items?: Object[] | []; // Para cada contenido dentro de nuestras filas esta divido por un contentRow en el cual esta la lista con los datos de la fila
}

export const AppTable: React.FC<Props> = ({name ,header, items}) => {
  const { library } = useUI();

  if (library === 'material') return <MaterialTable name={name} header={header} items={items} />;

  return null;
};
