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
  // ✅ Validación por defecto si no se proporciona una
  const defaultValidationSchema = Yup.object().shape(
    labels.reduce((acc, label) => {
      const key = label.toLowerCase();
      
      // Validación específica para email
      if (key === "email") {
        acc[key] = Yup.string()
          .email("Debe ser un correo electrónico válido")
          .required(`El ${label} es obligatorio`);
      } 
      // Validación para name
      else if (key === "name" || key === "nombre") {
        acc[key] = Yup.string()
          .min(3, `El ${label} debe tener al menos 3 caracteres`)
          .required(`El ${label} es obligatorio`);
      }
      // Validación genérica para otros campos
      else {
        acc[key] = Yup.string().required(`El ${label} es obligatorio`);
      }
      
      return acc;
    }, {} as Record<string, Yup.StringSchema>)
  );

  const finalValidationSchema = validationSchema || defaultValidationSchema;

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
          validationSchema={finalValidationSchema}
          onSubmit={(values) => {
            if (handleAction) handleAction(values as T);
          }}
        >
          {({ errors, touched, isValid, dirty }) => (
            <Form>
              {labels.map((label, idx) => {
                const key = label.toLowerCase();
                const hasError = touched[key] && errors[key];
                
                return (
                  <div className="mb-3" key={idx}>
                    <label htmlFor={key} className="form-label fw-semibold text-success">
                      {label}
                    </label>
                    <Field
                      name={key}
                      type={key === "email" ? "email" : key === "password" ? "password" : "text"}
                      className={`form-control ${
                        touched[key] && errors[key] 
                          ? "is-invalid border-danger" 
                          : touched[key] && !errors[key]
                          ? "is-valid border-success"
                          : ""
                      }`}
                      id={key}
                      placeholder={`Ingrese ${label.toLowerCase()}`}
                    />
                    
                    {/* ✅ Mensaje de error personalizado */}
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

              {/* ✅ Botón con estado dinámico */}
              <button 
                type="submit" 
                className={`btn w-100 fw-bold text-uppercase ${
                  isValid && dirty 
                    ? "btn-success" 
                    : "btn-secondary"
                }`}
                disabled={!isValid || !dirty}
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