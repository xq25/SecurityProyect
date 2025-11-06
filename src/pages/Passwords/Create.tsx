import React from "react";
import * as Yup from "yup";
//Importacion de componentes
import { AppForm } from "../../components/ui/FormGeneric";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/Breadcrumb";
// importaciones de Hooks
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
//Importaciones de las clases Password
import { passwordService } from "../../services/passwordService";
import { utils } from "../../utils/utils";



const CreatePassword: React.FC = () => {
  const navigate = useNavigate();
  
  const {id} = useParams<{id:string}>(); //Este id hace referencia al id del usuario.

  const passwordValidationSchema = Yup.object({
    content: Yup.string()
      .required("La contraseña es obligatoria")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .matches(/[A-Z]/, "Debe contener al menos una letra mayúscula")
      .matches(/[a-z]/, "Debe contener al menos una letra minúscula")
      .matches(/[0-9]/, "Debe contener al menos un número")
      .matches(/[@$!%*?&]/, "Debe contener al menos un carácter especial (@$!%*?&)")
  });

  const handleCreatePassword = async (id: number, password: any) => {
    const finalData = { //Aqui debemos agregarle la fecha alctual al campo endAt para cumplir con el formato de la clase Password
      ...password,
      startAt: utils.getCurrentDateTime(), 
      endAt : utils.getCurrentDateTime()
    }
    try {
      const success = await passwordService.createPassword( id, finalData);
      if (success) {
        Swal.fire({
          title: "Completado",
          text: "Se ha creado correctamente la contraseña",
          icon: "success",
          timer: 3000,
        });
        navigate(`/passwords/user/${id}`); //Redirigimos a la pagina de las contraseñas del usuario.
      } else {
        Swal.fire({
          title: "Error",
          text: "Existe un problema al momento de crear la contraseña",
          icon: "error",
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Existe un problema al momento de generar la registro",
        icon: "error",
        timer: 3000,
      });
    }
  };

  return (
    <div>
      <h2>Create Password</h2>
      <Breadcrumb pageName="Password / Create Password" />
      <AppForm
        mode={1}
        labels={['content', 'user_id']}
        info={{
          user_id: id
        }}
        handleAction= {(values: any) => {
          if (!id) {
            console.error("No se encontró id para actualizar la contraseña");
            return;
          }
          handleCreatePassword(Number(id), values);
        }}
        validationSchema={passwordValidationSchema}
        hiddenFields={['user_id']}
      />
  
    </div>
  );
};

export default CreatePassword;
