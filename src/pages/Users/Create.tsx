import React from "react";
import { AppForm } from "../../components/ui/FormGeneric";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { userService } from "../../services/userService";
import Breadcrumb from "../../components/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { User } from "../../models/User";

const CreateUser: React.FC = () => {
  const navigate = useNavigate();

  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

  const userValidationSchema = Yup.object({
    name: Yup.string()
      .required("El nombre es obligatorio")
      .max(25, "El nombre no puede tener más de 25 caracteres")
      .matches(nameRegex, "El nombre no puede contener caracteres especiales ni números"),

    email: Yup.string()
      .required("El correo electrónico es obligatorio")
      .email("Debe ser un correo electrónico válido"),
  });

  const handleCreateUser = async (user: User) => {
    try {
      const createdUser = await userService.createUser(user);

      if (createdUser) {
        Swal.fire({
          title: "Completado",
          text: "Se ha creado correctamente el registro",
          icon: "success",
          timer: 3000,
        });
        navigate("/users/list");
      } else {
        Swal.fire({
          title: "Error",
          text: "Existe un problema al momento de crear el registro",
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
      <h2>Create User</h2>
      <Breadcrumb pageName="Users / Crear Usuario" />
      <AppForm
        mode={1}
        labels={["name", "email"]}
        handleAction={handleCreateUser}
        validationSchema={userValidationSchema}
      />
    </div>
  );
};

export default CreateUser;
