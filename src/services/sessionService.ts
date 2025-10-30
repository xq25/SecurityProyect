import axios from "axios";
import { Session } from "../models/Session";

const API_URL = (import.meta.env.VITE_API_URL || "") + "/sessions";

class SessionService {
  /**
   * Obtener todas las sesiones de un usuario (1:N)
   */
  async getSessionsByUser(userId: number): Promise<Session[]> {
    try {
      const response = await axios.get<Session[]>(`${API_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching sessions:", error);
      return [];
    }
  }

  /**
   * Invalidar/eliminar una sesión
   */
  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/${sessionId}`);
      return true;
    } catch (error) {
      console.error("Error deleting session:", error);
      return false;
    }
  }
}

export const sessionService = new SessionService();