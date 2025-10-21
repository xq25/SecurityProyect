import React from "react";


import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { User } from "../../models/User";
import SecurityService from '../../services/securityService';

import Breadcrumb from "../../components/Breadcrumb";
import {GoogleIcon} from '../../components/icons/GoogleIcon';
import { AppButton } from '../../components/ui/ButtonGeneric';
import { AppForm } from '../../components/ui/FormGeneric';
import { useNavigate } from "react-router-dom";
import { MicrosoftIcon } from "../../components/icons/MicrosoftIcon";
import { GithubIcon } from "../../components/icons/GitHubIcon";



const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const handleLogin = async (user: User) => {
    console.log(user);
    console.log("aqui " + JSON.stringify(user))
    try {
      const response = await SecurityService.login(user);
      console.log('Usuario autenticado:', response);
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
        <AppButton name={'google'} icon={<GoogleIcon/>}/>
        <AppButton name={'microsoft'} icon={<MicrosoftIcon/>}/> 
        <AppButton name={'github'} icon={<GithubIcon/>}/>
      </div>
    </>
  );
};

export default SignIn;
