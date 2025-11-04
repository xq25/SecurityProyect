import { User } from './User';
export interface Profile {
  id: string;
  phone: string;
  photo: string;
  user?: User; //preguntar a felipe si el id es del usuario 
} 