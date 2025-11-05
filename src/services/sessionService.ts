import axios from '../interceptors/axiosInterceptor';
import { Session } from '../models/Session';

const API_URL = import.meta.env.VITE_API_URL || '';
const BASE_PATH = '/sessions';

class SessionService {
  /**
   * Formatea la fecha al formato esperado por el backend
   * Formato: "YYYY-MM-DD HH:MM:SS"
   */
  private formatExpiration(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * Obtener todas las sesiones
   */
  async getSessions(): Promise<Session[]> {
    try {
      console.log('📡 Fetching all sessions...');
      const response = await axios.get(`${API_URL}${BASE_PATH}/`);
      console.log('✅ Sessions received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching sessions:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Obtener sesión por ID
   */
  async getSessionById(sessionId: string): Promise<Session> {
    try {
      const response = await axios.get(`${API_URL}${BASE_PATH}/${sessionId}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error fetching session ${sessionId}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Obtener sesiones de un usuario
   */
  async getSessionsByUserId(userId: number | string): Promise<Session[]> {
    try {
      console.log(`📡 Fetching sessions for user ${userId}...`);
      const response = await axios.get(`${API_URL}${BASE_PATH}/user/${userId}`);
      
      let sessions: Session[] = [];
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(response.data)) {
        sessions = response.data;
      } else if (response.data.sessions) {
        sessions = response.data.sessions;
      } else if (response.data.data) {
        sessions = response.data.data;
      }
      
      console.log('✅ Sessions received:', sessions);
      return sessions;
    } catch (error: any) {
      console.error(`❌ Error fetching sessions for user ${userId}:`, error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Crear sesión para un usuario
   */
  async createSession(userId: number | string, sessionData: Partial<Session>): Promise<Session> {
    try {
      console.log(`📝 Creating session for user ${userId}...`);
      
      const payload: any = {
        userId: String(userId),
        token: sessionData.token || '',
        FACode: sessionData.FACode || '',
        State: sessionData.State || 'active'
      };
      
      // Formatear fecha de expiración
      if (sessionData.expiration) {
        payload.expiration = this.formatExpiration(sessionData.expiration);
      } else {
        // Si no hay expiración, establecer 24 horas desde ahora
        const defaultExpiration = new Date();
        defaultExpiration.setHours(defaultExpiration.getHours() + 24);
        payload.expiration = this.formatExpiration(defaultExpiration);
      }
      
      console.log('📦 Payload:', payload);
      
      const response = await axios.post(`${API_URL}${BASE_PATH}/user/${userId}`, payload);
      
      console.log('✅ Session created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error creating session for user ${userId}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Actualizar sesión
   */
  async updateSession(sessionId: string, sessionData: Partial<Session>): Promise<Session> {
    try {
      const payload: any = {};
      
      if (sessionData.token !== undefined) payload.token = sessionData.token;
      if (sessionData.userId !== undefined) payload.userId = sessionData.userId;
      if (sessionData.FACode !== undefined) payload.FACode = sessionData.FACode;
      if (sessionData.State !== undefined) payload.State = sessionData.State;
      if (sessionData.state !== undefined) payload.state = sessionData.state;
      
      // Formatear fecha de expiración si existe
      if (sessionData.expiration) {
        payload.expiration = this.formatExpiration(sessionData.expiration);
      }
      
      console.log('📝 Updating session:', sessionId, payload);
      
      const response = await axios.put(`${API_URL}${BASE_PATH}/${sessionId}`, payload);
      
      console.log('✅ Session updated:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error updating session ${sessionId}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Eliminar sesión
   */
  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      console.log(`🗑️ Deleting session ${sessionId}...`);
      await axios.delete(`${API_URL}${BASE_PATH}/${sessionId}`);
      console.log('✅ Session deleted');
      return true;
    } catch (error: any) {
      console.error(`❌ Error deleting session ${sessionId}:`, error.response?.data || error.message);
      return false;
    }
  }

  /**
   * Cerrar sesión (marcar como expirada/revocada)
   */
  async endSession(sessionId: string): Promise<Session> {
    try {
      console.log(`🔒 Ending session ${sessionId}...`);
      return await this.updateSession(sessionId, {
        state: 'revoked'
      });
    } catch (error) {
      throw error;
    }
  }
}

export const sessionService = new SessionService();
export default sessionService;