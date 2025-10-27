// src/components/SideBar/AppSideBar.tsx
import { useUI } from '../../context/UIProvider';  //Aqui esta almacenado el estado de libreria actual.
// Aqui esta la carga de el estilos de SideBar.
import { BootstrapSideBar } from '../ui/bootstrap/BootstrapSideBar';
import { MaterialSideBar } from '../ui/materialUI/MaterialSideBar'; 
import { TailwindSideBar } from '../ui/tailwind/TailwindSideBar';
import {RootState} from '../../store/store';
import { useSelector } from 'react-redux';


// import { useSelector } from "react-redux";
// import { RootState } from "../../store/store";


//Esta interfaz marca las pautas de como deben ser los elementos del sideBar.
export interface SideBarItem {
  label: string; // Debe tener obligatoriamente un campo o nombre de la opcion.
  path: string; // Puede tener una ruta (endpoint) al cual este ligado dicha opcion.
  icon?: React.ReactNode; // Puede tener un icono que acompañe el label
  onClick?: () => void; // Puede tener la opcion de al recibir un click hacer algo.
}

// Esta es la interface que define todo el SideBar
export interface Props {
  items?: SideBarItem[];   // Nuestro SideBar puede recibir un arreglo de varios items de SideBar (SideBarItem). En este caso no lo usaremos ya que por defecto vamos a pasar los defualtItems
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

//Aqui esta definido todo nuestro componente
export const AppSideBar = ({ items = [], sidebarOpen, setSidebarOpen }: Props) => { //Recibimos los items del sideBar de tipo Props
    const { library } = useUI(); //Accedemos a la libreria usada.
    const user = useSelector((state: RootState) => state.user.user); //Guardamos si tenemos un usuario logueado.

    const defaultItems: SideBarItem[] = [ //Definimos las opciones predeterminadas dentro de nuestro programa.
        { label: "Inicio", path: "/" },
        { label: "Usuarios", path: "/users/list"},
        { label: "Roles", path: "/roles/list" },
        { label: "Permissions", path: "/permissions" },
    ];

    const combinedItems = [...defaultItems, ...items];
    if (user){
      if (library === "material") return <MaterialSideBar items={combinedItems} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>;  //Cargamos el sideBar respectivo usando la libreria seleccionada y los items previamente pasados
      if (library === "tailwind") return <TailwindSideBar items={combinedItems} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>;
      if (library === "bootstrap") return <BootstrapSideBar items={combinedItems} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>;
    }
    return <div></div>;
};
