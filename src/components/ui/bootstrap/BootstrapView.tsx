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

  return (
    <div className="container-fluid">
      <h2 className="mb-4">{title}</h2>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          {Object.entries(info).map(([key, value]) => {
            const isToggleable = toggleableFields.includes(key);
            const isVisible = visibleFields[key];
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