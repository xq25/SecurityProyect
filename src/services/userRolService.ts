import axios from "axios";
import { UserRole } from "../models/UserRole";

const API_URL = import.meta.env.VITE_API_URL + "/api/user_roles" || "";

class UserRoleService {
    // Obtener todas las relaciones usuario-rol
    async getAll(): Promise<UserRole[]> {
        try {
            const response = await axios.get<UserRole[]>(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error al obtener relaciones usuario-rol:", error);
            return [];
        }
    }

    // Obtener una relación específica por su ID
    async getById(id: string): Promise<UserRole | null> {
        try {
            const response = await axios.get<UserRole>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener la relación usuario-rol:", error);
            return null;
        }
    }

    // Obtener todas las relaciones por usuario
    async getByUserId(userId: string): Promise<UserRole[]> {
        try {
            const response = await axios.get<UserRole[]>(`${API_URL}/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener roles por usuario:", error);
            return [];
        }
    }

    // Obtener todas las relaciones por rol
    async getByRoleId(roleId: string): Promise<UserRole[]> {
        try {
            const response = await axios.get<UserRole[]>(`${API_URL}/role/${roleId}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener usuarios por rol:", error);
            return [];
        }
    }

    // Crear una nueva relación usuario-rol
    async create(userId: string, roleId: string, data: { startAt: string; endAt: string }): Promise<UserRole | null> {
        try {
            const response = await axios.post<UserRole>(`${API_URL}/${userId}/${roleId}`, data);
            return response.data;
        } catch (error) {
            console.error("Error al crear relación usuario-rol:", error);
            return null;
        }
    }

    // Actualizar una relación usuario-rol existente
    async update(id: string, data: Partial<UserRole>): Promise<UserRole | null> {
        try {
            const response = await axios.put<UserRole>(`${API_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar relación usuario-rol:", error);
            return null;
        }
    }

    // Eliminar una relación usuario-rol
    async delete(id: string): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar relación usuario-rol:", error);
            return false;
        }
    }
}

export const userRoleService = new UserRoleService();
