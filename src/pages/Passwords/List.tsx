import React, { useState, useEffect } from "react";
import { User } from "../../models/User";

import Swal from "sweetalert2";
import { AppTable } from "../../components/ui/TableGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import { useNavigate, useParams } from "react-router-dom";
import { Password } from "../../models/Password";

const ListPasswordsUser: React.FC = () => {
    const [passwords, setPasswords] = useState<Password[]>([]); // Variable reactiva con la lista de usuarios.
    const {id} = useParams<{id:string}>(); // Id del usuario al que le vamos a cargar sus contraseñas

        
    const navigate = useNavigate();

    // 🔹 Al cargar el componente, obtenemos los usuarios desde el backend
    useEffect(() => {
        fetchData();
    }, []);

    // 🔹 Método que obtiene los usuarios desde el servicio
    const fetchData = async () => {
        const passwords = await passwordService.getUsers(id);
        setPasswords(passwords); // Asignamos la data obtenida a la variable reactiva
    };

    // 🔹 Define las acciones que pueden realizarse sobre cada usuario
    const handleAction = async (action: string, user: User) => {
        if (action === "delete") {
        const success = await passwordService.deleteUser(user.id!);
        if (success) {
            Swal.fire({
            title: "Eliminado",
            text: "Usuario eliminado correctamente",
            icon: "success",
            });
            fetchData(); // Refresca la tabla después de eliminar
        }
        } else if (action === "update") {
        navigate(`passwords/user/update/${user.id}`);
        }
    };

    // 🔹 Configuración base de botones (se aplicará dinámicamente a cada fila)
    const baseOptions = [
        { name: "update" },
        { name: "delete" },
        
    ];

    return (
        <div>
        <h2>Listado de contraseñas del usuario {}</h2>
        <AppTable
            name="Usuarios"
            header={["id", "name", "email"]}
            items={users}
            // Generamos los botones a partir de las opciones
            options={baseOptions.map((opt) => (
            <AppButton
                key={opt.name}
                name={opt.name}
                // Pasamos la acción con el usuario que corresponde
                action={(user) => handleAction(opt.name, user)}
            />
            ))}
        />
        </div>
    );
};

export default ListPasswordsUser;
