import { Device } from "./Device";
import { DigitalSignature } from "./DigitalSignature";
import { Answer } from "./Answer";

export interface User {
    id?: number; // El signo de interrogación indica que es un campo opcional
    name?: string;
    email?: string;
    password?: string;
    
    // ✅ Relaciones uno a muchos (1:n)
    // Un usuario puede tener MUCHOS dispositivos
    devices?: Device[];
    
    // ✅ Relación uno a uno (1:1)
    // Un usuario tiene UNA firma digital
    digitalSignature?: DigitalSignature;
    
    // ✅ Relaciones uno a muchos (1:n)
    // Un usuario puede tener MUCHAS respuestas de seguridad
    answers?: Answer[];
}