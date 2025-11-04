import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from '../../firebase/firebaseConfig';


/**
 * Login con Google
 */
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const token = await user.getIdToken();

    return {
      user: {
        _id: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        password: ""
      },
      token
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

    const token = await user.getIdToken();

    return {
      user: {
        _id: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        password: ""
      },
      token
    };
  } catch (error) {
    console.error("Error en login con GitHub:", error);
    throw error;
  }
};
