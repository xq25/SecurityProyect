import { Navigate, Outlet } from "react-router-dom";

// Función para verificar si el usuario está autenticado
const isAuthenticated = () => {
    const user = localStorage.getItem("user"); //Validamos si tenemos un suario logueado en nuestro LocalStorage
    return user ? true : false;
};

// Componente de Ruta Protegida
const ProtectedRoute = () => {
    //Si esta autentificado carga la pagina, sino lo devuelve al login para que inicie sesion 
    return isAuthenticated() ? <Outlet /> : <Navigate to="/auth/signin" replace />;
};

export default ProtectedRoute;
