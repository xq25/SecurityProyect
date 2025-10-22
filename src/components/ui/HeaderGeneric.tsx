import React from "react";
import { useUI } from "../../context/UIProvider";
import { SiMui, SiTailwindcss, SiBootstrap } from "react-icons/si";

import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';

import { MaterialHeader } from "../ui/materialUI/MaterialHeader";
import { TailwindHeader } from "../ui/tailwind/TailwindHeader";
import { AppDropdownUser} from './userDropDown';

// 🔹 Interfaz para cada ítem del header (botones de librería)
export interface headerItem {
  name: string;
  label?: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

// 🔹 Interfaz del dropdown de usuario
export interface UserDropdownProps {
  username: string;
  avatarUrl?: string;
  onProfile?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
}

// 🔹 Props generales del AppHeader
interface AppHeaderProps {
  userDropdown?: React.ReactNode; // Aquí se pasa el componente UserDropdown
}

export const AppHeader: React.FC<AppHeaderProps> = () => {
  const { library, setLibrary } = useUI();
  const user = useSelector((state: RootState) => state.user.user);

  const defaultItems: headerItem[] = [
    {
      name: "tailwind",
      label: "Tailwind",
      icon: <SiTailwindcss />,
      onClick: () => setLibrary("tailwind"),
    },
    {
      name: "material",
      label: "Material UI",
      icon: <SiMui />,
      onClick: () => setLibrary("material"),
    },
    {
      name: "bootstrap",
      label: "Bootstrap",
      icon: <SiBootstrap />,
      onClick: () => setLibrary("bootstrap"),
    },
  ];

  // 🔹 Pasamos el userDropdown como prop al header de la librería activa
  if (user){
    if (library === "material")
      return <MaterialHeader items={defaultItems} userDropdown={<AppDropdownUser />} />;

    if (library === "tailwind")
      return <TailwindHeader items={defaultItems} userDropdown={<AppDropdownUser/>} />;
  }
  return <MaterialHeader items={defaultItems} userDropdown={<AppDropdownUser/>} />;
};
