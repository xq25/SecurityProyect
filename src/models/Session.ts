export interface Session {
  id?: string;
  token?: string;
  userId?: string;
  
  // Acepta ambos formatos del backend
  State?: 'active' | 'expired' | 'revoked';
  state?: 'active' | 'expired' | 'revoked';
  
  expiration?: string | Date;
  FACode?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}