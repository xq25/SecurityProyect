import React, { useEffect, useState } from "react";
// Componentes
import { AppFormSelect } from "../../components/ui/FormSelectGeneric";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/Breadcrumb";
// Importaciones de Hooks
import { useNavigate, useParams } from "react-router-dom";

// Importaciones de clases relacionadas con los roles
import { userRoleService } from "../../services/userRolService";
import { User } from "../../models/User";
import { userService } from "../../services/userService";
import { utils } from "../../utils/utils";


const CreateUserRol: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | string>("");

    const navigate = useNavigate();
    const {id} = useParams<{id:string}>(); // Este id es el del rol


    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        const users = await userService.getUsers();
        setUsers(users);
    };
    
    const handleCreateUserRol = async () => {
        try {
            if (!selectedUserId || !id) {
                Swal.fire({
                title: "Atención",
                text: "Debe seleccionar un usuario antes de continuar",
                icon: "warning",
                });
                return;
            }
            const newUserRol: any = {
                startAt: utils.getCurrentDateTime(), // Asignar la fecha y hora actual
                endAt: utils.getCurrentDateTime(), // Asignar una fecha de finalización 30 días en el futuro
            };
            console.log('Nuevo UserRole a crear:', newUserRol);
            const created = await userRoleService.create(Number(selectedUserId), Number(id), newUserRol);

            if (created) {
                Swal.fire({
                title: "Completado",
                text: "Se ha creado correctamente el rol",
                icon: "success",
                timer: 3000,
                });
                navigate(`/user-rol/${id}`); // Volvemos al listado de usuarios del rol
            } else {
                Swal.fire({
                title: "Error",
                text: "Hubo un problema al crear el rol",
                icon: "error",
                timer: 3000,
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Existe un problema al momento de crear el registro",
                icon: "error",
                timer: 3000,
            });
        }
    };
  return (
    <div>
      <h2>Create Rol</h2>
      <Breadcrumb pageName="Roles / Create Rol" />
      <AppFormSelect
        mode={1}
        info={{rol_id: Number(id)} as any}
        labels={['rol_id']}
        handleAction={() => handleCreateUserRol()}
        selectLabel="Selected user:"
        selectOptions={users}          // 👈 Lista completa de usuarios
        selectValue={selectedUserId}   // 👈 ID actual seleccionado
        onSelectChange={setSelectedUserId} // 👈 Actualiza el estado al seleccionar
        selectDisplayKey="name"        // 👈 Mostrar el nombre del usuario
        selectValueKey="id"            // 👈 Guardar el id del usuario
        selectPlaceholder="Seleccionar usuario..."
        selectRequired = {true}
        disabledFields={['rol_id']}
      />

    </div>
  );
};

export default CreateUserRol;
