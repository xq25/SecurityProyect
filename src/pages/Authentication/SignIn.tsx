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

const SignIn: React.FC = () => {
  //Llamado a los Hooks
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  // const googleLogin = useGoogleLoginHandler(); // ✅ usamos el hook aquí
  
  const handleLogin = async (object: User | { user: User; token: string }) => {
  try {
    // 🧠 Caso 1: Si el objeto recibido tiene estructura { user, token }
    if ("user" in object && "token" in object) {
      console.log('entre')
      const { user, token } = object;

      // Actualiza el store
      dispatch(setUser(user));

      // Guarda en localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      navigate("/");
      return;
    }

    // 🧠 Caso 2: Si recibimos un objeto tipo User (proceso normal de login)
    const response = await SecurityService.login(object);
    console.log("Usuario autenticado:", response);

    const responseUser = (response as any)?.data ?? (response as any)?.user ?? response;
    const token = (response as any)?.token ?? (responseUser as any)?.token;

    // Actualiza el store
    dispatch(setUser(responseUser));

    // Guarda en localStorage
    try {
      localStorage.setItem("user", JSON.stringify(responseUser));
      if (token) localStorage.setItem("token", token);
    } catch (e) {
      console.warn("No se pudo guardar en localStorage", e);
    }

    navigate("/");
  } catch (error) {
    console.error("Error al iniciar sesión", error);
  }
};

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
          handleLogin(data);
        })}/>
        <AppButton name={'microsoft'} icon={<MicrosoftIcon/>}/> 
        <AppButton name={'github'} icon={<GithubIcon/>} action={() => loginWithGitHub().then((data) => {
          handleLogin(data);
        })}/>
      </div>
    </>
  );
};
// action={() => googleLogin()}
export default SignIn;
