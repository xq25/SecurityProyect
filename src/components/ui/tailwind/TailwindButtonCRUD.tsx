import React from "react";
import { ButtonItem } from "../ButtonGeneric";
// Si el archivo es TailwindButton.css
import "../../../styles/Tailwind/TailwindButton.css";

export const TailwindButton: React.FC<ButtonItem> = ({
  name = "Acción",

  action = () => {},
  icon,
  item
}) => {
    const variant = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // elimina acentos
    .replace(/\s+/g, "-") // espacios -> guiones
    .replace(/[^a-z0-9-]/g, ""); // solo a-z, 0-9 y guiones
  const className = `tailwind-crud-button tailwind-crud-button-${variant}`;

  return (
    <button
      type="button"
      className={className}
      onClick={() => action?.(item)}
      aria-label={name}
    >
      {icon && <span className="btn-icon" aria-hidden>{icon}</span>}
      <span>{name}</span>{/* Agregamos el nombre para botones de texto */}
    </button>
  );
};