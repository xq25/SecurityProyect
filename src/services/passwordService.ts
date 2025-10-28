import axios from "axios";
import { Password } from "../models/Password";

const API_URL = import.meta.env.VITE_API_URL + "/passwords" || "";

/**
 * Servicio para gestionar contraseñas (Passwords)
 * Métodos: listar, obtener, crear, actualizar y eliminar.
 */
class PasswordService {
  // 🔹 Obtener todas las contraseñas
  async getPasswords(): Promise<Password[]> {
    try {
      const response = await axios.get<Password[]>(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error al obtener contraseñas:", error);
      return [];
    }
  }

  // 🔹 Obtener una contraseña por ID
  async getPasswordById(id: number): Promise<Password | null> {
    try {
      const response = await axios.get<Password>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Contraseña no encontrada:", error);
      return null;
    }
  }

  // 🔹 Obtener contraseñas por ID de usuario
  async getPasswordsByUserId(userId: number): Promise<Password[]> {
    try {
      const response = await axios.get<Password[]>(`${API_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener contraseñas del usuario:", error);
      return [];
    }
  }

  // 🔹 Crear una nueva contraseña
  async createPassword(userId: number, password: Omit<Password, "id">): Promise<Password | null> {
    try {
      const response = await axios.post<Password>(`${API_URL}/user/${userId}`, password, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear contraseña:", error);
      return null;
    }
  }

  // 🔹 Actualizar una contraseña
  async updatePassword(id: number, password: Partial<Password>): Promise<Password | null> {
    try {
      const response = await axios.put<Password>(`${API_URL}/${id}`, password, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error al actualizar contraseña:", error);
      return null;
    }
  }

  // 🔹 Eliminar una contraseña
  async deletePassword(id: number): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar contraseña:", error);
      return false;
    }
  }
  getCurrentDateTime(): string {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}

// ✅ Exportamos una instancia reutilizable
export const passwordService = new PasswordService();
