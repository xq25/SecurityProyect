import axios from "axios";
import { RolePermission } from "../models/RolePermission";
import { Permission } from "../models/Permission";

const API_URL = (import.meta.env.VITE_API_URL || "") + "/role-permissions";

class RolePermissionService {
  /**
   * Obtener todos los permisos asignados a un rol
   */
  async getPermissionsByRole(roleId: number): Promise<Permission[]> {
    try {
      const response = await axios.get<Permission[]>(`${API_URL}/role/${roleId}/permissions`);
      return response.data;
    } catch (error) {
      console.error("Error fetching role permissions:", error);
      return [];
    }
  }

  /**
   * Asignar un permiso a un rol
   */
  async assignPermission(roleId: number, permissionId: number): Promise<RolePermission | null> {
    try {
      const response = await axios.post<RolePermission>(API_URL, {
        roleId,
        permissionId,
        startAt: new Date(),
      });
      return response.data;
    } catch (error) {
      console.error("Error assigning permission:", error);
      return null;
    }
  }

  /**
   * Remover un permiso de un rol
   */
  async removePermission(rolePermissionId: string): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/${rolePermissionId}`);
      return true;
    } catch (error) {
      console.error("Error removing permission:", error);
      return false;
    }
  }
}

export const rolePermissionService = new RolePermissionService();