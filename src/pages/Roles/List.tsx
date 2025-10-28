import React, { useState, useEffect} from "react";
// Importaciones de componentes
import { AppTable } from "../../components/ui/TableGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import Swal from "sweetalert2";
// Importaciones de Hooks
import { useNavigate } from "react-router-dom";
// Importaciones relacionadas con la clase Roles
import { Roles } from "../../models/Roles";
import { rolesService } from "../../services/roleService";

const ListRoles: React.FC = () => {
  const [roles, setRoles] = useState<Roles[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const roles = await rolesService.getRoless();
    setRoles(roles);
  };

  const handleAction = async (action: string, rol: Roles) => {
    if (action === "delete") {
      const success = await rolesService.deleteRoles(rol.id);
      if (success) {
        Swal.fire({
          title: "Eliminado",
          text: "Rol General eliminado correctamente",
          icon: "success",
        });
        fetchData();
      }
    } else if (action === "view") {
      navigate(`/roles/view/${rol.id}`);
    } else if (action === "update") {
      navigate(`/roles/update/${rol.id}`);
    } else if (action === 'permissions'){
      navigate(`/`)
    }
  }

  const baseOptions = [
    { name: "view" },
    { name: "update" },
    { name: "delete" },
    { name: 'permissions' }
  ];

  return (
    <div>
      <h2>Listado de Roles Generales</h2>
      <AppButton name={'create'} action={()=> {
        navigate('/roles/create');
      }}/>
      <AppTable
        name="Roles"
        header={["id", "name", "description"]}
        items={roles}
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

export default ListRoles;