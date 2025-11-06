import api from '../interceptors/axiosInterceptor';
import { Session } from "../models/Session";

const API_URL = import.meta.env.VITE_API_URL || "";

class SessionService {
  /**
   * Obtener todas las sesiones
   */
  async getSessions(): Promise<Session[]> {
    try {
      console.log(`🔍 GET: ${API_URL}/sessions`);
      const response = await api.get<Session[]>(`${API_URL}/sessions`);
      console.log('✅ Sessions loaded:', response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching sessions:", error);
      throw error;
    }
  }

  /**
   * Obtener sesión por ID
   */
  async getSessionById(id: string): Promise<Session> {
    try {
      console.log(`🔍 GET: ${API_URL}/sessions/${id}`);
      const response = await api.get<Session>(`${API_URL}/sessions/${id}`);
      console.log('✅ Session loaded:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching session ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crear nueva sesión
   */
  async createSession(session: Partial<Session>): Promise<Session> {
    try {
      console.log(`📝 POST: ${API_URL}/sessions`, session);
      const response = await api.post<Session>(`${API_URL}/sessions`, session);
      console.log('✅ Session created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error creating session:", error);
      const errorMsg = error.response?.data?.error || 
                       error.response?.data?.message || 
                       'No se pudo crear la sesión';
      throw new Error(errorMsg);
    }
  }

  /**
   * Actualizar sesión
   */
  async updateSession(id: string, session: Partial<Session>): Promise<Session> {
    try {
      console.log(`📝 PUT: ${API_URL}/sessions/${id}`, session);
      const response = await api.put<Session>(`${API_URL}/sessions/${id}`, session);
      console.log('✅ Session updated:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error updating session ${id}:`, error);
      const errorMsg = error.response?.data?.error || 
                       error.response?.data?.message || 
                       'No se pudo actualizar la sesión';
      throw new Error(errorMsg);
    }
  }

  /**
   * Eliminar sesión
   */
  async deleteSession(id: string): Promise<boolean> {
    try {
      console.log(`🗑️ DELETE: ${API_URL}/sessions/${id}`);
      await api.delete(`${API_URL}/sessions/${id}`);
      console.log('✅ Session deleted');
      return true;
    } catch (error: any) {
      console.error(`❌ Error deleting session ${id}:`, error);
      const errorMsg = error.response?.data?.error || 
                       error.response?.data?.message || 
                       'No se pudo eliminar la sesión';
      throw new Error(errorMsg);
    }
  }

  /**
   * Obtener sesiones activas de un usuario
   */
  async getActiveSessionsByUserId(userId: number): Promise<Session[]> {
    try {
      console.log(`🔍 GET: ${API_URL}/sessions/user/${userId}/active`);
      const response = await api.get<Session[]>(`${API_URL}/sessions/user/${userId}/active`);
      console.log('✅ Active sessions loaded:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching active sessions for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Cerrar sesión (logout)
   */
  async closeSession(id: string): Promise<boolean> {
    try {
      console.log(`📝 POST: ${API_URL}/sessions/${id}/close`);
      await api.post(`${API_URL}/sessions/${id}/close`);
      console.log('✅ Session closed');
      return true;
    } catch (error: any) {
      console.error(`❌ Error closing session ${id}:`, error);
      const errorMsg = error.response?.data?.error || 
                       error.response?.data?.message || 
                       'No se pudo cerrar la sesión';
      throw new Error(errorMsg);
    }
  }
}

export const sessionService = new SessionService();
export default sessionService;