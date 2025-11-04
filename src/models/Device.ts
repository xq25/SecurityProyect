import { User } from "./User";

export interface Device {
    id?: number;
    name?: string;
    ip?: string;
    operating_system?: string;
    // Relación con User
    user_id?: number; //Llave foránea
    user?: User;
}