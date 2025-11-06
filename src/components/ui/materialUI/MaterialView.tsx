import React, { useState } from "react";
import { Paper, Typography, Button, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "../../../styles/MaterialUI/MaterialView.css";
import { PropsGenericView } from "../ViewInfoGeneric";

export const MaterialView: React.FC<PropsGenericView> = ({
  title = "Detalles",
  info,
  options = [],
  toggleableFields = [],
}) => {
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>(
    Object.fromEntries(toggleableFields.map((f) => [f, false]))
  );

  const toggleVisibility = (key: string) => {
    setVisibleFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Función para obtener la URL de la foto si es solo el nombre del archivo
  const getPhotoUrl = (value: string) => {
    if (value.startsWith("http") || value.startsWith("data:")) return value;
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://127.0.0.1:5000';
    return value.includes("profiles/")
      ? `${baseUrl}/static/uploads/${value}`
      : `${baseUrl}/static/uploads/profiles/${value}`;
  };

  return (
    <div className="generic-view-container">
      <Typography variant="h5" className="generic-view-title" gutterBottom>
        {title}
      </Typography>

      <Paper elevation={3} className="generic-view-card">
        <div className="generic-view-body">
          {Object.entries(info).map(([key, value]) => {
            const isToggleable = toggleableFields.includes(key);
            const isVisible = visibleFields[key];

            // Renderizar la foto como imagen si corresponde
            if (key === "photo" && value && value !== "Sin foto") {
              let photoUrl = "";
              if (typeof value === "string" && value.startsWith("http")) {
                photoUrl = value;
              } else if (typeof value === "string") {
                photoUrl = getPhotoUrl(value);
              }
              return (
                <div className="generic-view-row" key={key}>
                  <div className="generic-view-label-wrapper">
                    <strong className="generic-view-label">
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </strong>
                  </div>
                  <img
                    src={photoUrl}
                    alt="Foto de perfil"
                    style={{
                      width: 96,
                      height: 96,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "2px solid #ccc",
                    }}
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://via.placeholder.com/96?text=Sin+Foto";
                    }}
                  />
                </div>
              );
            }

            const displayValue =
              typeof value === "object"
                ? JSON.stringify(value)
                : isToggleable && !isVisible
                ? "••••••••"
                : String(value);

            return (
              <div className="generic-view-row" key={key}>
                <div className="generic-view-label-wrapper">
                  <strong className="generic-view-label">
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </strong>
                  {isToggleable && (
                    <IconButton
                      size="small"
                      onClick={() => toggleVisibility(key)}
                      className="generic-view-eye-btn"
                    >
                      {isVisible ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  )}
                </div>
                <p className="generic-view-value">{displayValue}</p>
              </div>
            );
          })}
        </div>

        {options.length > 0 && (
          <div className="generic-view-actions">
            {options.map((option, idx) => (
              <div key={idx} className="generic-view-action">
                {option}
              </div>
            ))}
          </div>
        )}
      </Paper>
    </div>
  );
};