import React from "react";
import * as Yup from "yup";

import { useUI } from "../../context/UIProvider";

import { MaterialForm } from './materialUI/MaterialForm';
import { TailwindForm } from "./tailwind/TailwindForm";

import { BootstrapForm } from './bootstrap/BootstrapForm';


export interface FormItems<T = any> {
  mode?: number;
  labels: string[];
  info?: T | null;
  handleAction?: (data: T) => void; //Esta es la accion que vamos a definir para que se realice al darle click al boton para enviar al formulario.
    //Aqui recibimos todo tipo de informacion (data), pueden ser de Users, UserRol, Roles, etc. Tambien se realiza por defecto el casteo automatico.
  validationSchema?: Yup.ObjectSchema<any>;
  disabledFields?: string[]; // campos que estaran deshabilitados.
  extraContent?: React.ReactNode; // 🔥 aquí podrás pasar el <LocationMap />
}

export const AppForm:  React.FC<FormItems>  = ({mode, labels, info, handleAction, validationSchema, disabledFields, extraContent}) => {

    const {library} = useUI();

    if (library === 'material')
      return <MaterialForm 
        mode={mode} 
        labels={labels} 
        info={info} 
        handleAction={handleAction} 
        validationSchema={validationSchema} 
        disabledFields={disabledFields} 
        extraContent={extraContent}
      />
    if (library === 'bootstrap')
      return <BootstrapForm 
        mode={mode} 
        labels={labels}
        info={info} 
        handleAction={handleAction} 
        validationSchema={validationSchema} 
        disabledFields={disabledFields} 
        extraContent={extraContent}
      />

    if (library === 'tailwind') return <TailwindForm mode={mode} labels={labels} info={info} handleAction={handleAction} validationSchema={validationSchema}/>
    }
