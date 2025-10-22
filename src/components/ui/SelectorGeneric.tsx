import React from "react";

interface GeneralSelectorProps {
  label: string; // Qué campo representa (ej: "Categoría", "Usuario", etc.)
  options: Array<{ value: string; label: string }> | string[]; // Lista de datos
  selected?: string; // Valor actualmente seleccionado (opcional)
  onChange?: (value: string) => void; // Qué pasa al cambiar la selección
  buttonText?: string; // Texto del botón
  onButtonClick?: () => void; // Función del botón
}