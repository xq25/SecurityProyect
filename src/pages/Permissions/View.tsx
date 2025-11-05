import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { permissionService } from "../../services/permissionService";
import { Permission } from "../../models/Permission";
import Breadcrumb from "../../components/Breadcrumb";
import { AppView } from "../../components/ui/ViewInfoGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import Swal from "sweetalert2";

const ViewPermission: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [permission, setPermission] = useState<Permission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPermission();
  }, [id]);

  const fetchPermission = async () => {
    if (!id) return;

    try {
      const data = await permissionService.getPermissionById(Number(id));
      setPermission(data);
    } catch (error) {
      console.error("❌ Error loading permission:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo cargar el permiso",
        icon: "error",
      });
      navigate("/permissions/list");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    const result = await Swal.fire({
      title: "¿Eliminar este permiso?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await permissionService.deletePermission(Number(id));

        Swal.fire({
          title: "¡Eliminado!",
          text: "El permiso se eliminó correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        navigate("/permissions/list");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el permiso", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando permiso...</p>
        </div>
      </div>
    );
  }

  const options = [
    { name: "back", label: "Volver" },
    { name: "update", label: "Editar" },
    { name: "delete", label: "Eliminar" },
  ];

  return (
    <>
      <Breadcrumb pageName="Detalle del Permiso" />

      {permission ? (
        <AppView
          title="✅ Información del Permiso"
          info={permission}
          options={options.map((opt) => (
            <AppButton
              key={opt.name}
              name={opt.name}
              action={() => {
                if (opt.name === "back") navigate("/permissions/list");
                if (opt.name === "update") navigate(`/permissions/update/${id}`);
                if (opt.name === "delete") handleDelete();
              }}
            />
          ))}
        />
      ) : (
        <div className="p-6 bg-white rounded-lg shadow dark:bg-boxdark">
          <p className="text-gray-600 dark:text-gray-400">No se encontró el permiso</p>
        </div>
      )}
    </>
  );
};

export default ViewPermission;