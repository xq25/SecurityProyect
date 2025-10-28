import { signInWithPopup } from "firebase/auth";
<<<<<<< HEAD
import { auth, googleProvider, microsoftProvider } from '../../firebase/firebaseConfig';
=======
import { auth, googleProvider, githubProvider } from '../../firebase/firebaseConfig';
>>>>>>> 1f9e425cc553c28d53daca23e9b44540f304efd2


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

<<<<<<< HEAD
export const loginWithMicrosoft = async () => {
  try {
    const result = await signInWithPopup(auth, microsoftProvider);
    const user = result.user;
=======
export const loginWithGitHub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;

>>>>>>> 1f9e425cc553c28d53daca23e9b44540f304efd2
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
<<<<<<< HEAD
    console.error("Error en login con Microsoft:", error);
    throw error;
  }
};
=======
    console.error("Error en login con GitHub:", error);
    throw error;
  }
};
>>>>>>> 1f9e425cc553c28d53daca23e9b44540f304efd2
