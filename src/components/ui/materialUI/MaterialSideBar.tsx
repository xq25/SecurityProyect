// src/components/SideBar/ui/material/SideBar.tsx
import React from "react";
import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { SideBarItem } from "../SidebarGeneric"; //Cargamos la interface SideBarItem para definir el tipo de items que recibe nuestro componente personalizado.  

export const MaterialSideBar = ({ items }: { items: SideBarItem[] }) => {
  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        {items.map((item, i) => (
          <ListItemButton key={i} onClick={item.onClick}>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};
