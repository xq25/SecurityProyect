import React from "react";
// Componentes
import { AppForm } from "../../components/ui/FormGeneric";
import * as Yup from "yup";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/Breadcrumb";
// Importaciones de Hooks
import { useNavigate } from "react-router-dom";

// Importaciones de clases relacionadas con los roles
import { rolesService } from "../../services/roleService";
import { Roles } from "../../models/Roles";



const CreateRol: React.FC = () => {
  const navigate = useNavigate();

  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; // Expresion regular para que no se puedan agregar caracteres especiales.

  const rolValidationSchema = Yup.object({
    name: Yup.string()
      .required("El nombre del rol es obligatorio")
      .max(25, "El nombre no puede tener más de 25 caracteres")
      .matches(nameRegex, "El nombre no puede contener caracteres especiales ni números"),

    description: Yup.string()
      .required("La descripcion del rol es obligatoria"),
  });

  const handleCreateUser = async (rol: Roles) => {
    try {
      const createdRol = await rolesService.createRoles(rol);

      if (createdRol) {
        Swal.fire({
          title: "Completado",
          text: "Se ha creado correctamente el rol",
          icon: "success",
          timer: 3000,
        });
        navigate("/users/list");
      } else {
        Swal.fire({
          title: "Error",
          text: "Existe un problema al momento de crear el rol",
          icon: "error",
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Existe un problema al momento de crear el registro",
        icon: "error",
        timer: 3000,
      });
    }
  };

  return (
    <div>
      <h2>Create Rol</h2>
      <Breadcrumb pageName="Roles / Create Rol" />
      <AppForm
        mode={1}
        labels={["name", 'description']}
        handleAction={handleCreateUser}
        validationSchema={rolValidationSchema}
      />
    </div>
  );
};

export default CreateRol;
