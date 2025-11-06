import React from "react";
import { useFormik } from "formik";
import { FormSelectItems } from "../FormSelectGeneric";

export const TailwindFormSelect: React.FC<FormSelectItems> = ({
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
  disabledFields = [],
  selectDisabled = false,
}) => {
  // Crear initialValues dinámicamente
  const initialValues = labels.reduce((acc, label) => {
    acc[label] = info ? info[label] || "" : "";
    return acc;
  }, {} as any);

  // Configurar Formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (handleAction) handleAction(values);
    },
  });

  // Manejador del Select
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onSelectChange(selectValueKey === "id" ? parseInt(value) : value);
  };

  const isSelectFilled = !selectRequired || (selectValue !== undefined && selectValue !== "" && selectValue !== 0);
  const shouldDisableSubmit = (selectRequired && !isSelectFilled) || formik.isSubmitting;

  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-6 max-w-lg mx-auto my-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        {mode === 1 ? "Crear Nuevo Registro" : "Actualizar Registro"}
      </h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Campos dinámicos */}
        {labels.map((label) => {
          const isDisabled = disabledFields.includes(label);
          return (
            <div key={label}>
              <label htmlFor={label} className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                {label}
              </label>
              <input
                type="text"
                id={label}
                name={label}
                value={formik.values[label]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isDisabled}
                readOnly={isDisabled}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white ${
                  formik.touched[label] && formik.errors[label]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {formik.touched[label] && formik.errors[label] && (
                <p className="text-xs text-red-500 mt-1">{formik.errors[label] as string}</p>
              )}
              {isDisabled && (
                <small className="block mt-1 text-gray-400">Este campo no puede ser modificado</small>
              )}
            </div>
          );
        })}

        {/* Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            {selectLabel}
          </label>
          <select
            value={selectValue || ""}
            onChange={handleSelectChange}
            disabled={selectDisabled}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white ${
              selectDisabled ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed" : ""
            }`}
            required={selectRequired}
          >
            <option value="">{selectPlaceholder}</option>
            {selectOptions.map((option) => (
              <option key={option[selectValueKey]} value={option[selectValueKey]}>
                {option[selectDisplayKey]}
                {option.email && ` - ${option.email}`}
              </option>
            ))}
          </select>
          <p className="text-xs mt-1 text-gray-500">
            {selectDisabled
              ? "Este campo no puede ser modificado"
              : selectRequired
              ? "Campo obligatorio"
              : "Opcional"}
          </p>
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={shouldDisableSubmit}
          className={`w-full py-2 px-4 rounded bg-primary-600 text-white font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {mode === 1 ? "CREAR" : "ACTUALIZAR"}
        </button>
      </form>
    </div>
  );
};