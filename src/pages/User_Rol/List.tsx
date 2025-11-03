import React, { useState, useEffect} from "react";
// Importaciones de componentes
import { AppTable } from "../../components/ui/TableGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import Swal from "sweetalert2";
// Importaciones de Hooks
import { useNavigate, useParams } from "react-router-dom";
// Importaciones relacionadas con la clase UserRol
import { userRoleService } from "../../services/userRolService";
import { UserRole } from '../../models/UserRole'
// Importaciones relacionadas con la clase Roles
import { rolesService } from "../../services/roleService";
import { Roles } from "../../models/Roles";
// Importaciones relacionadas con user
import { userService } from "../../services/userService";




const ListUsersRol: React.FC = () => {
  const [users_rol, setUsersRol] = useState<UserRole[]>([]);
  const [rol, setRol] = useState<Roles|null>() // Aqui almacenaremos la informacion del rol para poder hacerla visible
  const navigate = useNavigate();

  const {id} = useParams<{id:string}>(); // Id del rol del cual se van a consultar los usuarios que tienen asignado dicho rol.

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // 1) obtener relaciones user-role
    const usersRolArr = await userRoleService.getByRoleId(String(id));

    // 2) extraer ids únicos de usuario
    const userIds = Array.from(new Set(usersRolArr.map(ur => ur.user_id)));

    // 3) obtener datos de cada usuario en paralelo (si userService tiene getUserById)
    const usersList = await Promise.all(
      userIds.map(uid => userService.getUserById(Number(uid)).catch(() => null))
    );

    // 4) crear mapa id -> user
    const usersMap = new Map<number, any>();
    usersList.forEach(u => {
      if (u && (u as any).id != null) usersMap.set((u as any).id, u);
    });

    // 5) enriquecer relaciones con los campos de usuario para la tabla
    const enriched = usersRolArr.map(ur => ({
      ...ur,
      name: usersMap.get(ur.user_id)?.name ?? "",
      email: usersMap.get(ur.user_id)?.email ?? ""
    }));

    setUsersRol(enriched);

    // 6) obtener info del rol
    const infoRol = await rolesService.getRolesById(Number(id));
    setRol(infoRol);
  };

  const handleAction = async (action: string, rol: UserRole) => {
    if (action === "Remove_rol") {
      const success = await userRoleService.delete(rol.id!);
      if (success) {
        Swal.fire({
          title: "Eliminado",
          text: "El rol se desligo correctamente del usuario",
          icon: "success",
        });
        fetchData();
      }
    }
  }

  const baseOptions = [
    { name: 'Remove_rol' }
  ];
  console.log(users_rol);

  return (
    <div>
      <h2>Listado de Usuarios - {rol?rol.name:'Cargando Rol...'}</h2>
      <AppButton name={'create'} action={()=> {
        navigate(`/user-rol/create/${id}`); // Pasamos el id del rol para poder usarlo al llamar al service.
      }}/>
      <AppTable
        name="Roles"
        header={['id',"user_id",'role_id', "name", "email"]}
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