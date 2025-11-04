import axios from "axios";
import { Profile } from "../models/Profile";

const API_URL = (import.meta.env.VITE_API_URL || "") + "/profiles";

class ProfileService {
  async getProfileByUser(userId: number): Promise<Profile | null> {
    try {
      const response = await axios.get<Profile>(`${API_URL}/user/${userId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error("Error fetching profile:", error);
      return null;
    }
  }

  async createProfile(userId: number, profileData: any): Promise<Profile | null> {
    try {
      const formData = new FormData();
      formData.append('phone', profileData.phone || '');
      
      if (profileData.photo && profileData.photo instanceof File) {
        formData.append('photo', profileData.photo);
      }
      
      const response = await axios.post<Profile>(`${API_URL}/user/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error: any) {
      console.error("Error creating profile:", error);
      return null;
    }
  }

  async updateProfile(profileId: number, profileData: any): Promise<boolean> {
    try {
      const formData = new FormData();
      
      if (profileData.phone !== undefined) {
        formData.append('phone', profileData.phone);
      }
      
      if (profileData.photo && profileData.photo instanceof File) {
        formData.append('photo', profileData.photo);
      }
      
      const response = await axios.put(`${API_URL}/${profileId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return true;
    } catch (error: any) {
      console.error("Error updating profile:", error);
      return false;
    }
  }

  getPhotoUrl(filename: string | null): string | null {
    if (!filename) return null;
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://127.0.0.1:5000';
    return `${baseUrl}/api/profiles/${filename}`;
  }
}

export const profileService = new ProfileService();