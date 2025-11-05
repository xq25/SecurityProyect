import { signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, googleProvider, githubProvider, microsoftProvider } from '../../firebase/firebaseConfig';

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const token = await user.getIdToken();

    return {
      user: {
        id: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        password: ""
      },
      token: token
    };
  } catch (error) {
    console.error("Error en login con Google:", error);
    throw error;
  }
};

export const loginWithGitHub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;
    const token = await user.getIdToken();

    return {
      user: {
        id: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        password: ""
      },
      token: token
    };
  } catch (error) {
    console.error("Error en login con GitHub:", error);
    throw error;
  }
};

// ← Nueva función para Microsoft
export const loginWithMicrosoft = async () => {
  try {
    // Intentar con popup primero
    const result = await signInWithPopup(auth, microsoftProvider);
    const user = result.user;
    const token = await user.getIdToken();

    return {
      user: {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || "",
        email: user.email || "",
        password: ""
      },
      token: token
    };
  } catch (error: any) {
    // Si falla el popup, intentar con redirect
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
      console.log('Popup bloqueado, usando redirect...');
      await signInWithRedirect(auth, microsoftProvider);
      return null; // Se procesará en el redirect
    }
    console.error("Error en login con Microsoft:", error);
    throw error;
  }
};

// ← Procesar el resultado del redirect
export const processMicrosoftRedirect = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (!result) return null;

    const user = result.user;
    const token = await user.getIdToken();

    return {
      user: {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || "",
        email: user.email || "",
        password: ""
      },
      token: token
    };
  } catch (error) {
    console.error("Error procesando redirect de Microsoft:", error);
    return null;
  }
};