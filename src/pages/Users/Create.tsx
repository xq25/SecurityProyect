import React, { useState } from 'react'; // Asegúrate de importar useState
import { User } from '../../models/User';
import {AppForm} from '../../components/ui/FormGeneric';

import Swal from 'sweetalert2';
import { userService } from "../../services/userService";
import Breadcrumb from '../../components/Breadcrumb';
import { useNavigate } from "react-router-dom";

const CreateUser: React.FC = () => {
    const navigate = useNavigate();

    //const shema = Aqui va a ir todas las restricciones posibles sobre los campos del formulario.
    // Estado para almacenar el usuario a editar

    // Lógica de creación
    const handleCreateUser = async (user: User) => {

        try {
            const createdUser = await userService.createUser(user);
            
            if (createdUser) {
                Swal.fire({
                    title: "Completado",
                    text: "Se ha creado correctamente el registro",
                    icon: "success",
                    timer: 3000
                })
                console.log("Usuario creado con éxito:", createdUser);
                navigate("/users/list");
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Existe un problema al momento de crear el registro",
                    icon: "error",
                    timer: 3000
                })
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Existe un problema al momento de crear el registro",
                icon: "error",
                timer: 3000
            })
        }
    };
    return (
        <div>
            {/* Formulario para crear un nuevo usuario */}
            <h2>Create User</h2>
            <Breadcrumb pageName="Users / Crear Usuario" />
            <AppForm mode={1} labels={['name', 'email']} handleAction={handleCreateUser}/>
        </div>
    );
};

export default CreateUser;
