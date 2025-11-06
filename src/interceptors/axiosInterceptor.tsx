
import axios from "axios"; // Esta es la libreria que usamos para las APIs

// Lista de rutas que no deben ser interceptadas.

// No todos las peticiones que van al backend deben llevar un token de verificacion.
const EXCLUDED_ROUTES = ["/login", "/register"]; // Para que deberia tener estas peticiones un token, si estas son apenas las que nos general el token.

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Cambia la URL base según tu API (Aqui estamos usando nuestro postman)
    headers: { "Content-Type": "application/json" }, //Configuraamos el header general
});

// Interceptor de solicitud
api.interceptors.request.use(  //A qui pedimos que todas las peeticiones que van a la Api se intercepten
    (request) => {
        console.log(request.url)
        // Verificar si la URL está en la lista de excluidas
        if (EXCLUDED_ROUTES.some((route) => request.url?.includes(route))) { // Si la url de la peticion pertence a las rutas excluidas, dejamos pasar tal cual como viene.
            return request;
        }
        
        const token = localStorage.getItem("token"); // Aqui sacamos el token que tenemos en nuestro localStorage (Esto solo existe si esta logueado el usuario)
        // Agregar token si la ruta no está excluida
        if (token) {
            // Interceptamos una peticion y le colocamos el token.
            request.headers.Authorization = `Bearer ${token}`; // La plabra 'bearer es obligatoria , es un estandar para idndetificar que lo que sigue despues es el token '
        }
        return request;
    },
    (error) => { // Si hay algun error nos devuleve el fallo.
        return Promise.reject(error);
    }
);

// Interceptor de respuesta del Backend (Podemos hacer un doble check para ver que la respuesta este bien )
api.interceptors.response.use(
    (response) => { // Si la respuesta es valida la dejamos pasar.
        return response;
    },
    (error) => {
        if (error.response?.status === 401) { // Si tenemos la un error 40X es porque enviamos algo invalido desde el front
            console.log("No autorizado, redirigiendo a login...");
            window.location.href = "/login"; // Redirigir si la sesión expira
        }
        // Otro tipo de error es el 500, que es un fallo dentro del backend.
        return Promise.reject(error);

    }
);

export default api;
// Para activar el interceptor hay que colocarlo en el userService