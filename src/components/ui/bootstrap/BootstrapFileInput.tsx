import React, { useRef } from "react";
import { FileInputItem } from "../FileInputGeneric";

export const BootstrapFileInput: React.FC<FileInputItem> = ({
  label = "Seleccionar archivo",
  accept = "image/*",
  onChange,
  value,
  preview,
  disabled = false,
  required = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="mb-3">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}
      
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          value={value?.name || ""}
          placeholder="No se ha seleccionado ningún archivo"
          readOnly
          disabled={disabled}
          required={required}
        />
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={handleBrowseClick}
          disabled={disabled}
        >
          Browse
        </button>
      </div>

      {/* Input real oculto */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="d-none"
        disabled={disabled}
        required={required}
      />

      {/* Vista previa de imagen */}
      {preview && (
        <div className="mt-3 text-center">
          <img
            src={preview}
            alt="Preview"
            className="img-thumbnail"
            style={{ maxWidth: "300px", maxHeight: "300px", objectFit: "contain" }}
          />
        </div>
      )}
    </div>
  );
};