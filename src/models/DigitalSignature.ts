import { User } from "./User";

export interface DigitalSignature {
    id?: number;
    photo?: string;
    //Relación con el usuario 
    user_id?: number; //Llave foránea
    user?: User; 
}