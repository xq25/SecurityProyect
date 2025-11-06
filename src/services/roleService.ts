import { Roles } from '../models/Roles';
import api from '../interceptors/axiosInterceptor';

const API_URL = import.meta.env.VITE_API_URL || "";
const BASE_PATH = "/roles";

class RolesService {
    async getRoless(): Promise<Roles[]> {
        try {
            console.log(`🔍 GET: ${API_URL}${BASE_PATH}`);
            const response = await api.get<Roles[]>(`${API_URL}${BASE_PATH}`);
            console.log(`✅ Roles loaded:`, response.data);
            return Array.isArray(response.data) ? response.data : [];
        } catch (error: any) {
            console.error("❌ Error al obtener roles:", error.response?.data || error);
            throw error; // Lanzar error para que List.tsx lo capture
        }
    }

    async getRolesById(id: number | string): Promise<Roles | null> {
        try {
            console.log(`🔍 GET: ${API_URL}${BASE_PATH}/${id}`);
            const response = await api.get<Roles>(`${API_URL}${BASE_PATH}/${id}`);
            console.log(`✅ Role loaded:`, response.data);
            return response.data;
        } catch (error: any) {
            console.error(`❌ Rol con ID ${id} no encontrado:`, error.response?.data || error);
            throw error;
        }
    }

    async createRoles(roles: Omit<Roles, "id">): Promise<Roles | null> {
        try {
            console.log(`📝 POST: ${API_URL}${BASE_PATH}`, roles);
            const response = await api.post<Roles>(`${API_URL}${BASE_PATH}`, roles);
            console.log(`✅ Role created:`, response.data);
            return response.data;
        } catch (error: any) {
            console.error("❌ Error al crear rol:", error.response?.data || error);
            throw error;
        }
    }

    async updateRoles(id: number | string, roles: Partial<Roles>): Promise<Roles | null> {
        try {
            console.log(`📝 PUT: ${API_URL}${BASE_PATH}/${id}`, roles);
            const response = await api.put<Roles>(`${API_URL}${BASE_PATH}/${id}`, roles);
            console.log(`✅ Role updated:`, response.data);
            return response.data;
        } catch (error: any) {
            console.error("❌ Error al actualizar rol:", error.response?.data || error);
            throw error;
        }
    }

    async deleteRoles(id: number | string): Promise<boolean> {
        try {
            console.log(`🗑️ DELETE: ${API_URL}${BASE_PATH}/${id}`);
            await api.delete(`${API_URL}${BASE_PATH}/${id}`);
            console.log(`✅ Role deleted`);
            return true;
        } catch (error: any) {
            console.error("❌ Error al eliminar rol:", error.response?.data || error);
            throw error;
        }
    }
}

export const rolesService = new RolesService();