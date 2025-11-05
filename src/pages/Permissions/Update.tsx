import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import Breadcrumb from "../../components/Breadcrumb";
import { AppForm } from "../../components/ui/FormGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { permissionService } from "../../services/permissionService";
import { Permission } from "../../models/Permission";

const UpdatePermission: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [permission, setPermission] = useState<Permission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPermission();
  }, [id]);

  const fetchPermission = async () => {
    if (!id) return;
    
    try {
      const data = await permissionService.getPermissionById(Number(id));
      console.log("✅ Permission loaded:", data);
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

  const validationSchema = Yup.object({
    URL: Yup.string()  // ✅ 'URL' mayúscula
      .required("La URL es obligatoria")
      .max(255, "La URL no puede tener más de 255 caracteres"),
    method: Yup.string()
      .required("El método es obligatorio")
      .oneOf(["GET", "POST", "PUT", "DELETE", "PATCH"], "Método HTTP inválido"),
  });

  const labels: (keyof Permission)[] = ["URL", "method"];  // ✅ 'URL' mayúscula

  const handleUpdate = async (values: Permission) => {
    if (!id) return;
    
    try {
      console.log("📝 Updating with:", values);
      
      await permissionService.updatePermission(Number(id), {
        URL: values.URL,  // ✅ Usar 'URL'
        method: values.method,
      });
      
      Swal.fire({
        title: "¡Éxito!",
        text: "Permiso actualizado exitosamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/permissions/list");
    } catch (error: any) {
      console.error("❌ Error updating:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.error || "No se pudo actualizar el permiso",
        icon: "error",
      });
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

  if (!permission) {
    return (
      <div className="p-6">
        <p className="text-gray-600 dark:text-gray-400">No se encontró el permiso</p>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb pageName="Actualizar Permiso" />
      <AppForm
        mode={3}
        labels={labels as string[]}
        info={permission}
        handleAction={handleUpdate}
        validationSchema={validationSchema}
      />
    </div>
  );
};

export default UpdatePermission;