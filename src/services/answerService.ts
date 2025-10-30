import axios from "axios";
import { Answer } from "../models/Answer";

const API_URL = import.meta.env.VITE_API_URL + "/answers" || "";

class AnswerService {
  async getAnswers(): Promise<Answer[]> {
    try {
      const response = await axios.get<Answer[]>(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error al obtener respuestas:", error);
      return [];
    }
  }

  async getAnswerById(id: number): Promise<Answer | null> {
    try {
      const response = await axios.get<Answer>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Respuesta no encontrada:", error);
      return null;
    }
  }

  async getAnswersByUserId(userId: number): Promise<Answer[]> {
    try {
      const response = await axios.get<Answer[]>(`${API_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener respuestas del usuario:", error);
      return [];
    }
  }

  async getAnswersByQuestionId(questionId: number): Promise<Answer[]> {
    try {
      const response = await axios.get<Answer[]>(`${API_URL}/question/${questionId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener respuestas de la pregunta:", error);
      return [];
    }
  }

  async createAnswer(answer: Omit<Answer, "id">): Promise<Answer | null> {
    try {
      const response = await axios.post<Answer>(API_URL, answer);
      return response.data;
    } catch (error) {
      console.error("Error al crear respuesta:", error);
      return null;
    }
  }

  async updateAnswer(id: number, answer: Partial<Answer>): Promise<Answer | null> {
    try {
      const response = await axios.put<Answer>(`${API_URL}/${id}`, answer);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar respuesta:", error);
      return null;
    }
  }

  async deleteAnswer(id: number): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar respuesta:", error);
      return false;
    }
  }

  // Método para verificar si un usuario ya respondió una pregunta
  async checkUserAnsweredQuestion(userId: number, questionId: number): Promise<boolean> {
    try {
      const response = await axios.get<boolean>(`${API_URL}/check/${userId}/${questionId}`);
      return response.data;
    } catch (error) {
      console.error("Error al verificar respuesta:", error);
      return false;
    }
  }
}

export const answerService = new AnswerService();