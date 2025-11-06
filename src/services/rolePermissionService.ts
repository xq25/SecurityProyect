import api from '../interceptors/axiosInterceptor';
import { RolePermission } from "../models/RolePermission";
import { Permission } from "../models/Permission";

const API_URL = import.meta.env.VITE_API_URL || "";

class RolePermissionService {
  /**
   * Obtener todos los permisos asignados a un rol
   */
  async getPermissionsByRole(roleId: number): Promise<any[]> {
    try {
      console.log(`🔍 GET: ${API_URL}/role-permissions/role/${roleId}`);
      const response = await api.get<any[]>(`${API_URL}/role-permissions/role/${roleId}`);
      
      console.log(`✅ Role-Permissions loaded:`, response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error("❌ Error fetching role permissions:", error);
      return [];
    }
  }

  /**
   * Obtener todas las relaciones role-permission
   */
  async getAllRolePermissions(): Promise<RolePermission[]> {
    try {
      console.log(`🔍 GET: ${API_URL}/role-permissions`);
      const response = await api.get<RolePermission[]>(`${API_URL}/role-permissions`);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching all role-permissions:", error);
      throw error;
    }
  }

  /**
   * Asignar un permiso a un rol
   * Endpoint: POST /role-permissions/role/{role_id}/permission/{permission_id}
   */
  async assignPermission(roleId: number, permissionId: number): Promise<RolePermission> {
    try {
      console.log(`📝 POST: ${API_URL}/role-permissions/role/${roleId}/permission/${permissionId}`);
      const response = await api.post<RolePermission>(
        `${API_URL}/role-permissions/role/${roleId}/permission/${permissionId}`,
        {} // El backend no requiere body, solo los parámetros de la URL
      );
      console.log(`✅ Permission assigned:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error assigning permission:", error.response?.data || error);
      
      const errorMsg = error.response?.data?.error || 
                       error.response?.data?.message || 
                       error.message || 
                       'No se pudo asignar el permiso';
      
      throw new Error(errorMsg);
    }
  }

  /**
   * Remover un permiso de un rol
   * Opción 1: DELETE /role-permissions/role/{role_id}/permission/{permission_id}
   * Opción 2: DELETE /role-permissions/{role_permission_id}
   */
  async removePermission(roleId: number, permissionId: number): Promise<boolean> {
    try {
      console.log(`🗑️ DELETE: ${API_URL}/role-permissions/role/${roleId}/permission/${permissionId}`);
      await api.delete(`${API_URL}/role-permissions/role/${roleId}/permission/${permissionId}`);
      console.log(`✅ Permission removed`);
      return true;
    } catch (error: any) {
      console.error("❌ Error removing permission:", error.response?.data || error);
      
      const errorMsg = error.response?.data?.error || 
                       error.response?.data?.message || 
                       error.message || 
                       'No se pudo remover el permiso';
      
      throw new Error(errorMsg);
    }
  }

  /**
   * Remover un permiso por ID de la relación
   */
  async removePermissionById(rolePermissionId: string): Promise<boolean> {
    try {
      console.log(`🗑️ DELETE: ${API_URL}/role-permissions/${rolePermissionId}`);
      await api.delete(`${API_URL}/role-permissions/${rolePermissionId}`);
      console.log(`✅ Permission removed by ID`);
      return true;
    } catch (error: any) {
      console.error("❌ Error removing permission by ID:", error.response?.data || error);
      
      const errorMsg = error.response?.data?.error || 
                       error.response?.data?.message || 
                       error.message || 
                       'No se pudo remover el permiso';
      
      throw new Error(errorMsg);
    }
  }
}

export const rolePermissionService = new RolePermissionService();
export default rolePermissionService;