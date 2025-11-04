import axios from "axios";
import { Permission } from "../models/Permission";

const API_URL = (import.meta.env.VITE_API_URL || "") + "/permissions";

class PermissionService {
  async getPermissions(): Promise<Permission[]> {
    try {
      const response = await axios.get<Permission[]>(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching permissions:", error);
      return [];
    }
  }

  async getPermissionById(id: number): Promise<Permission | null> {
    try {
      const response = await axios.get<Permission>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching permission:", error);
      return null;
    }
  }

  async createPermission(permission: Omit<Permission, "id">): Promise<Permission | null> {
    try {
      const response = await axios.post<Permission>(API_URL, permission);
      return response.data;
    } catch (error) {
      console.error("Error creating permission:", error);
      return null;
    }
  }

  async updatePermission(id: number, permission: Partial<Permission>): Promise<boolean> {
    try {
      await axios.put(`${API_URL}/${id}`, permission);
      return true;
    } catch (error) {
      console.error("Error updating permission:", error);
      return false;
    }
  }

  async deletePermission(id: number): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting permission:", error);
      return false;
    }
  }
}

export const permissionService = new PermissionService();