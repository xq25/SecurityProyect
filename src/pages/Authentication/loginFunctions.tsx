import { signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, googleProvider, githubProvider, microsoftProvider } from '../../firebase/firebaseConfig';
import { User } from "../../models/User";
import { userService } from "../../services/userService";
import { sessionService } from "../../services/sessionService";
import SecurityService from '../../services/securityService';
import { AppDispatch } from "../../store/store";
import { setUser } from "../../store/userSlice";

// ============================================
// FUNCIONES DE LOGIN OAUTH
// ============================================

export const loginWithGoogle = async () => {
  try {
    console.log('🔐 Iniciando login con Google...');
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const token = await user.getIdToken();

    console.log('✅ Login exitoso con Google');
    return {
      user: {
        id: user.uid,
        _id: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        password: ""
      },
      token: token
    };
  } catch (error: any) {
    console.error("❌ Error en login con Google:", error);
    if (error.code === 'auth/popup-blocked') {
      throw new Error('⚠️ Tu navegador bloqueó el popup. Permite popups para este sitio.');
    }
    throw error;
  }
};

export const loginWithGitHub = async () => {
  try {
    console.log('🔐 Iniciando login con GitHub...');
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;
    const token = await user.getIdToken();

    console.log('✅ Login exitoso con GitHub');
    return {
      user: {
        id: user.uid,
        _id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || "",
        email: user.email || "",
        password: ""
      },
      token: token
    };
  } catch (error: any) {
    console.error("❌ Error en login con GitHub:", error);
    if (error.code === 'auth/popup-blocked') {
      throw new Error('⚠️ Tu navegador bloqueó el popup. Permite popups para este sitio.');
    }
    throw error;
  }
};

export const loginWithMicrosoft = async () => {
  try {
    console.log('🔐 Iniciando login con Microsoft...');
    const result = await signInWithPopup(auth, microsoftProvider);
    const user = result.user;
    const token = await user.getIdToken();

    console.log('✅ Login exitoso con Microsoft');
    return {
      user: {
        id: user.uid,
        _id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || "",
        email: user.email || "",
        password: ""
      },
      token: token
    };
  } catch (error: any) {
    console.error("❌ Error en login con Microsoft:", error);
    
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
      console.log('⚠️ Popup bloqueado, usando redirect...');
      await signInWithRedirect(auth, microsoftProvider);
      return null;
    }
    throw error;
  }
};

export const processMicrosoftRedirect = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (!result) return null;

    const user = result.user;
    const token = await user.getIdToken();

    console.log('✅ Redirect procesado exitosamente');
    return {
      user: {
        id: user.uid,
        _id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || "",
        email: user.email || "",
        password: ""
      },
      token: token
    };
  } catch (error) {
    console.error("❌ Error procesando redirect de Microsoft:", error);
    return null;
  }
};

// ============================================
// LÓGICA DE PROCESAMIENTO DE LOGIN
// ============================================

/**
 * Procesa el login OAuth (Google, Microsoft, GitHub)
 * Crea/obtiene usuario en backend y guarda sesión
 */
export const handleOAuthLogin = async (
  data: { user: User; token: string },
  dispatch: AppDispatch,
  navigate: (path: string) => void
) => {
  try {
    const { user: firebaseUser, token } = data;
    console.log("🔐 Procesando login OAuth para:", firebaseUser.email);

    // 1. Verificar/crear usuario en backend
    let backendUser = await userService.getUserByEmail(String(firebaseUser.email));

    if (!backendUser) {
      console.log("📝 Usuario no existe, creando...");
      backendUser = await userService.createUser({
        name: firebaseUser.name || String(firebaseUser.email).split('@')[0],
        email: firebaseUser.email,
        password: 'oauth-user',
      });

      // Esperar y reintentar si es necesario
      if (!backendUser || !backendUser.id) {
        await new Promise(resolve => setTimeout(resolve, 500));
        backendUser = await userService.getUserByEmail(String(firebaseUser.email));
      }
    }

    if (!backendUser || !backendUser.id) {
      throw new Error("No se pudo obtener el usuario del backend");
    }

    // 2. Crear objeto de usuario completo
    const userWithId = {
      ...firebaseUser,
      id: backendUser.id,
      _id: String(backendUser.id)
    };

    // 3. Guardar en Redux y localStorage
    dispatch(setUser(userWithId));
    localStorage.setItem("user", JSON.stringify(userWithId));
    localStorage.setItem("token", token);

    // 4. Crear sesión en backend (no bloquear si falla)
    try {
      console.log("📝 Creando sesión en backend...");
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 24);

      await sessionService.createSession(backendUser.id, {
        userId: String(backendUser.id),
        token: token,
        expiration: expirationDate,
        FACode: '',
        State: 'active'
      });

      console.log("✅ Sesión creada exitosamente");
    } catch (sessionError: any) {
      console.warn("⚠️ Error creando sesión:", sessionError.response?.data || sessionError.message);
    }

    console.log("✅ Login OAuth completo, redirigiendo...");
    navigate("/");
  } catch (error: any) {
    console.error("❌ Error en proceso OAuth:", error);
    throw new Error(`Error en login OAuth: ${error.message}`);
  }
};

/**
 * Procesa el login tradicional (email/password)
 */
export const handleTraditionalLogin = async (
  credentials: User,
  dispatch: AppDispatch,
  navigate: (path: string) => void
) => {
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
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 24);

        await sessionService.createSession(responseUser.id, {
          userId: String(responseUser.id),
          token: token,
          expiration: expirationDate,
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

    console.log("✅ Login tradicional completo, redirigiendo...");
    navigate("/");
  } catch (error: any) {
    console.error("❌ Error en login tradicional:", error);
    throw new Error("Error al iniciar sesión. Verifica tus credenciales.");
  }
};