import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, microsoftProvider } from '../../firebase/firebaseConfig';


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

export const loginWithMicrosoft = async () => {
  try {
    const result = await signInWithPopup(auth, microsoftProvider);
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
    console.error("Error en login con Microsoft:", error);
    throw error;
  }
};