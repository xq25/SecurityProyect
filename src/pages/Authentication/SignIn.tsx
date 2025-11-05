import React, { useEffect, useState } from "react";
import * as Yup from "yup";

//importacion de clases
import { User } from "../../models/User";
import SecurityService from '../../services/securityService';
import { sessionService } from "../../services/sessionService";
import { userService } from "../../services/userService";

//Importacion de componentes
import Breadcrumb from "../../components/Breadcrumb";
import {GoogleIcon} from '../../components/icons/GoogleIcon';
import { AppForm } from '../../components/ui/FormGeneric';
import { useNavigate } from "react-router-dom";
import { MicrosoftIcon } from "../../components/icons/MicrosoftIcon";
import { GithubIcon } from "../../components/icons/GitHubIcon";

//Importaciones del provedor
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { setUser } from "../../store/userSlice";

//Importacion de la funciones de inicio de sesion 
import {
  loginWithGoogle, 
  loginWithGitHub, 
  processMicrosoftRedirect
} from './loginFunctions';

import { auth } from "../../firebase/firebaseConfig";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkMicrosoftRedirect = async () => {
      setIsLoading(true);
      try {
        const result = await processMicrosoftRedirect();
        if (result) {
          await handleOAuthLogin(result);
        }
      } catch (error) {
        console.error('Error procesando redirect:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkMicrosoftRedirect();
  }, []);
  
  // Manejo de login OAuth (Google, Microsoft, GitHub)
  const handleOAuthLogin = async (data: { user: User; token: string }) => {
    try {
      const { user: firebaseUser, token } = data;

      console.log("🔐 Iniciando login OAuth para:", firebaseUser.email);

      // 1. Verificar/crear usuario en backend
      let backendUser = await userService.getUserByEmail(String(firebaseUser.email));
      
      if (!backendUser) {
        console.log("📝 Usuario no existe, creando...");
        
        backendUser = await userService.createUser({
          name: firebaseUser.name || String(firebaseUser.email).split('@')[0],
          email: firebaseUser.email,
          password: 'oauth-user', // Password dummy para OAuth
        });
        
        // Workaround: Si el backend no devuelve el ID, buscar de nuevo
        if (!backendUser || !backendUser.id) {
          await new Promise(resolve => setTimeout(resolve, 500));
          backendUser = await userService.getUserByEmail(String(firebaseUser.email));
        }
      }

      if (!backendUser || !backendUser.id) {
        throw new Error("No se pudo obtener el usuario del backend");
      }

      console.log("✅ Usuario backend:", backendUser.id);

      // 2. Crear objeto de usuario completo
      const userWithId = {
        ...firebaseUser,
        id: backendUser.id,
        _id: String(backendUser.id)
      };

      // 3. Guardar en Redux y localStorage
      dispatch(setUser(userWithId));
      localStorage.setItem("user", JSON.stringify(userWithId));
      localStorage.setItem("token", token); // Token de Firebase
      
      // En handleOAuthLogin, después de guardar en localStorage:

// ✅ Crear sesión en el backend
try {
  console.log("📝 Creando sesión en backend...");
  
  // Calcular fecha de expiración (24 horas desde ahora)
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 24);
  
  await sessionService.createSession(backendUser.id, {
    userId: String(backendUser.id),
    token: token, // Token OAuth de Firebase
    expiration: expirationDate,
    FACode: '', // Opcional
    State: 'active'
  });
  
  console.log("✅ Sesión creada exitosamente");
} catch (sessionError: any) {
  console.warn("⚠️ Error creando sesión:", sessionError.response?.data || sessionError.message);
  // No bloquear el login si falla la sesión
}

      console.log("✅ Login exitoso, redirigiendo...");
      navigate("/");
      
    } catch (error: any) {
      console.error("❌ Error en login OAuth:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Manejo de login tradicional (email/password)
  const handleTraditionalLogin = async (credentials: User) => {
    try {
      console.log("🔐 Iniciando login tradicional para:", credentials.email);

      const response = await SecurityService.login(credentials);
      const responseUser = (response as any)?.data ?? (response as any)?.user ?? response;
      const token = (response as any)?.token ?? (responseUser as any)?.token;

      if (!token) {
        throw new Error("No se recibió token del servidor");
      }

      // Guardar en Redux y localStorage
      dispatch(setUser(responseUser));
      localStorage.setItem("user", JSON.stringify(responseUser));
      localStorage.setItem("token", token);

      // Crear sesión en backend
      if (responseUser.id) {
        try {
          await sessionService.createSession(responseUser.id, {
            userId: String(responseUser.id),
            token: token,
            device_info: navigator.userAgent,
            ip_address: 'client-ip',
            location: 'Unknown',
            State: 'active'
          });
          console.log("✅ Sesión creada");
        } catch (sessionError) {
          console.warn("⚠️ Error creando sesión:", sessionError);
        }
      }

      navigate("/");
    } catch (error: any) {
      console.error("❌ Error en login tradicional:", error);
      alert("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  // Función unificada para manejar login
  const handleLogin = async (object: User | { user: User; token: string }) => {
    if ("user" in object && "token" in object) {
      // OAuth login
      await handleOAuthLogin(object);
    } else {
      // Traditional login
      await handleTraditionalLogin(object);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const data = await loginWithGoogle();
      await handleOAuthLogin(data);
    } catch (error: any) {
      console.error('Error en Google login:', error);
      if (error.code === 'auth/popup-blocked') {
        alert('⚠️ Tu navegador bloqueó el popup. Permite popups para este sitio.');
      }
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      const { signInWithPopup } = await import('firebase/auth');
      const { microsoftProvider } = await import('../../firebase/firebaseConfig');
      
      console.log('🔐 Iniciando login con Microsoft...');
      
      const result = await signInWithPopup(auth, microsoftProvider);
      const user = result.user;
      const token = await user.getIdToken();
      
      console.log('✅ Login exitoso con Microsoft');
      
      await handleOAuthLogin({
        user: {
          _id: user.uid,
          name: user.displayName || user.email?.split('@')[0] || "",
          email: user.email || "",
          password: ""
        },
        token
      });
      
    } catch (error: any) {
      console.error('❌ Error en Microsoft login:', error);
      
      if (error.code === 'auth/popup-blocked') {
        alert('⚠️ Tu navegador bloqueó el popup. Permite popups para este sitio.');
      } else if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        console.log('ℹ️ Usuario canceló el login');
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleGitHubLogin = async () => {
    try {
      const data = await loginWithGitHub();
      await handleOAuthLogin(data);
    } catch (error: any) {
      console.error('Error en GitHub login:', error);
      if (error.code === 'auth/popup-blocked') {
        alert('⚠️ Tu navegador bloqueó el popup. Permite popups para este sitio.');
      }
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

  return (
    <>
      <Breadcrumb pageName="SignIn"/>
      
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Iniciar Sesión
          </h3>
        </div>
        
        <div className="p-6.5">
          <AppForm 
            labels={['email', 'password']} 
            validationSchema={schemas} 
            handleAction={handleLogin}  
          />

          <div className="mt-6">
            <div className="mb-4">
              <span className="block text-center text-sm text-gray-500 dark:text-gray-400">
                O continúa con
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-3 w-full py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <GoogleIcon />
                <span className="font-medium">Continuar con Google</span>
              </button>
              
              <button
                onClick={handleMicrosoftLogin}
                className="flex items-center justify-center gap-3 w-full py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MicrosoftIcon />
                <span className="font-medium">Continuar con Microsoft</span>
              </button>
              
              <button
                onClick={handleGitHubLogin}
                className="flex items-center justify-center gap-3 w-full py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <GithubIcon />
                <span className="font-medium">Continuar con GitHub</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;