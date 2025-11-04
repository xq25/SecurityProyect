import React, { useState } from "react";
import { PropsGenericView } from "../ViewInfoGeneric";

export const TailwindView: React.FC<PropsGenericView> = ({
  title,
  info,
  options,
  toggleableFields = [],
}) => {
  const [visibleFields, setVisibleFields] = useState<{ [key: string]: boolean }>({});

  const toggleFieldVisibility = (field: string) => {
    setVisibleFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const getPhotoUrl = (filename: string): string => {
    // Si ya es una URL completa, devolverla tal cual
    if (filename.startsWith('http')) {
      return filename;
    }
    
    // Construir la URL del backend
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://127.0.0.1:5000';
    
    // Si el filename ya incluye "profiles/", usarlo directamente
    if (filename.includes('profiles/')) {
      return `${baseUrl}/static/uploads/${filename}`;
    }
    
    // Si no, construir la ruta completa
    return `${baseUrl}/static/uploads/profiles/${filename}`;
  };

  const renderValue = (key: string, value: any) => {
    const isToggleable = toggleableFields.includes(key);
    const isVisible = visibleFields[key];

    // Renderizar foto
    if (key === 'photo' && value && value !== 'Sin foto') {
      try {
        const photoUrl = getPhotoUrl(value);
        return (
          <img 
            src={photoUrl} 
            alt="Profile" 
            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
            onError={(e) => {
              // Si falla la carga, mostrar placeholder
              e.currentTarget.src = 'https://via.placeholder.com/128?text=Sin+Foto';
            }}
          />
        );
      } catch (error) {
        return <span className="text-gray-400">Error cargando foto</span>;
      }
    }

    // Campo toggleable oculto
    if (isToggleable && !isVisible) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-gray-400">••••••••</span>
          <button
            onClick={() => toggleFieldVisibility(key)}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            Mostrar
          </button>
        </div>
      );
    }

    // Campo toggleable visible
    if (isToggleable && isVisible) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-gray-900">{String(value)}</span>
          <button
            onClick={() => toggleFieldVisibility(key)}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            Ocultar
          </button>
        </div>
      );
    }

    // Valores normales
    return <span className="text-gray-900">{String(value)}</span>;
  };

  return (
    <div className="p-6">
      {title && (
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(info).map(([key, value]) => (
              <div key={key} className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-semibold text-gray-600 uppercase mb-2">
                  {key.replace(/_/g, " ")}
                </label>
                <div className="text-base">
                  {renderValue(key, value)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {options && options.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-3">
              {options.map((option, index) => (
                <div key={index}>{option}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};