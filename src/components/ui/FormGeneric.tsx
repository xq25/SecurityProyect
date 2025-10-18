import React from "react";
import * as Yup from "yup";

import { useUI } from "../../context/UIProvider";

import { MaterialForm } from './materialUI/MaterialForm';


export interface FormItems<T = any> {
  mode?: number;
  labels: string[];
  info?: T | null;
  handleAction?: (data: T) => void;
  validationSchema?: Yup.ObjectSchema<any>;
}

export const AppForm:  React.FC<FormItems>  = ({mode, labels, info, handleAction}) => {

    const {library} = useUI();

    if (library === 'material') return <MaterialForm mode={mode} labels={labels} info={info} handleAction={handleAction}/>
} 