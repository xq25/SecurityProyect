import React, { useState, useEffect } from "react";
import PropertyComponent from "../components/Property";
const Demo: React.FC = () => {

    useEffect(() => {
        console.log("Componente montado");
        return () => {
            console.log("Componente desmontado");
        };
    }, []);

    //Este es el TS
    //Nombre como variable reactiva
    let [name, setName] = useState("Felipe")

    let edad: number = 10;
    
    let poderes: string[] = ["volar", "fuerza", "velocidad"];

    // Función para manejar los cambios en la caja de texto
    const manejarCambio = (event: any) => {
        setName(event.target.value); // Actualizar el estado con el valor del input
    };
    const manejarClick = () => {
        console.log(`Hola, ${name}`); // Mostrar el saludo en la consola
        //definicion de la funcion
    }

    //Este es HTML
    return <div>
        <p>Hola mundo {name}</p>
        <p>Edad: {edad}</p>
        <p>{edad >= 18 ? "Mayor de edad" : "Menor de edad"}</p>
        <p>Poderes</p>
        <ul>
            {poderes.map(poder => <li>{poder}</li>)}
        </ul>
        <input
            type="text"
            value={name} // El valor del input está ligado al estado 'texto'
            onChange={manejarCambio} // Se actualiza el estado cada vez que el usuario escribe
        />
        <button onClick={manejarClick}>Saludar</button>
        <div className="row container">
           <div className="col">
            <PropertyComponent name="Propiedad 1" color="red" price={100} rent={[10, 20, 30]} />
            <PropertyComponent name="Propiedad 2" color="blue" price={200} rent={[20, 30, 40]} />
            <PropertyComponent name="Propiedad 3" color="green" price={300} rent={[30, 40, 50]} />
            </div> 
        </div>
        
    </div>;

}
export default Demo;