import axios from "axios";
import { DigitalSignature } from "../models/DigitalSignature";

const API_URL = `${import.meta.env.VITE_API_URL}/digital-signatures`;
const BASE_URL = import.meta.env.VITE_API_URL; // ✅ Mantener /api en la URL base

class DigitalSignatureService {
  // ✅ Helper para construir la URL completa de la imagen
  getImageUrl(photoPath: string | undefined): string {
    if (!photoPath) return "";
    
    // Si ya es una URL completa, retornarla
    if (photoPath.startsWith("http://") || photoPath.startsWith("https://")) {
      return photoPath;
    }

    return `${BASE_URL}/${photoPath}`;
  }

  async getDigitalSignatures(): Promise<DigitalSignature[]> {
    try {
      const response = await axios.get<DigitalSignature[]>(API_URL);
      return response.data.map(sig => ({
        ...sig,
        photo: this.getImageUrl(sig.photo)
      }));
    } catch (error) {
      console.error("Error al obtener firmas digitales:", error);
      throw error;
    }
  }

  async getDigitalSignatureById(id: number): Promise<DigitalSignature | null> {
    try {
      const response = await axios.get<DigitalSignature>(`${API_URL}/${id}`);
      return {
        ...response.data,
        photo: this.getImageUrl(response.data.photo)
      };
    } catch (error) {
      console.error("Firma digital no encontrada:", error);
      throw error;
    }
  }

  async getDigitalSignatureByUserId(user_id: number): Promise<DigitalSignature | null> {
    try {
      const response = await axios.get<DigitalSignature>(`${API_URL}/user/${user_id}`);
      return {
        ...response.data,
        photo: this.getImageUrl(response.data.photo)
      };
    } catch (error) {
      console.error("Error al obtener firma digital del usuario:", error);
      throw error;
    }
  }

  async createDigitalSignature(user_id: number, photoFile: File): Promise<DigitalSignature | null> {
    try {
      const formData = new FormData();
      formData.append("photo", photoFile);

      const response = await axios.post<DigitalSignature>(
        `${API_URL}/user/${user_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      return {
        ...response.data,
        photo: this.getImageUrl(response.data.photo)
      };
    } catch (error) {
      console.error("Error al crear firma digital:", error);
      throw error;
    }
  }

  async updateDigitalSignature(id: number, photoFile: File): Promise<DigitalSignature | null> {
    try {
      const formData = new FormData();
      formData.append("photo", photoFile);

      const response = await axios.put<DigitalSignature>(
        `${API_URL}/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      return {
        ...response.data,
        photo: this.getImageUrl(response.data.photo)
      };
    } catch (error) {
      console.error("Error al actualizar firma digital:", error);
      throw error;
    }
  }

  async deleteDigitalSignature(id: number): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar firma digital:", error);
      throw error;
    }
  }
}

export const digitalSignatureService = new DigitalSignatureService();