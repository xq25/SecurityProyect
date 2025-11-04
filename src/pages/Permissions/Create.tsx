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
    url: Yup.string()
      .required("La URL es obligatoria")
      .max(255, "La URL no puede tener más de 255 caracteres"),
    method: Yup.string()
      .required("El método es obligatorio")
      .oneOf(["GET", "POST", "PUT", "DELETE", "PATCH"], "Método HTTP inválido"),
  });

  const labels: (keyof Permission)[] = ["url", "method"];

  const handleCreate = async (values: Permission) => {
    const created = await permissionService.createPermission(values);
    
    if (created) {
      Swal.fire({
        title: "Permiso creado exitosamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/permissions/list");
    } else {
      Swal.fire({
        title: "Error al crear el permiso",
        icon: "error",
        timer: 2500,
      });
    }
  };

  return (
    <div>
      <Breadcrumb pageName="Permissions / Create" />
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