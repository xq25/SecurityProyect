// src/components/SideBar/AppSideBar.tsx
import { useUI } from '../../context/UIProvider';  //Aqui esta almacenado el estado de libreria actual.
// Aqui esta la carga de el estilos de SideBar
import { MaterialSideBar } from '../ui/materialUI/MaterialSideBar' 


//Esta interfaz marca las pautas de como deben ser los elementos del sideBar.
export interface SideBarItem {
  label: string; // Debe tener obligatoriamente un campo o nombre de la opcion.
  path?: string; // Puede tener una ruta (endpoint) al cual este ligado dicha opcion.
  icon?: React.ReactNode; // Puede tener un icono que acompañe el label
  onClick?: () => void; // Puede tener la opcion de al recibir un click hacer algo.
}

// Esta es la interface que define todo el SideBar
interface Props {
  items: SideBarItem[];   // Nuestro SideBar recibe un arreglo de varios items de SideBar (SideBarItem).
}

//Aqui esta definido todo nuestro componente
export const AppSideBar = ({ items }: Props) => { //Recibimos los items del sideBar de tipo Props
    const { library } = useUI(); //Accedemos a la libreria usada.

    const defaultItems: SideBarItem[] = [ //Definimos las opciones predeterminadas dentro de nuestro programa.
        { label: "Inicio", path: "/" },
        { label: "Usuarios", path: "/users" },
        { label: "Roles", path: "/roles" },
        { label: "Permisos", path: "/permissions" },
    ];

    const combinedItems = [...defaultItems, ...items];
    if (library === "material") return <MaterialSideBar items={combinedItems} />;  //Cargamos el sideBar respectivo usando la libreria seleccionada y los items previamente pasados
//   if (library === "bootstrap") return <BootstrapSideBar items={items} />;
//   return <TailwindSideBar items={items} />;
};
