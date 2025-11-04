import axios from "axios";
import { SecurityQuestion } from "../models/SecurityQuestion";
import api from "../interceptors/axiosInterceptor";

const API_URL = `${import.meta.env.VITE_API_URL}/security-questions`;

class SecurityQuestionService {
    // GET /api/security-questions
    async getSecurityQuestions(): Promise<SecurityQuestion[]> {
        try {
            const response = await api.get<SecurityQuestion[]>(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error al obtener preguntas de seguridad:", error);
            throw error;
        }
    }

    // GET /api/security-questions/:id
    async getSecurityQuestionById(id: number): Promise<SecurityQuestion | null> {
        try {
            const response = await api.get<SecurityQuestion>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Pregunta de seguridad no encontrada:", error);
            throw error;
        }
    }

    // POST /api/security-questions
    async createSecurityQuestion(question: Omit<SecurityQuestion, "id">): Promise<SecurityQuestion | null> {
        try {
            const response = await api.post<SecurityQuestion>(API_URL, question);
            return response.data;
        } catch (error) {
            console.error("Error al crear pregunta de seguridad:", error);
            throw error;
        }
    }

    // PUT /api/security-questions/:id
    async updateSecurityQuestion(id: number, question: Partial<SecurityQuestion>): Promise<SecurityQuestion | null> {
        try {
            const response = await api.put<SecurityQuestion>(`${API_URL}/${id}`, question);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar pregunta de seguridad:", error);
            throw error;
        }
    }

    // DELETE /api/security-questions/:id
    async deleteSecurityQuestion(id: number): Promise<boolean> {
        try {
            await api.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar pregunta de seguridad:", error);
            throw error;
        }
    }
}

export const securityQuestionService = new SecurityQuestionService();