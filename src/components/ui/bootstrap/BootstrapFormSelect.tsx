import React from "react";
import { useFormik } from "formik";

import { FormSelectItems } from "../FormSelectGeneric";

export const BootstrapFormSelect: React.FC<FormSelectItems> = ({
  mode = 1,
  labels,
  info,
  handleAction,
  validationSchema,
  selectLabel = "Seleccionar",
  selectOptions,
  selectValue,
  onSelectChange,
  selectDisplayKey = "name",
  selectValueKey = "id",
  selectPlaceholder = "Seleccionar...",
  selectRequired = false,
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
          {labels.map((label) => (
            <div key={label} className="mb-3">
              <label className="form-label">{label}</label>
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
              />
              {formik.touched[label] && formik.errors[label] && (
                <div className="invalid-feedback">{formik.errors[label] as string}</div>
              )}
            </div>
          ))}
          {/* ✅ SELECT INTEGRADO */}
          <div className="mb-3">
            <label className="form-label">
              {selectLabel}
              {selectRequired && <span className="text-danger"> *</span>}
            </label>
            <select
              className="form-select"
              value={selectValue}
              onChange={handleSelectChange}
              required={selectRequired}
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
          </div>

          {/* ✅ BOTÓN DE SUBMIT */}
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-success" disabled={formik.isSubmitting}>
              {mode === 1 ? "CREAR" : "ACTUALIZAR"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};