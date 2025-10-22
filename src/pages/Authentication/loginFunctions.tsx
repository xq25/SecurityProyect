// src/pages/SignIn/loginFunctions.tsx
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

/**
 * Hook personalizado que prepara la función de login con Google.
 * Devuelve una función que puedes pasar directamente como `action` a tu botón.
 */
export const useGoogleLoginHandler = () => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { access_token } = tokenResponse;

        // Obtener datos del usuario desde Google
        const { data: googleUser } = await axios.get(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );

        // Retornar el formato estándar que usa tu app
        return {
          user: {
            _id: googleUser.id || crypto.randomUUID(),
            name: googleUser.name,
            email: googleUser.email,
            password: "",
          },
          token: access_token,
        };
      } catch (error) {
        console.error("❌ Error obteniendo datos de Google:", error);
        throw error;
      }
    },
    onError: (err) => {
      console.error("❌ Error en login con Google:", err);
    },
    flow: "implicit",
  });

  // Retornamos el método que dispara el login (abrirá el popup de Google)
  return login;
};

export const microsoftLogin = () => {
  // Aquí podrías agregar la lógica de Microsoft más adelante
};

export const gitHubLogin = () => {
  // Aquí podrías agregar la lógica de GitHub más adelante
};
