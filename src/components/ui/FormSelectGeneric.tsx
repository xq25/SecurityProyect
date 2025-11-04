import React from "react";
import * as Yup from "yup";

import { useUI } from "../../context/UIProvider";

import { MaterialFormSelect } from "./materialUI/MaterialFormSelect";
import { BootstrapFormSelect } from "./bootstrap/BootstrapFormSelect";

// 🔹 Estructura de un formulario con select integrado
export interface FormSelectItems<T = any> {
  // Propiedades del Formulario
  mode?: number;                           // 1: Create, 2: Update
  labels: string[];                        // Labels de los campos (sin incluir el select)
  info?: T | null;                         // Info para Update
  handleAction?: (data: T) => void;        // Callback al submit
  validationSchema?: Yup.ObjectSchema<any>; // Validación Yup
  
  //  Campos deshabilitados
  disabledFields?: string[];               // Array de nombres de campos a deshabilitar (ej: ["email", "name"])
  
  // 🔹 Propiedades del Select
  selectLabel?: string;                    // Label del select (ej: "Usuario Propietario:")
  selectOptions: any[];                    // Opciones del select
  selectValue: number | string;            // Valor seleccionado
  onSelectChange: (value: number | string) => void; // Callback del select
  selectDisplayKey?: string;               // Key para mostrar (ej: "name")
  selectValueKey?: string;                 // Key para value (ej: "id")
  selectPlaceholder?: string;              // Placeholder del select
  selectRequired?: boolean;                // Si es obligatorio
  selectDisabled?: boolean;                // ✅ Si el select está deshabilitado
}

// 🔹 Formulario con select genérico
export const AppFormSelect: React.FC<FormSelectItems> = ({
  mode,
  labels,
  info,
  handleAction,
  validationSchema,
  disabledFields,
  selectLabel,
  selectOptions,
  selectValue,
  onSelectChange,
  selectDisplayKey,
  selectValueKey,
  selectPlaceholder,
  selectRequired,
  selectDisabled,
}) => {
  const { library } = useUI();

  if (library === "bootstrap")
    return (
      <BootstrapFormSelect
        mode={mode}
        labels={labels}
        info={info}
        handleAction={handleAction}
        validationSchema={validationSchema}
        disabledFields={disabledFields}
        selectLabel={selectLabel}
        selectOptions={selectOptions}
        selectValue={selectValue}
        onSelectChange={onSelectChange}
        selectDisplayKey={selectDisplayKey}
        selectValueKey={selectValueKey}
        selectPlaceholder={selectPlaceholder}
        selectRequired={selectRequired}
        selectDisabled={selectDisabled}
      />
    );

  if (library === "material")
   return (
     <MaterialFormSelect
       mode={mode}
       labels={labels}
       info={info}
       handleAction={handleAction}
       validationSchema={validationSchema}
       disabledFields={disabledFields}
       selectLabel={selectLabel}
       selectOptions={selectOptions}
       selectValue={selectValue}
       onSelectChange={onSelectChange}
       selectDisplayKey={selectDisplayKey}
       selectValueKey={selectValueKey}
       selectPlaceholder={selectPlaceholder}
       selectRequired={selectRequired}
       selectDisabled={selectDisabled}
     />
   );
};