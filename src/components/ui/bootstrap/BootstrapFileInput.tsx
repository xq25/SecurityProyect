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

  // ✅ Determinar si hay error (igual que BootstrapForm)
  const hasError = touched && error;
  const isValid = touched && !error && value;

  return (
    <div className="mb-3">
      {/* Label con estilo consistente */}
      {label && (
        <label htmlFor={name} className="form-label fw-semibold text-success">
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}
      
      {/* Input Group */}
      <div className="input-group">
        <input
          type="text"
          className={`form-control ${hasError ? "is-invalid" : ""} ${isValid ? "is-valid" : ""}`}
          value={value?.name || ""}
          placeholder="No se ha seleccionado ningún archivo"
          readOnly
          disabled={disabled}
          id={name}
          onBlur={onBlur}
        />
        <button
          className={`btn ${hasError ? "btn-outline-danger" : "btn-outline-secondary"}`}
          type="button"
          onClick={handleBrowseClick}
          disabled={disabled}
        >
          <i className="bi bi-folder2-open me-2"></i>
          Browse
        </button>
      </div>

      {/* ✅ Error Message (igual que BootstrapForm) */}
      {hasError && (
        <div className="invalid-feedback d-block text-danger fw-medium">
          {error}
        </div>
      )}

      {/* ✅ Success Message */}
      {isValid && (
        <small className="form-text text-success fw-medium d-block">
          <i className="bi bi-check-circle-fill me-1"></i>
          Archivo cargado correctamente
        </small>
      )}

      {/* Input real oculto */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="d-none"
        disabled={disabled}
      />

      {/* Vista previa de imagen */}
      {preview && (
        <div className="mt-3 text-center">
          <div className="border rounded p-2 bg-light d-inline-block">
            <img
              src={preview}
              alt="Preview"
              className="img-thumbnail"
              style={{ 
                maxWidth: "300px", 
                maxHeight: "300px", 
                objectFit: "contain",
                border: "2px solid #198754"
              }}
            />
            {value && (
              <div className="mt-2 text-success">
                <i className="bi bi-check-circle-fill me-1"></i>
                <small className="fw-medium">{value.name}</small>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};