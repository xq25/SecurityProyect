import axios from 'axios';
import { auth } from '../firebase/firebaseConfig';

// Configurar interceptor para incluir token en todas las peticiones
axios.interceptors.request.use(
  async (config) => {
    try {
      // Obtener el usuario actual de Firebase
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        // Obtener token fresco de Firebase
        const token = await currentUser.getIdToken(true);
        
        // Agregar token al header Authorization
        config.headers.Authorization = `Bearer ${token}`;
        
        console.log('🔑 Token agregado a la petición');
      } else {
        // Si no hay usuario, intentar obtener token del localStorage (fallback)
        const storedToken = localStorage.getItem('token');
        
        if (storedToken) {
          config.headers.Authorization = `Bearer ${storedToken}`;
          console.log('🔑 Token del localStorage agregado');
        }
      }
      
      return config;
    } catch (error) {
      console.error('❌ Error obteniendo token:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si el error es 401 (No autorizado) y no hemos reintentado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const currentUser = auth.currentUser;
        
        if (currentUser) {
          // Renovar token
          const newToken = await currentUser.getIdToken(true);
          
          // Actualizar en localStorage
          localStorage.setItem('token', newToken);
          
          // Reintentar petición con nuevo token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        } else {
          // No hay usuario, redirigir a login
          console.error('❌ No hay usuario autenticado');
          localStorage.clear();
          window.location.href = '/auth/signin';
        }
      } catch (refreshError) {
        console.error('❌ Error renovando token:', refreshError);
        localStorage.clear();
        window.location.href = '/auth/signin';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axios;