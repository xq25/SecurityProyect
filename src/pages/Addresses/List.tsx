import React, { useState, useEffect } from "react";

import { AppTable } from "../../components/ui/TableGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import { useNavigate, useParams } from "react-router-dom";
// Clases relacionadas al password

import { Address } from "../../models/Address";
import { addressService } from "../../services/addressService";
import { User } from "../../models/User";
import { userService } from "../../services/userService";
import { LocationMap } from "../../components/LocationMap";



const ListAddresses: React.FC = () => {
    const [infoAddress, setInfoAddress] = useState<Address | null>(null);// Creamos una variable reactiva con la informacion del usuario.
    const [infoUser, setInfoUser] = useState<User | null>(null);// Creamos una variable reactiva con la informacion del usuario.
    
    
    const {id} = useParams<{id:string}>(); // Id del usuario al que le vamos a cargar sus contraseñas.
    const navigate = useNavigate();
            
    // 🔹 Al cargar el componente, obtenemos las contraseñas del usuario(id) desde el backend.
    useEffect(() => {
        fetchData();
    }, [id]);

    // 🔹 Método que obtiene los usuarios desde el servicio
    const fetchData = async () => { // Cargamos las contraseñas del usuario y su informacion para asi agregar todo esto a la tabla.
        const address = await addressService.getAddressesByUserId(Number(id));
        const infouser = await userService.getUserById(Number(id));
        setInfoAddress(address); // Asignamos la data obtenida a la variable reactiva
        setInfoUser(infouser);
    };

    // 🔹 Define las acciones que pueden realizarse sobre cada contraseña
    const handleAction = async (action: string, address: Address) => {
        if (action === "update") {
            navigate(`/addresses/user/${address.id}`);
        }
    };

    // 🔹 Configuración base de botones (se aplicará dinámicamente a cada fila)
    const baseOptions = [
        { name: "update" }
    ];

    const tableName = infoUser? `Address - ${infoUser.name}`: 'cargando usuario';

    return (
        <div>
            <h2> Ubicacion del Usuario</h2>
            <AppButton name={'create'} action={()=> {
                navigate(`/addresses/user/${id}`); //Preguntar a felipe que si este id hace referencia al usuario o al address
            }}/>
            <LocationMap lat={infoAddress?.latitude} lng={infoAddress?.longitude}/>

            <AppTable
                name= {tableName}
                header={["id", 'street', 'number']}
                items={infoAddress? [infoAddress]: []}
                // Generamos los botones a partir de las opciones
                options={baseOptions.map((opt) => (
                <AppButton
                    key={opt.name}
                    name={opt.name}
                    // Pasamos la acción con la contraseña que corresponde
                    action={(address) => handleAction(opt.name, address)}
                />
                ))}
            />
        </div>
    );
};

export default ListAddresses;
