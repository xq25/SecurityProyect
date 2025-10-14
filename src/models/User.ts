export interface User {
    id?: number; //El signo de interrogacion indica que es un campo opcional. 
    name?: string;
    email?: string;
    password?:string;
    token?:string;
} // Basicamente esto es una clase.