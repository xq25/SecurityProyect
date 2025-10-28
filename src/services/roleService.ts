import axios from "axios";
import { Roles } from '../models/Roles' // Asegúrate de tener un modelo Roles.ts definido

const API_URL = import.meta.env.VITE_API_URL + "/roles" || "";

class RolesService {
    // ✅ Obtener todos los roless
    async getRoless(): Promise<Roles[]> {
        try {
            const response = await axios.get<Roles[]>(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error al obtener roless:", error);
            return [];
        }
    }

    // ✅ Obtener un rol por ID
    async getRolesById(id: number): Promise<Roles | null> {
        try {
            const response = await axios.get<Roles>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Rol con ID ${id} no encontrado:`, error);
            return null;
        }
    }

    // ✅ Crear un nuevo rol
    async createRoles(roles: Omit<Roles, "id">): Promise<Roles | null> {
        try {
            const response = await axios.post<Roles>(API_URL, roles);
            return response.data;
        } catch (error) {
            console.error("Error al crear rol:", error);
            return null;
        }
    }

    // ✅ Actualizar un rol existente
    async updateRoles(id: number, roles: Partial<Roles>): Promise<Roles | null> {
        try {
            const response = await axios.put<Roles>(`${API_URL}/${id}`, roles);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar rol:", error);
            return null;
        }
    }

    // ✅ Eliminar un rol
    async deleteRoles(id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar rol:", error);
            return false;
        }
    }
}

// Exportamos una sola instancia reutilizable
export const rolesService = new RolesService();
