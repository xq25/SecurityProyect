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
