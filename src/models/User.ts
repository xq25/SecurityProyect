export interface User {
    id?: number; //El signo de interrogacion indica que es un campo opcional. 
    name?: string;
    email?: string;
    password?:string;
    age?: number;
    city?: string;
    phone?: string;
    is_active?: boolean;
    token?:string;
} // Basicamente esto es una clase.