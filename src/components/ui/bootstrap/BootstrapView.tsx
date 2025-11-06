import React, { useState } from "react";
import { PropsGenericView } from "../ViewInfoGeneric";

export const BootstrapView: React.FC<PropsGenericView> = ({
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
    <div className="container-fluid">
      <h2 className="mb-4">{title}</h2>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
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
                <div className="row mb-3 align-items-center" key={key}>
                  <div className="col-md-3">
                    <label className="form-label text-muted fw-bold mb-0">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}:
                    </label>
                  </div>
                  <div className="col-md-9">
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
              <div className="row mb-3 align-items-center" key={key}>
                <div className="col-md-3">
                  <div className="d-flex align-items-center gap-2">
                    <label className="form-label text-muted fw-bold mb-0">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}:
                    </label>
                    {isToggleable && (
                      <button
                        type="button"
                        className="btn btn-sm btn-link p-0 text-secondary"
                        onClick={() => toggleVisibility(key)}
                        style={{ textDecoration: "none" }}
                      >
                        <i
                          className={`bi ${
                            isVisible ? "bi-eye-slash" : "bi-eye"
                          }`}
                          style={{ fontSize: "1.2rem" }}
                        ></i>
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-md-9">
                  <p className="mb-0 fs-5">{displayValue}</p>
                </div>
              </div>
            );
          })}
        </div>

        {options.length > 0 && (
          <div className="card-footer bg-transparent border-top pt-3">
            <div className="d-flex gap-2">
              {options.map((option, idx) => (
                <div key={idx}>{option}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};