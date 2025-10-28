import React, { useEffect, useState } from "react";
import * as Yup from "yup";
//Importacion de componentes
import { AppForm } from "../../components/ui/FormGeneric";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/Breadcrumb";
// Importaciones de Hooks
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
//Importaciones de las clases Password
import { Password } from "../../models/Password";
import { passwordService } from "../../services/passwordService";


const UpdatePassword: React.FC = () => {
  const [password, setPassword] = useState<Password | null>(null);
  const navigate = useNavigate();
  
  const {id} = useParams<{id:string}>(); //Segun el backen este id es la referencia general de la contrasena como tal. (No del usuario!)

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const password = await passwordService.getPasswordById(Number(id));
    setPassword(password);
  };

  const passwordValidationSchema = Yup.object({
    content: Yup.string()
      .required("La contraseña es obligatoria")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .matches(/[A-Z]/, "Debe contener al menos una letra mayúscula")
      .matches(/[a-z]/, "Debe contener al menos una letra minúscula")
      .matches(/[0-9]/, "Debe contener al menos un número")
      .matches(/[@$!%*?&]/, "Debe contener al menos un carácter especial (@$!%*?&)")
  });

  const handleUpdatePassword = async (id: number, password: any) => {
    const finalData = { //Aqui debemos agregarle la fecha alctual al campo endAt para cumplir con el formato de la clase Password
      ...password,
      endAt : passwordService.getCurrentDateTime()
    }
    try {
      const success = await passwordService.updatePassword( id, finalData);
      console.log(password)
      if (success) {
        Swal.fire({
          title: "Completado",
          text: "Se ha actualizado correctamente el registro",
          icon: "success",
          timer: 3000,
        });
        navigate(`/passwords/user/${id}`);
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
      <h2>Update Password</h2>
      <Breadcrumb pageName="Password / Update Password" />
      {password ? (
        <AppForm
          mode={2}
          labels={['id',"content", "startAt", 'user_id']}
          info={password}
          handleAction= {(values: any) => {
            if (!id) {
              console.error("No se encontró id para actualizar la contraseña");
              return;
            }
            handleUpdatePassword(Number(id), values);
          }}
          validationSchema={passwordValidationSchema}
          disabledFields={['id','startAt','endAt']}
          hiddenFields={['user_id']}
        />
      ) : (
        <div>Cargando usuario...</div>
      )}
    </div>
  );
};

export default UpdatePassword;
