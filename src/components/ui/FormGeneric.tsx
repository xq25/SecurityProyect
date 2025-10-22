import React from "react";
import * as Yup from "yup";

import { useUI } from "../../context/UIProvider";

import { MaterialForm } from './materialUI/MaterialForm';
import { TailwindForm } from "./tailwind/TailwindForm";


export interface FormItems<T = any> {
  mode?: number;
  labels: string[];
  info?: T | null;
  handleAction?: (data: T) => void; //Aqui recibimos todo tipo de informacion (data), pueden ser de Users, UserRol, Roles, etc. Tambien se realiza por defecto el casteo automatico.
  validationSchema?: Yup.ObjectSchema<any>;
}

export const AppForm:  React.FC<FormItems>  = ({mode, labels, info, handleAction, validationSchema}) => {

    const {library} = useUI();

    if (library === 'material') return <MaterialForm mode={mode} labels={labels} info={info} handleAction={handleAction} validationSchema={validationSchema}/>

    if (library === 'tailwind') return <TailwindForm mode={mode} labels={labels} info={info} handleAction={handleAction} validationSchema={validationSchema}/>
    }
