import { SecurityQuestion } from "./SecurityQuestion";
import { User } from "./User";

export interface Answer {
    id?: number;
    content?: string;
    
    // Llaves foráneas 
    userId?: number;
    securityQuestionId?: number;
    
    // Relaciones muchos a uno (n:1)
    // Muchas respuestas pertenecen a UN usuario
    user?: User;
    
    // Muchas respuestas pertenecen a UNA pregunta de seguridad
    securityQuestion?: SecurityQuestion;
}