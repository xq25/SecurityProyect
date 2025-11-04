import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FormItems } from "../FormGeneric";


export const BootstrapForm = <T extends Record<string, any>>({
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
    <div className="card shadow-sm mt-4 border-success">
      {/* Título */}
      <div className="card-header bg-success text-white">
        <h5 className="mb-0 fw-bold">
          {mode === 1 ? "Crear Nuevo Registro" : mode === 2 ? "Editar Registro" : "Registro"}
        </h5>
      </div>

      <div className="card-body bg-light">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validateOnMount={true}
          validateOnChange={true}
          validateOnBlur={true}
          enableReinitialize={true}
          onSubmit={(values, { resetForm }) => {
            if (handleAction) handleAction(values as T);
            resetForm();
          }}
        >
          {({ errors, touched, isValid, dirty, isSubmitting }) => (
            <Form>
              {extraContent && (
                <div className="mb-3">{extraContent}</div>
              )}

              {labels.map((label, idx) => {
                const key = label;
                
                if (hiddenFields.includes(key)) return null;
                
                const isDisabled = disabledFields.includes(key);
                const hasError = touched[key] && errors[key];
                
                return (
                  <div className="mb-3" key={idx}>
                    <label htmlFor={key} className="form-label fw-semibold text-success">
                      {label}
                    </label>
                    <Field
                      name={key}
                      type={key.toLowerCase() === "email" ? "email" : 
                            key.toLowerCase() === "password" ? "password" : "text"}
                      className={`form-control ${hasError ? "is-invalid" : ""}`}
                      id={key}
                      placeholder={`Ingrese ${label}`}
                      disabled={isDisabled}
                    />
                    <ErrorMessage name={key}>
                      {(msg) => (
                        <div className="invalid-feedback d-block text-danger fw-medium">
                          {msg}
                        </div>
                      )}
                    </ErrorMessage>
                  </div>
                );
              })}

              <button 
                type="submit" 
                className="btn w-100 fw-bold text-uppercase btn-success"
                disabled={!isValid || !dirty || isSubmitting}
              >
                {mode === 1 ? "Crear" : mode === 2 ? "Actualizar" : "Enviar"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};