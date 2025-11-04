import axios from "axios";
import { Answer } from "../models/Answer";

const API_URL = `${import.meta.env.VITE_API_URL}/answers`;

class AnswerService {
    async getAnswers(): Promise<Answer[]> {
        try {
            const response = await axios.get<Answer[]>(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error al obtener respuestas:", error);
            throw error;
        }
    }

    async getAnswerById(id: number): Promise<Answer | null> {
        try {
            const response = await axios.get<Answer>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Respuesta no encontrada:", error);
            throw error;
        }
    }

    async getAnswersByUserId(user_id: number): Promise<Answer[]> {
        try {
            const response = await axios.get<Answer[]>(`${API_URL}/user/${user_id}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener respuestas del usuario:", error);
            throw error;
        }
    }

    async getAnswersByQuestionId(security_question_id: number): Promise<Answer[]> {
        try {
            const response = await axios.get<Answer[]>(`${API_URL}/question/${security_question_id}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener respuestas de la pregunta:", error);
            throw error;
        }
    }

    async createAnswer(user_id: number, security_question_id: number, content: string): Promise<Answer | null> {
        try {
            const response = await axios.post<Answer>(
                `${API_URL}/user/${user_id}/question/${security_question_id}`,
                { content }
            );
            return response.data;
        } catch (error) {
            console.error("Error al crear respuesta:", error);
            throw error;
        }
    }

    async updateAnswer(id: number, content: string): Promise<Answer | null> {
        try {
            const response = await axios.put<Answer>(`${API_URL}/${id}`, { content });
            return response.data;
        } catch (error) {
            console.error("Error al actualizar respuesta:", error);
            throw error;
        }
    }

    async deleteAnswer(id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar respuesta:", error);
            throw error;
        }
    }
}

export const answerService = new AnswerService();