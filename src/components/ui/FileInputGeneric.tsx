import React from "react";
import { useUI } from "../../context/UIProvider";
import { BootstrapFileInput } from "./bootstrap/BootstrapFileInput";
import { MaterialFileInput } from "./materialUI/MaterialFileInput";

// 🔹 Estructura de un input de archivos reutilizable
export interface FileInputItem {
  label?: string;               // Etiqueta del input
  accept?: string;              // Tipos de archivo aceptados (ej: "image/*", ".pdf")
  onChange: (file: File | null) => void; // Callback cuando cambia el archivo
  value?: File | null;          // Archivo actual seleccionado
  preview?: string;             // URL de vista previa (para imágenes)
  disabled?: boolean;           // Si está deshabilitado
  required?: boolean;           // Si es obligatorio
}

// 🔹 Input de archivos genérico que adapta su diseño según la librería
export const AppFileInput: React.FC<FileInputItem> = ({
  label = "Seleccionar archivo",
  accept = "image/*",
  onChange,
  value,
  preview,
  disabled = false,
  required = false,
}) => {
  const { library } = useUI();

  if (library === "material")
   return (
     <MaterialFileInput
       label={label}
       accept={accept}
       onChange={onChange}
       value={value}
       preview={preview}
       disabled={disabled}
       required={required}
     />
   );

  if (library === "bootstrap")
    return (
      <BootstrapFileInput
        label={label}
        accept={accept}
        onChange={onChange}
        value={value}
        preview={preview}
        disabled={disabled}
        required={required}
      />
    );

  return null;
};