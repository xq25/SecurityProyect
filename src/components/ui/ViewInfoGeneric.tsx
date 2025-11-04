import React from "react";
// Importacion de componentes
import { MaterialView } from './materialUI/MaterialView';
import { TailwindView } from './tailwind/TailwindView';
// Importaciones de Hooks
import { useUI } from "../../context/UIProvider";

export interface PropsGenericView {
    title?: string;
    info: Object;
    options?: React.ReactNode[];
    toggleableFields?: string[];
}

export const AppView: React.FC<PropsGenericView> = ({ title, info, options, toggleableFields }) => {
    const { library } = useUI();

    if (library === 'material')
        return <MaterialView 
            title={title} 
            info={info}
            options={options}
            toggleableFields={toggleableFields}
        />

    if (library === 'tailwind')
        return <TailwindView 
            title={title} 
            info={info}
            options={options}
            toggleableFields={toggleableFields}
        />
}