import React from "react";
import { ButtonItem } from "../ButtonCRUDGeneric";
import "../../../styles/Tailwind/TailwindButtonCRUD.css";

export const TailwindButton: React.FC<ButtonItem> = ({
  name = "Acción",
  action,
  item,
}) => {
  const variant = name.toLowerCase().trim().replace(/\s+/g, "-");
  const className = `tailwind-button tailwind-button-${variant}`;

  return (
    <button
      type="button"
      className={className}
      onClick={() => action?.(item)}
      aria-label={name}
    >
      {name}
    </button>
  );
};