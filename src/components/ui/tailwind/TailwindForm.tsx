import React from "react";
import { Formik, Form, Field} from "formik";

import "../../../styles/Tailwind/TailwindForm.css";
import { FormItems } from "../FormGeneric";

/**
 * 🔹 TailwindForm genérico con Formik + Yup
 * Genera formularios dinámicos y aplica validaciones automáticas.
 * Usa tipado genérico <T> para adaptar el formulario a cualquier modelo (User, Roles, etc.)
 */
export const TailwindForm = <T extends Record<string, any>>({
  mode = 0,
  labels,
  info = null,
  handleAction,
  validationSchema,
  disabledFields = [],
  hiddenFields = [],
  extraContent,
}: FormItems<T>) => {
  const initialValues = labels.reduce((acc, label) => {
    const key = label;
    acc[key] = info ? (info as any)[key] ?? "" : "";
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="tailwind-form-container">
      {/* 🔹 Título dinámico según modo */}
      <h2 className="tailwind-form-title">
        {mode === 1
          ? "Crear Nuevo Registro"
          : mode === 2
          ? "Editar Registro"
          : "Registro"}
      </h2>

      {/* 🔹 Formik controla estado, validaciones y envío */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnChange={true}
        validateOnBlur={true}
        validateOnMount={true}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          if (handleAction) handleAction(values as T);
          resetForm();
        }}
      >
        {({ isValid, dirty, isSubmitting }) => (
          <Form className="tailwind-form">
            {/* 🔹 Contenido extra opcional */}
            {extraContent && (
              <div className="tailwind-form-extra">{extraContent}</div>
            )}

            {/* 🔹 Generamos campos dinámicamente según labels */}
            {labels.map((label, idx) => {
              const key = label;

              // 🔹 Omitir campos ocultos
              if (hiddenFields.includes(key)) return null;

              const isDisabled = disabledFields.includes(key);

              return (
                <div className="tailwind-form-field" key={idx}>
                  <Field name={key}>
                    {({ field, meta }: any) => (
                      <div className="tailwind-input-group">
                        <label htmlFor={key} className="tailwind-input-label">
                          {label}
                        </label>
                        <input
                          {...field}
                          id={key}
                          className={`tailwind-input ${
                            meta.touched && meta.error ? "tailwind-input-error" : ""
                          }`}
                          type="text"
                          placeholder={`Ingrese ${label}`}
                          disabled={isDisabled}
                        />
                        {meta.touched && meta.error && (
                          <div className="tailwind-error-message">
                            {meta.error}
                          </div>
                        )}
                      </div>
                    )}
                  </Field>
                </div>
              );
            })}

            {/* 🔹 Botón de envío */}
            <button
              type="submit"
              className={`tailwind-submit-button ${
                !isValid || !dirty || isSubmitting ? "tailwind-button-disabled" : ""
              }`}
              disabled={!isValid || !dirty || isSubmitting}
            >
              {mode === 1
                ? "Crear"
                : mode === 2
                ? "Actualizar"
                : "Enviar"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};