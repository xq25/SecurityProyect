import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// Models & Types
import { User } from "../../models/User";
import { AppDispatch } from "../../store/store";

// Components
import Breadcrumb from "../../components/Breadcrumb";
import { GoogleIcon } from '../../components/icons/GoogleIcon';
import { MicrosoftIcon } from "../../components/icons/MicrosoftIcon";
import { GithubIcon } from "../../components/icons/GitHubIcon";
import { AppForm } from '../../components/ui/FormGeneric';
import { AppButton } from "../../components/ui/ButtonGeneric";

// Login functions
import {
  loginWithGoogle,
  loginWithGitHub,
  loginWithMicrosoft,
  processMicrosoftRedirect,
  handleOAuthLogin,
  handleTraditionalLogin
} from './loginFunctions';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);

  // Procesar redirect de Microsoft al cargar
  useEffect(() => {
    const checkMicrosoftRedirect = async () => {
      setIsLoading(true);
      try {
        const result = await processMicrosoftRedirect();
        if (result) {
          await handleOAuthLogin(result, dispatch, navigate);
        }
      } catch (error: any) {
        console.error('Error procesando redirect:', error);
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkMicrosoftRedirect();
  }, [dispatch, navigate]);

  // Handler unificado para AppForm
  const handleLogin = async (credentials: User) => {
    try {
      await handleTraditionalLogin(credentials, dispatch, navigate);
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Handlers OAuth
  const handleGoogleLogin = async () => {
    try {
      const data = await loginWithGoogle();
      await handleOAuthLogin(data, dispatch, navigate);
    } catch (error: any) {
      alert(error.message || 'Error en login con Google');
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      const data = await loginWithMicrosoft();
      if (data) {
        await handleOAuthLogin(data, dispatch, navigate);
      }
      // Si es null, significa que se redirigió
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        alert(error.message || 'Error en login con Microsoft');
      }
    }
  };

  const handleGitHubLogin = async () => {
    try {
      const data = await loginWithGitHub();
      await handleOAuthLogin(data, dispatch, navigate);
    } catch (error: any) {
      alert(error.message || 'Error en login con GitHub');
    }
  };

  // Validación con Yup
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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Procesando autenticación...</p>
        </div>
      </div>
    );
  }

  // Render
  return (
    <>
      <Breadcrumb pageName="SignIn" />
      
      {/* Formulario tradicional */}
      <div>
        <AppForm 
          labels={['email', 'password']} 
          validationSchema={schemas} 
          handleAction={handleLogin}  
        />
      </div>
      
      {/* Botones OAuth */}
      <div className="flex gap-2 mt-4">
        <AppButton 
          name={'google'} 
          icon={<GoogleIcon/>} 
          action={handleGoogleLogin} 
        />
        <AppButton 
          name={'microsoft'} 
          icon={<MicrosoftIcon/>} 
          action={handleMicrosoftLogin} 
        />
        <AppButton 
          name={'github'} 
          icon={<GithubIcon/>} 
          action={handleGitHubLogin} 
        />
      </div>
    </>
  );
};

export default SignIn;