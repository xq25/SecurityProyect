import React, { useEffect, useState } from "react";
import { AppForm } from "../../components/ui/FormGeneric";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { userService } from "../../services/userService";
import Breadcrumb from "../../components/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { User } from "../../models/User";
import { useParams } from "react-router-dom";


const UpdateUser: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  
  const {id} = useParams<{id:string}>();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const user = await userService.getUserById(Number(id));
    setUser(user);
  };

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

  const handleUpdateUser = async (id: number, user: User) => {
    try {
      const success = await userService.updateUser( id, user);
      console.log(user)
      if (success) {
        Swal.fire({
          title: "Completado",
          text: "Se ha actualizado correctamente el registro",
          icon: "success",
          timer: 3000,
        });
        navigate("/users/list");
      } else {
        Swal.fire({
          title: "Error",
          text: "Existe un problema al momento de actualizar el registro",
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
      <h2>Update User</h2>
      <Breadcrumb pageName="Users / Modificar Usuario" />
      {user ? (
        <AppForm
          mode={2}
          labels={["name", "email"]}
          info={user}
          handleAction= {(values: User) => {
            if (!id) {
              console.error("No se encontró id para actualizar");
              return;
            }
            handleUpdateUser(Number(id), values);
          }}
          validationSchema={userValidationSchema}
        />
      ) : (
        <div>Cargando usuario...</div>
      )}
    </div>
  );
};

export default UpdateUser;
