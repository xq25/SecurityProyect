import axios from "axios";
import { Session } from "../models/Session";

const API_URL = (import.meta.env.VITE_API_URL || "") + "/sessions";

class SessionService {
  async getSessionsByUser(userId: string): Promise<Session[]> {
    try {
      console.log("🔍 Fetching sessions for user:", userId);
      console.log("🌐 API URL:", `${API_URL}/user/${userId}`);
      
      const response = await axios.get<Session[]>(`${API_URL}/user/${userId}`);
      
      console.log("✅ Sessions response:", response.data);
      console.log("📊 Number of sessions:", response.data.length);
      
      return response.data;
    } catch (error: any) {
      console.error("❌ Error fetching sessions:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Status code:", error.response?.status);
      
      if (error.response?.status === 404) {
        return [];
      }
      return [];
    }
  }

  async getSessionById(sessionId: string): Promise<Session | null> {
    try {
      const response = await axios.get<Session>(`${API_URL}/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching session:", error);
      return null;
    }
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/${sessionId}`);
      return true;
    } catch (error) {
      console.error("Error deleting session:", error);
      return false;
    }
  }

  async deleteAllUserSessions(userId: string): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/user/${userId}`);
      return true;
    } catch (error) {
      console.error("Error deleting all sessions:", error);
      return false;
    }
  }
}

export const sessionService = new SessionService();