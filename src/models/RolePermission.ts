export interface RolePermission {
  id?: string; // UUID del backend
  role_id: number;
  permission_id: number;
  created_at?: string;
  updated_at?: string;
  
  // Relaciones opcionales si el backend las incluye
  role?: any;
  permission?: any;
}