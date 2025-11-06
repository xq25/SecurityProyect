import { Roles } from '../models/Roles';
import api from '../interceptors/axiosInterceptor';

const API_URL = import.meta.env.VITE_API_URL || "";
const BASE_PATH = "/roles";

class RolesService {
    async getRoless(): Promise<Roles[]> {
        try {
            const response = await api.get<Roles[]>(`${API_URL}${BASE_PATH}`);
            return Array.isArray(response.data) ? response.data : [];
        } catch (error: any) {
            console.error("❌ Error al obtener roles:", error.response?.data || error);
            throw error; // Lanzar error para que List.tsx lo capture
        }
    }

    async getRolesById(id: number | string): Promise<Roles | null> {
        try {
            const response = await api.get<Roles>(`${API_URL}${BASE_PATH}/${id}`);
            return response.data;
        } catch (error: any) {
            console.error(`❌ Rol con ID ${id} no encontrado:`, error.response?.data || error);
            throw error;
        }
    }

    async createRoles(roles: Omit<Roles, "id">): Promise<Roles | null> {
        try {
            const response = await api.post<Roles>(`${API_URL}${BASE_PATH}`, roles);
            return response.data;
        } catch (error: any) {
            console.error("❌ Error al crear rol:", error.response?.data || error);
            throw error;
        }
    }

    async updateRoles(id: number | string, roles: Partial<Roles>): Promise<Roles | null> {
        try {
            const response = await api.put<Roles>(`${API_URL}${BASE_PATH}/${id}`, roles);
            return response.data;
        } catch (error: any) {
            console.error("❌ Error al actualizar rol:", error.response?.data || error);
            throw error;
        }
    }

    async deleteRoles(id: number | string): Promise<boolean> {
        try {
            await api.delete(`${API_URL}${BASE_PATH}/${id}`);
            return true;
        } catch (error: any) {
            console.error("❌ Error al eliminar rol:", error.response?.data || error);
            throw error;
        }
    }
}

export const rolesService = new RolesService();