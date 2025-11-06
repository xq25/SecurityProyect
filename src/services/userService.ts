import { User } from "../models/User";
import api from "../interceptors/axiosInterceptor";

const API_URL = `${import.meta.env.VITE_API_URL}/users`;

class UserService {
    async getUsers(): Promise<User[]> {  //async lo usamos para decir que espere a que se ejecute esta funcion para hacer algo mas. 
        //Promise nos indica que nos va a devolver esta funcion al terminar.
        try {
            const response = await api.get<User[]>(API_URL); //await indica que se debe esperar a que s eejecute un proceso para seguir con la siguiente linea de codigo  //Al colocar el <User[]> hacemos el casteo automatico que lo que se envie es una lista de instancias de la clase User .
            return response.data;
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            return [];
        }
    }

    async getUserById(id: number): Promise<User | null> {
        try {
            const response = await api.get<User>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Usuario no encontrado:", error);
            return null;
        }
    }
   


    async getUserByEmail(email: string): Promise<User | null> {
  try {
    console.log("🔍 Buscando usuario por email:", email);
    const response = await api.get(`${API_URL}/`);
    console.log("📋 Total usuarios en backend:", response.data.length);
    
    const users: User[] = response.data;
    const user = users.find(u => u.email === email);
    
    if (user) {
    } else {
      console.log("❌ Usuario NO encontrado en backend");
    }
    
    return user || null;
  } catch (error) {
    console.error("❌ Error getting user by email:", error);
    return null;
  }
}

async createUser(userData: Partial<User>): Promise<User | null> {
  try {
    console.log("📝 Creando usuario en backend:", userData);
    const response = await api.post(`${API_URL}/`, userData);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error creating user:", error);
    console.error("❌ Error response:", error.response?.data);
    return null;
  }
}

    async updateUser(id: number, user: Partial<User>): Promise<User | null> {
        try {
            const response = await api.put<User>(`${API_URL}/${id}`, user);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            return null;
        }
    }

    async deleteUser(id: number): Promise<boolean> {
        try {
            await api.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            return false;
        }
    }

}

// Exportamos una instancia de la clase para reutilizarla
export const userService = new UserService();
