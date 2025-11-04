import axios from "axios";
import { Device } from "../models/Device";}
import api from "../interceptors/axiosInterceptor";

// ✅ Usar VITE_BACK_URL del archivo .env
const API_URL = `${import.meta.env.VITE_API_URL}/devices`;

class DeviceService {
  // ✅ GET /api/devices - Listar todos los dispositivos
  async getDevices(): Promise<Device[]> {
    try {
      const response = await api.get<Device[]>(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error al obtener dispositivos:", error);
      throw error;
    }
  }

  // ✅ GET /api/devices/:id - Obtener un dispositivo por ID
  async getDeviceById(id: number): Promise<Device | null> {
    try {
      const response = await api.get<Device>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Dispositivo no encontrado:", error);
      throw error;
    }
  }

  // ✅ GET /api/devices/user/:user_id - Obtener dispositivos por ID de usuario
  async getDevicesByUserId(user_id: number): Promise<Device[]> {
    try {
      const response = await api.get<Device[]>(`${API_URL}/user/${user_id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener dispositivos del usuario:", error);
      throw error;
    }
  }

  // ✅ POST /api/devices/user/:user_id - Crear dispositivo
  async createDevice(device: Omit<Device, "id"> & { user_id: number }): Promise<Device | null> {
    try {
      const { user_id, ...deviceData } = device;
      
      // ✅ El endpoint requiere user_id en la URL: POST /api/devices/user/:user_id
      const response = await api.post<Device>(
        `${API_URL}/user/${user_id}`,
        deviceData
      );
      
      return response.data;
    } catch (error) {
      console.error("Error al crear dispositivo:", error);
      throw error;
    }
  }

  // ✅ PUT /api/devices/:id - Actualizar dispositivo
  async updateDevice(id: number, device: Partial<Device>): Promise<Device | null> {
    try {
      const response = await api.put<Device>(`${API_URL}/${id}`, device);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar dispositivo:", error);
      throw error;
    }
  }

  // ✅ DELETE /api/devices/:id - Eliminar dispositivo
  async deleteDevice(id: number): Promise<boolean> {
    try {
      await api.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar dispositivo:", error);
      throw error;
    }
  }
}

// Exportamos una instancia de la clase para reutilizarla
export const deviceService = new DeviceService();