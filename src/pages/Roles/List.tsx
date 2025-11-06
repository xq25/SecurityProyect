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
      const result = await Swal.fire({
        title: '¿Eliminar rol?',
        html: `
          <div style="text-align: left;">
            <p><strong>Nombre:</strong> ${rol.name}</p>
            <p><strong>Descripción:</strong> ${rol.description || 'N/A'}</p>
          </div>
        `,
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6'
      });

      if (!result.isConfirmed) return;

      const success = await rolesService.deleteRoles(rol.id!);
      if (success) {
        Swal.fire({
          title: "Eliminado",
          text: "Rol eliminado correctamente",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
        fetchData();
      } else {
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el rol",
          icon: "error",
          confirmButtonColor: '#d33'
        });
      }
    } else if (action === "view") {
      navigate(`/user-rol/${rol.id}`); // Usuarios que tienen este rol
    } else if (action === "update") {
      navigate(`/roles/update/${rol.id}`);
    } else if (action === 'permissions') {
      // ✅ Navegar a gestionar permisos del rol
      navigate(`/roles/${rol.id}/permissions`);
    }
  }

  const baseOptions = [
    { name: "view" },
    { name: "update" },
    { name: "permissions" }, // ✅ Botón de permisos
    { name: "delete" }
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