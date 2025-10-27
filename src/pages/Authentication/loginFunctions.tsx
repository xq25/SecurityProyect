import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../../firebase/firebaseConfig';

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
