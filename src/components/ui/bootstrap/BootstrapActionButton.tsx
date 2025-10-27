import React from "react";
import { ActionButtonItem } from "../ActionButtonGeneric";

export const BootstrapActionButton: React.FC<ActionButtonItem> = ({
  text,
  onClick,
  icon,
  variant = "success",
  size = "medium",
}) => {
  // Mapeo de variantes a clases de Bootstrap
  const variantClassMap: Record<string, string> = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    success: "btn-success",
    danger: "btn-danger",
    warning: "btn-warning",
    info: "btn-info",
  };

  // Mapeo de tamaños
  const sizeClassMap: Record<string, string> = {
    small: "btn-sm",
    medium: "",
    large: "btn-lg",
  };

  const variantClass = variantClassMap[variant] || "btn-success";
  const sizeClass = sizeClassMap[size] || "";

  return (
    <button
      onClick={onClick}
      className={`btn ${variantClass} ${sizeClass} d-flex align-items-center gap-2`}
    >
      {icon && <span>{icon}</span>}
      <span>{text}</span>
    </button>
  );
};