import { Answer } from "./Answer";
import { Device } from "./Device";
import { DigitalSignature } from "./DigitalSignature";

export interface User {
    id?: number; //El signo de interrogacion indica que es un campo opcional. 
    name?: string;
    email?: string;
    password?:string;
    token?:string;

    // Relación 1 a 1 con DigitalSignature
    digitalSignature?: DigitalSignature;
    
    // Relación 1 a muchos con Device
    devices?: Device[];
    
    // Relación muchos a muchos con SecurityQuestion (a través de Answer)
    answers?: Answer[];
} // Basicamente esto es una clase.