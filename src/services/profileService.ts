import api from '../interceptors/axiosInterceptor';
import { Profile } from "../models/Profile";

const API_URL = import.meta.env.VITE_API_URL || "";

class ProfileService {
  /**
   * Obtener todos los perfiles
   */
  async getProfiles(): Promise<Profile[]> {
    try {
      console.log(`🔍 GET: ${API_URL}/profiles`);
      const response = await api.get<Profile[]>(`${API_URL}/profiles`);
      console.log('✅ Profiles loaded:', response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching profiles:", error);
      throw error;
    }
  }

  /**
   * Obtener perfil por ID
   */
  async getProfileById(id: number): Promise<Profile> {
    try {
      console.log(`🔍 GET: ${API_URL}/profiles/${id}`);
      const response = await api.get<Profile>(`${API_URL}/profiles/${id}`);
      console.log('✅ Profile loaded:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching profile ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crear nuevo perfil
   */
  async createProfile(profile: Partial<Profile>): Promise<Profile> {
    try {
      console.log(`📝 POST: ${API_URL}/profiles`, profile);
      const response = await api.post<Profile>(`${API_URL}/profiles`, profile);
      console.log('✅ Profile created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error creating profile:", error);
      const errorMsg = error.response?.data?.error || 
                       error.response?.data?.message || 
                       'No se pudo crear el perfil';
      throw new Error(errorMsg);
    }
  }

  /**
   * Actualizar perfil
   */
  async updateProfile(id: number, profile: Partial<Profile>): Promise<Profile> {
    try {
      console.log(`📝 PUT: ${API_URL}/profiles/${id}`, profile);
      const response = await api.put<Profile>(`${API_URL}/profiles/${id}`, profile);
      console.log('✅ Profile updated:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error updating profile ${id}:`, error);
      const errorMsg = error.response?.data?.error || 
                       error.response?.data?.message || 
                       'No se pudo actualizar el perfil';
      throw new Error(errorMsg);
    }
  }

  /**
   * Eliminar perfil
   */
  async deleteProfile(id: number): Promise<boolean> {
    try {
      console.log(`🗑️ DELETE: ${API_URL}/profiles/${id}`);
      await api.delete(`${API_URL}/profiles/${id}`);
      console.log('✅ Profile deleted');
      return true;
    } catch (error: any) {
      console.error(`❌ Error deleting profile ${id}:`, error);
      const errorMsg = error.response?.data?.error || 
                       error.response?.data?.message || 
                       'No se pudo eliminar el perfil';
      throw new Error(errorMsg);
    }
  }

  /**
   * Obtener perfil por User ID
   */
  async getProfileByUserId(userId: number): Promise<Profile> {
    try {
      console.log(`🔍 GET: ${API_URL}/profiles/user/${userId}`);
      const response = await api.get<Profile>(`${API_URL}/profiles/user/${userId}`);
      console.log('✅ Profile by user loaded:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching profile for user ${userId}:`, error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();
export default profileService;