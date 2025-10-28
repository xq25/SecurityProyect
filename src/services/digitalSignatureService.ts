import axios from "axios";
import { DigitalSignature } from "../models/DigitalSignature";

const API_URL = import.meta.env.VITE_API_URL + "/api/digital-signatures" || "";

class DigitalSignatureService {
  async getDigitalSignatures(): Promise<DigitalSignature[]> {
    try {
      const response = await axios.get<DigitalSignature[]>(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error al obtener firmas digitales:", error);
      return [];
    }
  }

  async getDigitalSignatureById(id: number): Promise<DigitalSignature | null> {
    try {
      const response = await axios.get<DigitalSignature>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Firma digital no encontrada:", error);
      return null;
    }
  }

  async getDigitalSignatureByUserId(userId: number): Promise<DigitalSignature | null> {
    try {
      const response = await axios.get<DigitalSignature>(`${API_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener firma digital del usuario:", error);
      return null;
    }
  }

  async createDigitalSignature(signatureData: FormData): Promise<DigitalSignature | null> {
    try {
      const response = await axios.post<DigitalSignature>(API_URL, signatureData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear firma digital:", error);
      return null;
    }
  }

  async updateDigitalSignature(id: number, signatureData: FormData): Promise<DigitalSignature | null> {
    try {
      const response = await axios.put<DigitalSignature>(`${API_URL}/${id}`, signatureData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al actualizar firma digital:", error);
      return null;
    }
  }

  async deleteDigitalSignature(id: number): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar firma digital:", error);
      return false;
    }
  }

  async checkUserHasSignature(userId: number): Promise<boolean> {
    try {
      const response = await axios.get<boolean>(`${API_URL}/check/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error al verificar firma del usuario:", error);
      return false;
    }
  }
}

// Exportamos una instancia de la clase para reutilizarla
export const digitalSignatureService = new DigitalSignatureService();