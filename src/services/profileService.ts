import axios from "axios";
import { Profile } from "../models/Profile";

const API_URL = (import.meta.env.VITE_API_URL || "") + "/profiles";

class ProfileService {
  async getProfileByUser(userId: number): Promise<Profile | null> {
    try {
      const response = await axios.get<Profile>(`${API_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  }

  async createProfile(userId: number, profileData: Omit<Profile, "id">): Promise<Profile | null> {
    try {
      const response = await axios.post<Profile>(`${API_URL}/user/${userId}`, profileData);
      return response.data;
    } catch (error) {
      console.error("Error creating profile:", error);
      return null;
    }
  }

  async updateProfile(profileId: number, profileData: Partial<Profile>): Promise<boolean> {
    try {
      await axios.put(`${API_URL}/${profileId}`, profileData);
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      return false;
    }
  }
}

export const profileService = new ProfileService();