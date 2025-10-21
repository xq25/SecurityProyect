import React from "react";
import { Button } from "@mui/material";
import "../../../styles/MaterialUI/MaterialButtonCRUD.css";
import { ButtonItem } from "../ButtonCRUDGeneric";

export const MaterialButton: React.FC<ButtonItem> = ({
  name = "Acción",
  action = () => {},
  icon,
}) => {
  // Clase dinámica basada en el nombre (en minúsculas y sin espacios)
  const buttonClass = `material-button-${name}`;

  return (
    <Button
      variant="contained"
      onClick={action}
      className={buttonClass}
    >
      {icon}{name}
    </Button>
  );
};
