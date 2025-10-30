 import React from "react";
import * as Yup from "yup";

//importacion de clases
import { User } from "../../models/User";
import SecurityService from '../../services/securityService';

//Importacion de componentes
import Breadcrumb from "../../components/Breadcrumb";
import {GoogleIcon} from '../../components/icons/GoogleIcon';
import { AppButton } from '../../components/ui/ButtonGeneric';
import { AppForm } from '../../components/ui/FormGeneric';
import { useNavigate } from "react-router-dom";
import { MicrosoftIcon } from "../../components/icons/MicrosoftIcon";
import { GithubIcon } from "../../components/icons/GitHubIcon";

//Importaciones del provedor
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { setUser } from "../../store/userSlice";

//Importacion de la funciones de inicio de sesion 
import {loginWithGoogle} from './loginFunctions';
import {loginWithGitHub} from './loginFunctions';
import { loginWithMicrosoft } from "./loginFunctions";

const SignIn: React.FC = () => {
  //Llamado a los Hooks
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  // const googleLogin = useGoogleLoginHandler(); // ✅ usamos el hook aquí
  
  const handleLogin = async (user: User) => {

    console.log("aqui " + JSON.stringify(user));
    try {
      const response = await SecurityService.login(user);
      console.log('Usuario autenticado:', response);

      // Normaliza la respuesta según tu service (data | user | response)
      const responseUser = (response as any)?.data ?? (response as any)?.user ?? response;

      // Actualiza el store con el usuario que nos devolvio el backend
      dispatch(setUser(responseUser));

      //Guardamos los datos en el localStorage para mantener la sesion despues de recargar la pagina
      try {
        localStorage.setItem("user", JSON.stringify(responseUser));
        const token = (response as any)?.token ?? (responseUser as any)?.token;
        if (token) localStorage.setItem("token", token);
      } catch (e) {
        console.warn("No se pudo guardar en localStorage", e);
      }

      navigate("/");
    } catch (error) {
      console.error('Error al iniciar sesión', error);
    }
  }
  const schemas = Yup.object({
    email: Yup.string()
      .email("El correo no es válido")
      .required("El correo es obligatorio"),

    password: Yup.string()
      .required("La contraseña es obligatoria")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .matches(/[A-Z]/, "Debe contener al menos una letra mayúscula")
      .matches(/[a-z]/, "Debe contener al menos una letra minúscula")
      .matches(/[0-9]/, "Debe contener al menos un número")
      .matches(/[@$!%*?&]/, "Debe contener al menos un carácter especial (@$!%*?&)")
  });
  return (
    <>
      <Breadcrumb pageName="SignIn"/>
      <div>
        <AppForm labels={['email', 'password']} validationSchema={schemas} handleAction={handleLogin}  />
      </div>
      <div>
        <AppButton name={'google'} icon={<GoogleIcon/>} action={() => loginWithGoogle().then((data) => {
          handleLogin(data.user);
        })}/>
        <AppButton name={'microsoft'} icon={<MicrosoftIcon/>}/> 
        <AppButton name={'github'} icon={<GithubIcon/>} action={() => loginWithGitHub().then((data) => {
          handleLogin(data.user);
        })}/>
      </div>
    </>
  );
};
// action={() => googleLogin()}
export default SignIn;
