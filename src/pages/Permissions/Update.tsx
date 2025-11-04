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

  useEffect(() => {
    const fetchPermission = async () => {
      if (!id) return;
      const data = await permissionService.getPermissionById(Number(id));
      setPermission(data);
    };
    fetchPermission();
  }, [id]);

  const validationSchema = Yup.object({
    url: Yup.string()
      .required("La URL es obligatoria")
      .max(255, "La URL no puede tener más de 255 caracteres"),
    method: Yup.string()
      .required("El método es obligatorio")
      .oneOf(["GET", "POST", "PUT", "DELETE", "PATCH"], "Método HTTP inválido"),
  });

  const labels: (keyof Permission)[] = ["url", "method"];

  const handleUpdate = async (values: Permission) => {
    if (!id) return;
    
    const updated = await permissionService.updatePermission(Number(id), values);
    
    if (updated) {
      Swal.fire({
        title: "Permiso actualizado exitosamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/permissions/list");
    } else {
      Swal.fire({
        title: "Error al actualizar el permiso",
        icon: "error",
        timer: 2500,
      });
    }
  };

  if (!permission) {
    return <div className="p-6">Cargando permiso...</div>;
  }

  return (
    <div>
      <Breadcrumb pageName="Permissions / Update" />
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