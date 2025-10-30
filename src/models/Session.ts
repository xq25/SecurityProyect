export interface Session {
  id?: string;
  token?: string;
  userId: string;
  expiration?: Date;
  FACode?: string;
  State?: string;   
}