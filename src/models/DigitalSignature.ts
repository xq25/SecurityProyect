import { User } from "./User";

export interface DigitalSignature {
    id?: number;
    photo?: string;
    //Relación con el usuario 
    userId?: number; //Llave foránea
    user?: User; 
}