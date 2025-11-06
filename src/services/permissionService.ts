import api from '../interceptors/axiosInterceptor';
import { Permission } from "../models/Permission";

const API_URL = import.meta.env.VITE_API_URL || "";

class PermissionService {
  /**
   * Obtener todos los permisos
   */
  async getPermissions(): Promise<Permission[]> {
    try {
      console.log('📋 Fetching all permissions...');
      const response = await api.get<Permission[]>(`${API_URL}/permissions`);
      console.log('✅ Permissions loaded:', response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching permissions:", error);
      throw error;
    }
  }

  /**
   * Obtener permiso por ID
   */
  async getPermissionById(id: number): Promise<Permission> {
    try {
      console.log(`🔍 GET: ${API_URL}/permissions/${id}`);
      const response = await api.get<Permission>(`${API_URL}/permissions/${id}`);
      console.log('✅ Permission loaded:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching permission ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crear nuevo permiso
   */
  async createPermission(permission: Partial<Permission>): Promise<Permission> {
    try {
      console.log(`📝 POST: ${API_URL}/permissions`, permission);
      const response = await api.post<Permission>(`${API_URL}/permissions`, permission);
      console.log('✅ Permission created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error creating permission:", error);
      const errorMsg = error.response?.data?.error || 
                       error.response?.data?.message || 
                       'No se pudo crear el permiso';
      throw new Error(errorMsg);
    }
  }

  /**
   * Actualizar permiso
   */
  async updatePermission(id: number, permission: Partial<Permission>): Promise<Permission> {
    try {
      console.log(`📝 PUT: ${API_URL}/permissions/${id}`, permission);
      const response = await api.put<Permission>(`${API_URL}/permissions/${id}`, permission);
      console.log('✅ Permission updated:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error updating permission ${id}:`, error);
      const errorMsg = error.response?.data?.error || 
                       error.response?.data?.message || 
                       'No se pudo actualizar el permiso';
      throw new Error(errorMsg);
    }
  }

  /**
   * Eliminar permiso
   */
  async deletePermission(id: number): Promise<boolean> {
    try {
      console.log(`🗑️ DELETE: ${API_URL}/permissions/${id}`);
      await api.delete(`${API_URL}/permissions/${id}`);
      console.log('✅ Permission deleted');
      return true;
    } catch (error: any) {
      console.error(`❌ Error deleting permission ${id}:`, error);
      const errorMsg = error.response?.data?.error || 
                       error.response?.data?.message || 
                       'No se pudo eliminar el permiso';
      throw new Error(errorMsg);
    }
  }

  /**
   * Obtener permisos por método HTTP
   */
  async getPermissionsByMethod(method: string): Promise<Permission[]> {
    try {
      console.log(`🔍 GET: ${API_URL}/permissions?method=${method}`);
      const response = await api.get<Permission[]>(`${API_URL}/permissions`, {
        params: { method }
      });
      console.log('✅ Permissions by method loaded:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching permissions by method ${method}:`, error);
      throw error;
    }
  }
}

export const permissionService = new PermissionService();
export default permissionService;