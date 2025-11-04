import React from "react";
import { useFormik } from "formik";

import { FormSelectItems } from "../FormSelectGeneric";

export const BootstrapFormSelect: React.FC<FormSelectItems> = ({
  mode = 1,
  labels,
  info,
  handleAction,
  validationSchema,
  disabledFields = [], // ✅ Por defecto array vacío
  selectLabel = "Seleccionar",
  selectOptions,
  selectValue,
  onSelectChange,
  selectDisplayKey = "name",
  selectValueKey = "id",
  selectPlaceholder = "Seleccionar...",
  selectRequired = false,
  selectDisabled = false, // ✅ Por defecto no deshabilitado
}) => {
  // Crear initialValues dinámicamente basado en labels
  const initialValues = labels.reduce((acc, label) => {
    acc[label] = info ? info[label] || "" : "";
    return acc;
  }, {} as any);

  // Configuración de Formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (handleAction) {
        handleAction(values);
      }
    },
  });

  // Handler para el cambio de select
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onSelectChange(selectValueKey === "id" ? parseInt(value) : value);
  };

  // ✅ Validar si el formulario es válido
  const isFormValid = 
    formik.isValid && 
    formik.dirty && 
    (!selectRequired || selectValue !== 0);

  return (
    <div className="card border-success">
      <div className="card-header bg-success text-white">
        <h5 className="mb-0">
          {mode === 1 ? "Crear Nuevo Registro" : "Actualizar Registro"}
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={formik.handleSubmit}>
          {/* ✅ CAMPOS DINÁMICOS GENERADOS A PARTIR DE LABELS */}
          {labels.map((label) => {
            const isDisabled = disabledFields.includes(label); // ✅ Verificar si está deshabilitado

            return (
              <div key={label} className="mb-3">
                <label className="form-label text-success fw-bold">
                  {label.charAt(0).toUpperCase() + label.slice(1).replace(/_/g, " ")}
                  {!isDisabled && <span className="text-danger"> *</span>}
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched[label] && formik.errors[label] ? "is-invalid" : ""
                  }${
                    formik.touched[label] && !formik.errors[label] ? " is-valid" : ""
                  }`}
                  name={label}
                  value={formik.values[label]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={`Ingrese ${label}`}
                  disabled={isDisabled} // ✅ Deshabilitar campo
                  readOnly={isDisabled} // ✅ Hacer solo lectura
                />
                {formik.touched[label] && formik.errors[label] && (
                  <div className="invalid-feedback">{formik.errors[label] as string}</div>
                )}
                {/* ✅ Mensaje informativo para campos deshabilitados */}
                {isDisabled && (
                  <small className="text-muted">
                    <i className="bi bi-lock me-1"></i>
                    Este campo no puede ser modificado
                  </small>
                )}
              </div>
            );
          })}

          {/* ✅ SELECT INTEGRADO */}
          {selectOptions.length > 0 && (
            <div className="mb-3">
              <label className="form-label text-success fw-bold">
                {selectLabel}
                {selectRequired && <span className="text-danger"> *</span>}
              </label>
              <select
                className="form-select"
                value={selectValue}
                onChange={handleSelectChange}
                required={selectRequired}
                disabled={selectDisabled} // ✅ Deshabilitar select
              >
                <option value={0} disabled>
                  {selectPlaceholder}
                </option>
                {selectOptions.map((option) => (
                  <option key={option[selectValueKey]} value={option[selectValueKey]}>
                    {option[selectDisplayKey]}
                    {option.email && ` - ${option.email}`}
                  </option>
                ))}
              </select>
              {/* ✅ Mensaje informativo para select deshabilitado */}
              {selectDisabled && (
                <small className="text-muted">
                  <i className="bi bi-lock me-1"></i>
                  Este campo no puede ser modificado
                </small>
              )}
            </div>
          )}

          {/* ✅ BOTÓN DE SUBMIT */}
          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-success"
              disabled={!isFormValid || formik.isSubmitting} // ✅ Validación completa
            >
              {formik.isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  {mode === 1 ? "CREANDO..." : "ACTUALIZANDO..."}
                </>
              ) : (
                mode === 1 ? "CREAR" : "ACTUALIZAR"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};