import React, { useEffect, useState } from "react";
// Importaciones de componentes
import { AppForm } from "../../components/ui/FormGeneric";
import * as Yup from "yup";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/Breadcrumb";
// Importaciones de Hooks
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
// Importaciones relacionadas con la clase Roles
import { Roles } from "../../models/Roles";
import { rolesService } from "../../services/roleService";



const UpdateRol: React.FC = () => {
  const [rol, setRol] = useState<Roles | null>(null);
  const navigate = useNavigate();
  
  const {id} = useParams<{id:string}>();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const user = await rolesService.getRolesById(Number(id));
    setRol(user);
  };

  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

  const rolValidationSchema = Yup.object({
    name: Yup.string()
      .required("El nombre del rol es obligatorio")
      .max(25, "El nombre no puede tener más de 25 caracteres")
      .matches(nameRegex, "El nombre no puede contener caracteres especiales ni números"),

    description: Yup.string()
        .required("La descripcion del rol es obligatoria"),
  });

  const handleUpdateUser = async (id: number, user: Roles) => {
    try {
      const success = await rolesService.updateRoles( id, user);
      if (success) {
        Swal.fire({
          title: "Completado",
          text: "Se ha actualizado correctamente el rol",
          icon: "success",
          timer: 3000,
        });
        navigate("/roles/list");
      } else {
        Swal.fire({
          title: "Error",
          text: "Existe un problema al momento de actualizar el rol",
          icon: "error",
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Existe un problema al momento de actualizar el registro",
        icon: "error",
        timer: 3000,
      });
    }
  };

  return (
    <div>
      <h2>Update Rol</h2>
      <Breadcrumb pageName="Users / Modificar Usuario" />
      {rol ? (
        <AppForm
          mode={2}
          labels={["name", "description"]}
          info={rol}
          handleAction= {(values: Roles) => {
            if (!id) {
              console.error("No se encontró id para actualizar");
              return;
            }
            handleUpdateUser(Number(id), values);
          }}
          validationSchema={rolValidationSchema}
        />
      ) : (
        <div>Cargando rol...</div>
      )}
    </div>
  );
};

export default UpdateRol;
