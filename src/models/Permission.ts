export interface Permission {
  id?: number;
  URL?: string;       // ✅ Backend espera 'URL' (mayúscula)
  url?: string;       // Compatibilidad
  entity?: string;    // Compatibilidad
  method?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}