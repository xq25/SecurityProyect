import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import { AppTable } from "../../components/ui/TableGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import Swal from "sweetalert2";
import { permissionService } from "../../services/permissionService";
import { Permission } from "../../models/Permission";

const ListPermissions: React.FC = () => {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await permissionService.getPermissions();
    setPermissions(data);
  };

  const handleAction = async (action: string, permission: Permission) => {
    if (action === "delete") {
      const confirm = await Swal.fire({
        title: "¿Eliminar permiso?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (confirm.isConfirmed) {
        const success = await permissionService.deletePermission(Number(permission.id));
        
        if (success) {
          Swal.fire({
            title: "Eliminado",
            text: "Permiso eliminado correctamente",
            icon: "success",
          });
          fetchData();
        } else {
          Swal.fire({
            title: "Error al eliminar",
            icon: "error",
            timer: 2500,
          });
        }
      }
    } else if (action === "update") {
      navigate(`/permissions/update/${permission.id}`);
    }
  };

  const baseOptions = [
    { name: "update" },
    { name: "delete" },
  ];

  const header = ["ID", "URL", "Método"];

  return (
    <div>
      <Breadcrumb pageName="Permissions / List" />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Listado de Permisos</h2>
        
        <AppButton 
          name="create" 
          action={() => navigate("/permissions/create")} 
        />x
        
        <AppTable
          name="Permissions"
          header={header}
          items={permissions}
          options={baseOptions.map((opt) => (
            <AppButton
              key={opt.name}
              name={opt.name}
              action={(permission) => handleAction(opt.name, permission)}
            />
          ))}
        />

        {permissions.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No hay permisos registrados
          </div>
        )}
      </div>
    </div>
  );
};

export default ListPermissions;