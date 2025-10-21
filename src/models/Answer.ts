import { SecurityQuestion } from "./SecurityQuestion";
import { User } from "./User";

export interface Answer {
    id: number;
    content: string;
    // Llaves foráneas 
    userId: number;
    securityQuestionId: number;
    // Relaciones muchos a muchos 
    user?: User;
    securityQuestion?: SecurityQuestion;
}