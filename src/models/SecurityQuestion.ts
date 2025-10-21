import { Answer } from "./Answer";

export interface SecurityQuestion {
    id?: number;
    name?: string;
    description?: string;

    answers?: Answer[];
}