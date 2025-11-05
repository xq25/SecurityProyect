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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await permissionService.getPermissions();
      console.log("✅ Permissions loaded:", data);
      setPermissions(data || []);
    } catch (error) {
      console.error("❌ Error loading permissions:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los permisos",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
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
        try {
          await permissionService.deletePermission(Number(permission.id));
          
          Swal.fire({
            title: "¡Eliminado!",
            text: "Permiso eliminado correctamente",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          
          fetchData();
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar el permiso",
            icon: "error",
          });
        }
      }
    } else if (action === "update") {
      navigate(`/permissions/update/${permission.id}`);
    } else if (action === "view") {
      navigate(`/permissions/${permission.id}`);
    }
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(dateString);
    }
  };

  const baseOptions = [
    { name: "view" },
    { name: "update" },
    { name: "delete" },
  ];

  // ✅ Mapear correctamente los campos
  const mappedPermissions = permissions.map((perm) => ({
    id: perm.id,
    URL: perm.URL || perm.url || perm.entity || "N/A",  // ✅ Soportar todos los formatos
    method: perm.method || "N/A",
    created_at: formatDate(perm.created_at),
  }));

  const header = ["id", "URL", "method", "created_at"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando permisos...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb pageName="Permisos" />
      
      <div className="flex justify-end mb-4">
        <AppButton 
          name="create" 
          action={() => navigate("/permissions/create")} 
        />
      </div>
      
      <AppTable
        name="Permissions"
        header={header}
        items={mappedPermissions}
        options={baseOptions.map((opt) => (
          <AppButton
            key={opt.name}
            name={opt.name}
            action={(permission) => handleAction(opt.name, permission)}
          />
        ))}
      />
    </div>
  );
};

export default ListPermissions;