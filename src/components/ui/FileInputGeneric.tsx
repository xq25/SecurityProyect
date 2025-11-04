import React from "react";
import { useUI } from "../../context/UIProvider";
import { BootstrapFileInput } from "./bootstrap/BootstrapFileInput";
import { MaterialFileInput } from "./materialUI/MaterialFileInput";
import { TailwindFileInput } from "./tailwind/TailwindFileInput"

export interface FileInputItem {
  label?: string;
  accept?: string;
  onChange: (file: File | null) => void;
  value: File | null;
  preview?: string;
  disabled?: boolean;
  required?: boolean;
  // ✅ Props para integración con Formik
  name?: string;
  error?: string;
  touched?: boolean;
  onBlur?: () => void;
}

export const AppFileInput: React.FC<FileInputItem> = (props) => {
  const { library } = useUI();

  if (library === "bootstrap") return <BootstrapFileInput {...props} />;
  if (library === "material") return <MaterialFileInput {...props} />;
  if (library === "tailwind") return <TailwindFileInput {...props} />;

  return <BootstrapFileInput {...props} />;
};