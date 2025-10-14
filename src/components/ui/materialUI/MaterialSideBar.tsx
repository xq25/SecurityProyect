import React from "react";
import {Drawer,IconButton,List,ListItem,ListItemText,ListItemButton,ListItemIcon,Divider,Typography,Box,} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import SecurityIcon from "@mui/icons-material/Security";
import LockIcon from "@mui/icons-material/Lock";
import { Props } from "../SidebarGeneric";
import "../../../styles/MaterialUI/MaterialSidebar.css";

export const MaterialSideBar: React.FC<Props> = ({
  items = [],
  sidebarOpen,
  setSidebarOpen,
}) => {
  const iconMap: Record<string, React.ReactNode> = {
    Inicio: <HomeIcon />,
    Usuarios: <PeopleIcon />,
    Roles: <SecurityIcon />,
    Permisos: <LockIcon />,
  };

  return (
    <>
      {/* Botón para abrir el sidebar */}
      {!sidebarOpen && (
        <IconButton
          onClick={() => setSidebarOpen(true)}
          className="sidebar-toggle-btn"
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant="persistent"
        anchor="left"
        open={sidebarOpen}
        className="material-sidebar"
      >
        {/* Encabezado */}
        <Box className="sidebar-header">
          <Typography variant="h6" className="sidebar-title">
            Menú Principal
          </Typography>
          <IconButton onClick={() => setSidebarOpen(false)} className="close-btn">
            <ChevronLeftIcon />
          </IconButton>
        </Box>

        <Divider className="sidebar-divider" />

        {/* Lista de opciones */}
        <List className="sidebar-list">
          {items.map((item) => (
            <ListItem disablePadding key={item.label}>
              <ListItemButton onClick={item.onClick} className="sidebar-item">
                <ListItemIcon className="sidebar-icon">
                  {item.icon ?? iconMap[item.label]}
                </ListItemIcon>
                <ListItemText primary={item.label} className="sidebar-text" />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};
