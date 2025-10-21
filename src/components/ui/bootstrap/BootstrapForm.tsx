import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export interface FormItems<T = any> {
  mode?: number;
  labels: string[];
  info?: T | null;
  handleAction?: (data: T) => void;
  validationSchema?: Yup.ObjectSchema<any>;
}

export const BootstrapForm = <T extends Record<string, any>>({
  mode = 0,
  labels,
  info = null,
  handleAction,
  validationSchema,
}: FormItems<T>) => {
  const initialValues = labels.reduce((acc, label) => {
    const key = label.toLowerCase();
    acc[key] = info ? info[key] ?? "" : "";
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
          onSubmit={(values) => {
            if (handleAction) handleAction(values as T);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              {labels.map((label, idx) => {
                const key = label.toLowerCase();
                return (
                  <div className="mb-3" key={idx}>
                    <label htmlFor={key} className="form-label fw-semibold text-success">
                      {label}
                    </label>
                    <Field
                      name={key}
                      type="text"
                      className={`form-control ${
                        touched[key] && errors[key] ? "is-invalid" : ""
                      }`}
                      id={key}
                    />
                    <ErrorMessage name={key}>
                      {(msg) => <div className="invalid-feedback">{msg}</div>}
                    </ErrorMessage>
                  </div>
                );
              })}

              <button type="submit" className="btn btn-success w-100 fw-bold text-uppercase">
                {mode === 1 ? "Crear" : mode === 2 ? "Actualizar" : "Enviar"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};