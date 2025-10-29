import React, { useState, useEffect } from "react";
//Importacion de componentes
import Swal from "sweetalert2";
import { AppTable } from "../../components/ui/TableGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
// Importaciones de Hooks
import { useNavigate, useParams } from "react-router-dom";
// Importaciones relacionadas a la clase Password
import { Password } from "../../models/Password";
import { passwordService } from "../../services/passwordService";
// Importaciones relacionadas con user (Las usamos para informacion especifica dentro de la tabla)
import { userService } from "../../services/userService";
import {User} from '../../models/User';


const ListPasswordsUser: React.FC = () => {
    const [passwords, setPasswords] = useState<Password[]>([]); // Variable reactiva con la lista de contraseña de un usuario.
    const [infoUser, setInfoUser] = useState<User | null>(null);// Creamos una variable reactiva con la informacion del usuario.
    
    const {id} = useParams<{id:string}>(); // Id del usuario al que le vamos a cargar sus contraseñas.
    const navigate = useNavigate();
            
    // 🔹 Al cargar el componente, obtenemos las contraseñas del usuario(id) desde el backend.
    useEffect(() => {
        fetchData();
    }, [id]);

    // 🔹 Método que obtiene los usuarios desde el servicio
    const fetchData = async () => { // Cargamos las contraseñas del usuario y su informacion para asi agregar todo esto a la tabla.
        const passwords = await passwordService.getPasswordsByUserId(Number(id));
        const infoUser = await userService.getUserById(Number(id));
        setPasswords(passwords); // Asignamos la data obtenida a la variable reactiva
        setInfoUser(infoUser);
    };

    // 🔹 Define las acciones que pueden realizarse sobre cada contraseña
    const handleAction = async (action: string, password: Password) => {
        if (action === "delete") {
            const success = await passwordService.deletePassword(password.id!);
            if (success) {
                Swal.fire({
                title: "Eliminado",
                text: `contraseña de ${infoUser?.name} eliminada correctamente`,
                icon: "success",
                });
                fetchData(); // Refresca la tabla después de eliminar
            }
        } else if (action === "update") {
            navigate(`passwords/${password.id}/update`);
        }
    };

    // 🔹 Configuración base de botones (se aplicará dinámicamente a cada fila)
    const baseOptions = [
        { name: "update" },
        { name: "delete" },
    ];

    const tableName = infoUser? `Passwords - ${infoUser.name}`: 'cargando usuario';

    return (
        <div>
        <h2>Listado de contraseñas del usuario</h2>
        <AppButton name={'create'} action={()=> {
            navigate(`/passwords/user/create/${id}`); // mandamos el id del usuario.
        }}/>
        <AppTable
            name= {tableName}
            header={["id", "content", "startAt", "endAt"]}
            items={passwords}
            // Generamos los botones a partir de las opciones
            options={baseOptions.map((opt) => (
            <AppButton
                key={opt.name}
                name={opt.name}
                // Pasamos la acción con la contraseña que corresponde
                action={(password) => handleAction(opt.name, password)}
            />
            ))}
        />
        </div>
    );
};

export default ListPasswordsUser;
