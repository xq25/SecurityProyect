import axios from "axios";
import { SecurityQuestion } from "../models/SecurityQuestion";

const API_URL = import.meta.env.VITE_API_URL + "/api/security-questions" || "";

class SecurityQuestionService {
    async getSecurityQuestions(): Promise<SecurityQuestion[]> {
        try {
            const response = await axios.get<SecurityQuestion[]>(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error al obtener preguntas de seguridad:", error);
            return [];
        }
    }

    async getSecurityQuestionById(id: number): Promise<SecurityQuestion | null> {
        try {
            const response = await axios.get<SecurityQuestion>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Pregunta de seguridad no encontrada:", error);
            return null;
        }
    }

    async createSecurityQuestion(question: Omit<SecurityQuestion, "id">): Promise<SecurityQuestion | null> {
        try {
            const response = await axios.post<SecurityQuestion>(API_URL, question);
            return response.data;
        } catch (error) {
            console.error("Error al crear pregunta de seguridad:", error);
            return null;
        }
    }

    async updateSecurityQuestion(id: number, question: Partial<SecurityQuestion>): Promise<SecurityQuestion | null> {
        try {
            const response = await axios.put<SecurityQuestion>(`${API_URL}/${id}`, question);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar pregunta de seguridad:", error);
            return null;
        }
    }

    async deleteSecurityQuestion(id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar pregunta de seguridad:", error);
            return false;
        }
    }

    // Método adicional para obtener preguntas con sus respuestas
    async getSecurityQuestionWithAnswers(id: number): Promise<SecurityQuestion | null> {
        try {
            const response = await axios.get<SecurityQuestion>(`${API_URL}/${id}/answers`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener pregunta con respuestas:", error);
            return null;
        }
    }
}

export const securityQuestionService = new SecurityQuestionService();