import React, { useRef } from "react";
import { FileInputItem } from "../FileInputGeneric";

export const TailwindFileInput: React.FC<FileInputItem> = ({
  label = "Seleccionar archivo",
  accept = "image/*",
  onChange,
  value,
  preview,
  disabled = false,
  required = false,
  name = "file",
  error,
  touched,
  onBlur,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  // ✅ Determinar estado de validación
  const hasError = touched && error;
  const isValid = touched && !error && value;

  return (
    <div className="mb-4">
      {/* ✅ Label - Morado Tailwind */}
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-semibold text-purple-600 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* ✅ Input Group */}
      <div className="flex gap-2">
        <input
          type="text"
          id={name}
          className={`
            flex-1 px-3 py-2 border-2 rounded-lg shadow-sm
            focus:outline-none focus:ring-2 transition-all duration-200
            ${hasError 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50' 
              : isValid 
                ? 'border-green-500 focus:ring-green-500 focus:border-green-500 bg-green-50'
                : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500 bg-white'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
          `}
          value={value?.name || ""}
          placeholder="No se ha seleccionado ningún archivo"
          readOnly
          disabled={disabled}
          onBlur={onBlur}
        />
        
        {/* ✅ Botón Browse - Morado Tailwind */}
        <button
          type="button"
          onClick={handleBrowseClick}
          disabled={disabled}
          className={`
            px-4 py-2 border-2 rounded-lg font-semibold whitespace-nowrap
            transition-all duration-200 flex items-center gap-2
            ${hasError
              ? 'border-red-500 text-red-600 bg-white hover:bg-red-50 hover:border-red-600'
              : 'border-purple-600 text-purple-600 bg-white hover:bg-purple-50 hover:border-purple-700'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md active:scale-95'}
          `}
        >
          {/* Icono de carpeta */}
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" 
            />
          </svg>
          Browse
        </button>
      </div>

      {/* ✅ Error Message - Rojo Tailwind */}
      {hasError && (
        <div className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1.5">
          <svg 
            className="w-4 h-4 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* ✅ Success Message - Verde Tailwind */}
      {isValid && (
        <div className="mt-2 text-sm text-green-600 font-medium flex items-center gap-1.5">
          <svg 
            className="w-4 h-4 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
              clipRule="evenodd" 
            />
          </svg>
          <span>Archivo cargado correctamente</span>
        </div>
      )}

      {/* ✅ Input real oculto */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
        aria-label={label}
      />

      {/* ✅ Vista previa de imagen - Verde Tailwind */}
      {preview && (
        <div className="mt-4 text-center">
          <div className="inline-block p-4 border-2 border-green-500 rounded-xl bg-gradient-to-br from-green-50 to-white shadow-lg">
            <img
              src={preview}
              alt="Preview"
              className="rounded-lg object-contain shadow-md"
              style={{ 
                maxWidth: "300px", 
                maxHeight: "300px" 
              }}
            />
            {value && (
              <div className="mt-3 text-green-600 font-semibold flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg">
                <svg 
                  className="w-5 h-5 flex-shrink-0" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <span className="text-sm truncate max-w-xs">{value.name}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};