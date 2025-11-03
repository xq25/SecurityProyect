import axios from "axios";
import { UserRole } from "../models/UserRole";

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, ""); // e.g. "http://localhost:5000/api"
// backend registra blueprint en '/api/user-roles' (guion) -> usar mismo segmento
const API_URL = API_BASE.endsWith("/user-roles") ? API_BASE : `${API_BASE}/user-roles`;

const formatDateForBackend = (input?: string | Date): string | undefined => {
  if (!input) return undefined;
  const d = typeof input === "string" ? new Date(input) : input;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

class UserRoleService {
  async getAll(): Promise<UserRole[]> {
    try {
      const url = `${API_URL}`;
      console.debug("[userRoleService] GET url:", url);
      const res = await axios.get<UserRole[]>(url);
      return res.data;
    } catch (error: any) {
      console.error("Error al obtener relaciones usuario-rol:", error);
      return [];
    }
  }

  async getById(id: string): Promise<UserRole | null> {
    try {
      const url = `${API_URL}/${id}`;
      console.debug("[userRoleService] GET url:", url);
      const res = await axios.get<UserRole>(url);
      return res.data;
    } catch (error: any) {
      console.error("Error al obtener la relación usuario-rol:", error);
      return null;
    }
  }

  async getByUserId(userId: string): Promise<UserRole[]> {
    try {
      const url = `${API_URL}/user/${userId}`;
      console.debug("[userRoleService] GET url:", url);
      const res = await axios.get<UserRole[]>(url);
      return res.data;
    } catch (error: any) {
      console.error("Error al obtener roles por usuario:", error);
      if (error?.response?.status === 404) return [];
      return [];
    }
  }

  async getByRoleId(roleId: string): Promise<UserRole[]> {
    try {
      const url = `${API_URL}/role/${roleId}`;
      console.debug("[userRoleService] GET url:", url);
      const res = await axios.get<UserRole[]>(url);
      return res.data;
    } catch (error: any) {
      console.error("Error al obtener usuarios por rol:", error);
      if (error?.response?.status === 404) return [];
      return [];
    }
  }

  async create(userId: number, roleId: number, data: Partial<UserRole>): Promise<UserRole | null> {
    try {
      const payload: any = {};
      if (data.startAt) payload.startAt = formatDateForBackend(data.startAt);
      if (data.endAt) payload.endAt = formatDateForBackend(data.endAt);

      const url = `${API_URL}/user/${userId}/role/${roleId}`;
      console.debug("[userRoleService] POST url:", url, "payload:", payload);
      const res = await axios.post<UserRole>(url, payload);
      return res.data;
    } catch (error: any) {
      console.error("Error creando relación usuario-rol:", error);
      return null;
    }
  }

  async update(id: string, data: Partial<UserRole>): Promise<UserRole | null> {
    try {
      const payload: any = { ...data };
      if (data.startAt) payload.startAt = formatDateForBackend(data.startAt);
      if (data.endAt) payload.endAt = formatDateForBackend(data.endAt);

      const url = `${API_URL}/${id}`;
      console.debug("[userRoleService] PUT url:", url, "payload:", payload);
      const res = await axios.put<UserRole>(url, payload);
      return res.data;
    } catch (error: any) {
      console.error("Error al actualizar relación usuario-rol:", error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const url = `${API_URL}/${id}`;
      console.debug("[userRoleService] DELETE url:", url);
      await axios.delete(url);
      return true;
    } catch (error: any) {
      console.error("Error al eliminar relación usuario-rol:", error);
      return false;
    }
  }
}

export const userRoleService = new UserRoleService();
