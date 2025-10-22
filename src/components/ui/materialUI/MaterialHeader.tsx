import React from "react";
import { headerItem } from '../HeaderGeneric';
import '../../../styles/MaterialUI/MaterialHeader.css'

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useUI } from "../../../context/UIProvider";




interface MaterialHeaderProps {
  items: headerItem[];
  userDropdown?:   React.ReactNode,
}

export const MaterialHeader: React.FC<MaterialHeaderProps> = ({ items, userDropdown }) => {
  const { library } = useUI();

  return (
    <AppBar position="static" className="material-header">
      <Toolbar className="material-toolbar">
        {/* 🏷️ Título */}
        <Typography variant="h6" className="material-header-title">
          Security Project
        </Typography>

        {/* 🎨 Botones de librerías */}
        <Box className="material-button-group">
          {items.map((item) => (
            <Tooltip key={item.name} title={`Cambiar a ${item.label}`}>
              <IconButton
                onClick={item.onClick}
                className={`material-button ${
                  library === item.name ? "active" : ""
                }`}
              >
                {item.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
        {userDropdown && <Box className="material-user-dropdown">{userDropdown}</Box>}
      </Toolbar>
    </AppBar>
  );
};