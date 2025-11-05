import React from "react";
import * as Yup from "yup";
import Breadcrumb from "../../components/Breadcrumb";
import { AppForm } from "../../components/ui/FormGeneric";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { permissionService } from "../../services/permissionService";
import { Permission } from "../../models/Permission";

const CreatePermission: React.FC = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    URL: Yup.string()  // ✅ Cambiar a 'URL' (mayúscula)
      .required("La URL es obligatoria")
      .max(255, "La URL no puede tener más de 255 caracteres"),
    method: Yup.string()
      .required("El método es obligatorio")
      .oneOf(["GET", "POST", "PUT", "DELETE", "PATCH"], "Método HTTP inválido"),
  });

  const labels: (keyof Permission)[] = ["URL", "method"];  // ✅ 'URL' en mayúscula

  const handleCreate = async (values: Permission) => {
    try {
      console.log("📝 Sending to API:", values);
      
      const created = await permissionService.createPermission({
        URL: values.URL,  // ✅ Usar 'URL'
        method: values.method,
      });
      
      if (created) {
        Swal.fire({
          title: "¡Éxito!",
          text: "Permiso creado exitosamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/permissions/list");
      }
    } catch (error: any) {
      console.error("❌ Error creating permission:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.error || "No se pudo crear el permiso",
        icon: "error",
      });
    }
  };

  return (
    <div>
      <Breadcrumb pageName="Crear Permiso" />
      <AppForm
        mode={1}
        labels={labels as string[]}
        info={null}
        handleAction={handleCreate}
        validationSchema={validationSchema}
      />
    </div>
  );
};

export default CreatePermission;