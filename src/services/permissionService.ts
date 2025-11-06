import axios from "axios";
import { Permission } from "../models/Permission";

const API_URL = import.meta.env.VITE_API_URL || "";
const BASE_PATH = "/permissions/";  // ✅ Agregar / al final

class PermissionService {
  /**
   * Obtener todos los permisos
   */
  async getPermissions(): Promise<Permission[]> {
    try {
      console.log("📋 Fetching all permissions...");
      const response = await axios.get<Permission[]>(`${API_URL}${BASE_PATH}`);
      console.log("✅ Permissions loaded:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error fetching permissions:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Obtener permiso por ID
   */
  async getPermissionById(id: number): Promise<Permission> {
    try {
      console.log(`🔍 Fetching permission ${id}...`);
      const response = await axios.get<Permission>(`${API_URL}${BASE_PATH}${id}`);
      console.log("✅ Permission loaded:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error fetching permission ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Crear nuevo permiso
   */
  async createPermission(permission: Omit<Permission, "id" | "created_at" | "updated_at">): Promise<Permission> {
    try {
      // ✅ Enviar todos los formatos posibles para compatibilidad
      const payload = {
        entity: permission.URL || permission.url || permission.entity,
        URL: permission.URL || permission.url || permission.entity,
        url: permission.URL || permission.url || permission.entity,
        method: permission.method,
      };
      
      console.log("📝 Creating permission with payload:", payload);
      const response = await axios.post<Permission>(`${API_URL}${BASE_PATH}`, payload);
      console.log("✅ Permission created:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error creating permission:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Actualizar permiso
   */
  async updatePermission(id: number, permission: Partial<Permission>): Promise<Permission> {
    try {
      // ✅ Enviar todos los formatos
      const payload = {
        entity: permission.URL || permission.url || permission.entity,
        URL: permission.URL || permission.url || permission.entity,
        url: permission.URL || permission.url || permission.entity,
        method: permission.method,
      };
      
      console.log(`📝 Updating permission ${id} with payload:`, payload);
      const response = await axios.put<Permission>(`${API_URL}${BASE_PATH}${id}`, payload);
      console.log("✅ Permission updated:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error updating permission ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Eliminar permiso
   */
  async deletePermission(id: number): Promise<boolean> {
    try {
      console.log(`🗑️ Deleting permission ${id}...`);
      await axios.delete(`${API_URL}${BASE_PATH}${id}`);
      console.log("✅ Permission deleted");
      return true;
    } catch (error: any) {
      console.error(`❌ Error deleting permission ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }
}

export const permissionService = new PermissionService();
export default permissionService;