import axios from "axios";
import { Session } from "../models/Session";

const API_URL = import.meta.env.VITE_API_URL || "/api";

class SessionService {
  /**
   * Get all sessions
   */
  async getSessions(): Promise<Session[]> {
    try {
      const response = await axios.get(`${API_URL}/sessions/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  }

  /**
   * Get a session by ID
   */
  async getSessionById(sessionId: string): Promise<Session> {
    try {
      const response = await axios.get(`${API_URL}/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching session ${sessionId}:`, error);
      throw error;
    }
  }

  /**
   * Get all sessions for a specific user
   */
  async getSessionsByUser(userId: string): Promise<Session[]> {
    try {
      const response = await axios.get(`${API_URL}/sessions/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sessions for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new session for a user
   * Note: expiration should be formatted as "YYYY-MM-DD HH:MM:SS"
   */
  async createSession(userId: number, sessionData: Partial<Session>): Promise<Session> {
    try {
      const payload: any = { ...sessionData };
      
      // Format expiration date if present
      if (payload.expiration) {
        const date = new Date(payload.expiration);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        payload.expiration = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }

      console.log(`📝 POST: ${API_URL}/sessions/user/${userId}`, payload);
      const response = await axios.post(`${API_URL}/sessions/user/${userId}`, payload);
      console.log(`✅ Created:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error creating session for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update an existing session
   */
  async updateSession(sessionId: string, sessionData: Partial<Session>): Promise<Session> {
    try {
      const payload: any = { ...sessionData };
      
      // Format expiration date if present
      if (payload.expiration) {
        const date = new Date(payload.expiration);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        payload.expiration = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }

      console.log(`📝 PUT: ${API_URL}/sessions/${sessionId}`, payload);
      const response = await axios.put(`${API_URL}/sessions/${sessionId}`, payload);
      console.log(`✅ Updated:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating session ${sessionId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a session
   */
  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      console.log(`🗑️ DELETE: ${API_URL}/sessions/${sessionId}`);
      await axios.delete(`${API_URL}/sessions/${sessionId}`);
      console.log(`✅ Deleted`);
      return true;
    } catch (error) {
      console.error(`❌ Error deleting session ${sessionId}:`, error);
      return false;
    }
  }
}

export const sessionService = new SessionService();
export default sessionService;