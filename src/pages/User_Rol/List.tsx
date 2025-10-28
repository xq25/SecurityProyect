import React, { useState, useEffect} from "react";
// Importaciones de componentes
import { AppTable } from "../../components/ui/TableGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import Swal from "sweetalert2";
// Importaciones de Hooks
import { useNavigate, useParams } from "react-router-dom";
import { userRoleService } from "../../services/userRolService";
import { UserRole } from '../../models/UserRole'
// Importaciones relacionadas con la clase Roles


const ListUsersRol: React.FC = () => {
  const [users_rol, setUsersRol] = useState<UserRole[]>([]);
  const navigate = useNavigate();

  const {id} = useParams<{id:string}>(); // Id del rol del cual se van a consultar los usuarios que tienen asignado dicho rol.

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const users_rol = await userRoleService.getByRoleId(String(id));
    setUsersRol(users_rol);
  };

  const handleAction = async (action: string, rol: UserRole) => {
    if (action === "Remove_rol") {
      const success = await userRoleService.delete(rol.id);
      if (success) {
        Swal.fire({
          title: "Eliminado",
          text: "Rol General eliminado correctamente",
          icon: "success",
        });
        fetchData();
      }
    }
  }

  const baseOptions = [
    {name: 'Remove_rol'}
  ];

  return (
    <div>
      <h2>Listado de Rol - Usuario</h2>
      <AppButton name={'create'} action={()=> {
        navigate('/roles/create');
      }}/>
      <AppTable
        name="Roles"
        header={["id", "name", "email"]}
        items={users_rol}
        options={baseOptions.map((opt) => (
          <AppButton
            key={opt.name}
            name={opt.name}
            action={(rol) => handleAction(opt.name, rol)}
          />
        ))}
      />
    </div>
  );
};

export default ListUsersRol;