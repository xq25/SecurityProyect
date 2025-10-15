import React from "react";
import { headerItem } from '../HeaderGeneric';
import { useUI } from "../../../context/UIProvider";
import "../../../styles/TailwindHeader/TalwindHeader.css";

interface TailwindHeaderProps {
  items: headerItem[];
}

export const TailwindHeader: React.FC<TailwindHeaderProps> = ({ items }) => {
  const { library } = useUI();

  return (
    <header className="bg-gray-800 shadow-md tailwind-header" role="banner">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* 🏷️ Título */}
          <h1 className="text-white text-xl font-medium tailwind-header-title">
            Security Project
          </h1>

          {/* 🎨 Botones de librerías */}
          <div className="flex space-x-2 tailwind-button-group">
            {items.map((item) => (
              <div key={item.name} className="relative group">
                <button
                  onClick={item.onClick}
                  className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200 tailwind-button ${
                    library === item.name
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                  }`}
                  aria-label={`Cambiar a ${item.label}`}
                  aria-pressed={library === item.name}
                >
                  <span className="text-xl">{item.icon}</span>
                </button>
                
                {/* Tooltip */}
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 
                             opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap tailwind-tooltip">
                    Cambiar a {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};