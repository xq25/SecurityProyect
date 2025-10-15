import React from "react";
import { useUI } from "../../context/UIProvider";  // Importamos el contexto de la librearia a utilizar.
import { SiMui, SiTailwindcss, SiBootstrap } from "react-icons/si"; //cargamos los iconos proporcionados por react-icons para colocarlos en el header
//Carga de los estilos especificos de los headers segun la libreria

import { MaterialHeader } from "../ui/materialUI/MaterialHeader";

//Definimos que debe contener los items dentro de nuestro header
export interface headerItem{ 
    name : string;
    label? : string;
    icon?: React.ReactNode; //Aqui debe estar el icono de las librerias de estilos.
    onClick : () => void;  //onClick para cada libreria debe cambiar es tema general de estilos de libreria 
}

export const AppHeader = () => { //Esta vez lo vamos a usar unicamente con los defaultItems, por lo tanto no recibimos Props.
    const { library, setLibrary } = useUI(); //Extraemos la variable reactiva de useIU() para modificar en general.

    const defaultItems : headerItem[] = [
        { name: "tailwind", label: "Tailwind", icon: <SiTailwindcss />, onClick : () => setLibrary('tailwind') },
        { name: "material", label: "Material UI", icon: <SiMui />, onClick : () => setLibrary('material') },
        { name: "bootstrap", label: "Bootstrap", icon: <SiBootstrap />, onClick : () => setLibrary('bootstrap')},
    ]


    if (library === "material") return <MaterialHeader items={defaultItems}/>    
//     if (library === "bootstrap") return <BootstrapHeader {defaultItems} />;
//     return <TailwindHeader {defaultItems} />;
};
