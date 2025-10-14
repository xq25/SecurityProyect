// src/context/UIProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
// createContext : función de React para crear un contexto (zona global de estado accesible desde componentes hijos -> children).
// useContext : hook que permite consumir un contexto dentro de un componente funcional.
// useState : hook para estado local (aquí guarda la librería UI seleccionada). 
// ReactNode : tipo TypeScript que representa cualquier contenido renderizable por React (strings, JSX, arrays, fragments, etc.), lo usamos para tipar children.

type UILibrary = "tailwind" | "material" | "bootstrap"; //Marcamos el margen de las librerias que vamos a usar para este proyecto.

interface UIContextType {
  library: UILibrary;  //Definimos que el valor library de la interface solo puede estar entre los valores de UILibrary.
  setLibrary: (lib: UILibrary) => void;  // Aqui se realiza el cambio de libreria (Unicamente recibe valores comprendidos en UILibrary) y no devolvemos nada. Solo hacemos el cambio
}

//IUContext es el que almacena toda la informacion de la librearia que estamos usando.
const UIContext = createContext<UIContextType | null>(null);  //Asignamos que el contexto trasmitido a los componentes hijos va a ser de tipo (UIContextType) o null.

//El UIProvider es la fuente de verdad global que guarda cuál librería de estilos está activa, y la comparte con todos los componentes hijos que usen el contexto.
export const UIProvider = ({ children }: { children: ReactNode }) => {  //Declaramos y exportamos el provedor de librerias. recibe un hijo que es a lo que se le van a generar los respectivos cambios dependinedo de la libreria (componentes).
  //Variable atomica library
    const [library, setLibrary] = useState<UILibrary>("material");
  // ^ Tambien indicamos que el useState es de tipo UILibrary y que su valor inicial o por defecto es material. Basicamente inicializamos la librearia general como tailwind.
  
  return ( // Generamos un estado local library y usamos setLibrary para generar el cambio de la libreria.
    //.provider permite hacer accesible el valor de la libreria a todos los hijos (children).
    //children es el componente o pagina a renderizar que va a tener acceso al valor de la libreria.
    <UIContext.Provider value={{ library, setLibrary }}> 
      {children}
    </UIContext.Provider>
  );
};

// Un hook es una función especial que React me da (o que yo puedo crear) para manejar cosas como el estado, efectos, o contexto dentro de componentes funcionales, sin necesidad de usar clases.
export const useUI = () => useContext(UIContext)!; // define y exporta un hook personalizado llamado useUI para facilitar el consumo del contexto en componentes.
