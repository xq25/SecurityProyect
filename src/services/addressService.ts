import axios from "axios";
import { Address } from '../models/Address'; 

// 🧭 Construcción dinámica de la URL base
const API_URL = import.meta.env.VITE_API_URL + "/api/addresses" || "";

/**
 * Servicio para gestionar direcciones (Addresses)
 * Métodos: listar, obtener, crear, actualizar y eliminar.
 */
class AddressService {
  // 🔹 Obtener todas las direcciones
  async getAddresses(): Promise<Address[]> {
    try {
      const response = await axios.get<Address[]>(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error al obtener direcciones:", error);
      return [];
    }
  }

  // 🔹 Obtener dirección por ID
  async getAddressById(id: number): Promise<Address | null> {
    try {
      const response = await axios.get<Address>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Dirección no encontrada:", error);
      return null;
    }
  }

  // 🔹 Obtener direcciones por usuario
  async getAddressesByUserId(userId: number): Promise<Address | null> {
    try {
      const response = await axios.get<Address>(`${API_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener direcciones del usuario:", error);
      return null;
    }
  }

  // 🔹 Crear una nueva dirección
  async createAddress(userId: number, address: Omit<Address, "id">): Promise<Address | null> {
    try {
      const response = await axios.post<Address>(`${API_URL}/user/${userId}`, address, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear dirección:", error);
      return null;
    }
  }

  // 🔹 Actualizar una dirección existente
  async updateAddress(id: number, address: Partial<Address>): Promise<Address | null> {
    try {
      const response = await axios.put<Address>(`${API_URL}/${id}`, address, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error al actualizar dirección:", error);
      return null;
    }
  }

  // 🔹 Eliminar dirección
  async deleteAddress(id: number): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar dirección:", error);
      return false;
    }
  }

}

// ✅ Exportamos una instancia reutilizable
export const addressService = new AddressService();
