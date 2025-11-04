import { SecurityQuestion } from "./SecurityQuestion";
import { User } from "./User";

export interface Answer {
    answer_text: string;
    id?: number;
    content?: string;
    
    // Llaves foráneas 
    user_id?: number;
    security_question_id?: number;
    
    // Relaciones muchos a uno (n:1)
    // Muchas respuestas pertenecen a UN usuario
    user?: User;
    
    // Muchas respuestas pertenecen a UNA pregunta de seguridad
    question?: SecurityQuestion;
}