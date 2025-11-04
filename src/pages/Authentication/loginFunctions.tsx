import { signInWithPopup, GithubAuthProvider} from "firebase/auth";
import { auth, googleProvider, githubProvider } from '../../firebase/firebaseConfig';


export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const token = await user.getIdToken();

    const formattedResponse = {
      user: {
        _id: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        password: ""
      },
      token: token
    };
    return formattedResponse;
  } catch (error) {
    console.error("Error en login con Google:", error);
    throw error;
  }
};

export const loginWithGitHub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;

    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = await user.getIdToken();

    // ✅ Función que GARANTIZA retornar un string
    const getUserName = (): string => {
      // Opción 1: displayName
      if (user.displayName) return user.displayName;

      // Opción 2: reloadUserInfo
      const userInfo = (user as any).reloadUserInfo;
      if (userInfo?.screenName) return userInfo.screenName;
      if (userInfo?.displayName) return userInfo.displayName;

      // Opción 3: providerData
      const githubData = user.providerData.find(
        (provider) => provider.providerId === 'github.com'
      );
      if (githubData?.displayName) return githubData.displayName;

      // Opción 4: email username
      if (user.email) return user.email.split('@')[0];

      // Opción 5: fallback garantizado
      return "Usuario de GitHub";
    };

    const formattedResponse = {
      user: {
        _id: user.uid,
        name: getUserName(), // ✅ Siempre retorna string
        email: user.email || "",
        password: ""
      },
      token: token
    };

    return formattedResponse;
  } catch (error) {
    console.error("Error en login con GitHub:", error);
    throw error;
  }
};