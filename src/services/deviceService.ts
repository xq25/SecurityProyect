import axios from "axios";
import { Device } from "../models/Device";

const API_URL = import.meta.env.VITE_API_URL + "/devices" || "";

class DeviceService {
  async getDevices(): Promise<Device[]> {
    try {
      const response = await axios.get<Device[]>(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error al obtener dispositivos:", error);
      return [];
    }
  }

  async getDeviceById(id: number): Promise<Device | null> {
    try {
      const response = await axios.get<Device>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Dispositivo no encontrado:", error);
      return null;
    }
  }

  async getDevicesByUserId(userId: number): Promise<Device[]> {
    try {
      const response = await axios.get<Device[]>(`${API_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener dispositivos del usuario:", error);
      return [];
    }
  }

  async createDevice(device: Omit<Device, "id">): Promise<Device | null> {
    try {
      const response = await axios.post<Device>(API_URL, device);
      return response.data;
    } catch (error) {
      console.error("Error al crear dispositivo:", error);
      return null;
    }
  }

  async updateDevice(id: number, device: Partial<Device>): Promise<Device | null> {
    try {
      const response = await axios.put<Device>(`${API_URL}/${id}`, device);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar dispositivo:", error);
      return null;
    }
  }

  async deleteDevice(id: number): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar dispositivo:", error);
      return false;
    }
  }
}

// Exportamos una instancia de la clase para reutilizarla
export const deviceService = new DeviceService();