// src/components/ui/ButtonGeneric.tsx
import React from "react";
import { useUI } from "../../context/UIProvider";
import { MaterialButton } from "./materialUI/MaterialButtonCRUD";

export interface ButtonItem {
  name?: string;
  action?: () => void;
}

export const AppButton: React.FC<ButtonItem> = ({ name, action }) => {
  const { library } = useUI();

  if (library == "material") return <MaterialButton name={name} action={action}/>;

};
