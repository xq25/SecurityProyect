import React from "react";
import { Formik, Form, Field } from "formik";
import "../../../styles/Tailwind/TailwindForm.css";
import { FormItems } from "../FormGeneric";

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
    acc[label] = info ? info[label] ?? "" : "";
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="tailwind-form-container">
      <h2 className="tailwind-form-title">
        {mode === 1 ? "Crear Nuevo Registro" : mode === 3 ? "Editar Registro" : "Registro"}
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={(values, { setSubmitting }) => {
          if (handleAction) {
            handleAction(values as T);
          }
          setSubmitting(false);
        }}
      >
        {({ setFieldValue, values }) => {
          return (
            <Form className="tailwind-form">
              {labels.map((label, idx) => {
                const isFileField = label.toLowerCase() === 'photo' || label.toLowerCase() === 'file';
                
                return (
                  <div className="tailwind-form-field" key={idx}>
                    {isFileField ? (
                      <div className="tailwind-input-group">
                        <label htmlFor={label} className="tailwind-input-label">
                          {label}
                        </label>
                        <input
                          id={label}
                          name={label}
                          type="file"
                          accept="image/*"
                          className="tailwind-input"
                          onChange={(event) => {
                            const file = event.currentTarget.files?.[0];
                            setFieldValue(label, file || null);
                          }}
                        />
                        
                        {values[label] instanceof File && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                            <img
                              src={URL.createObjectURL(values[label])}
                              alt="Preview"
                              className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                            />
                          </div>
                        )}
                        
                        {mode === 3 && info && info[label] && !(values[label] instanceof File) && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600 mb-2">Imagen actual:</p>
                            <img
                              src={typeof info[label] === 'string' && info[label].startsWith('http') 
                                ? info[label] 
                                : `http://127.0.0.1:5000/api/profiles/${info[label]}`}
                              alt="Current"
                              className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <Field name={label}>
                        {({ field, meta }: any) => (
                          <div className="tailwind-input-group">
                            <label htmlFor={label} className="tailwind-input-label">
                              {label}
                            </label>
                            <input
                              {...field}
                              id={label}
                              className={`tailwind-input ${
                                meta.touched && meta.error ? "tailwind-input-error" : ""
                              }`}
                              type={label.toLowerCase() === "password" ? "password" : "text"}
                              placeholder={`Ingrese ${label}`}
                            />
                            {meta.touched && meta.error && (
                              <div className="tailwind-error-message">{meta.error}</div>
                            )}
                          </div>
                        )}
                      </Field>
                    )}
                  </div>
                );
              })}

              <button type="submit" className="tailwind-submit-button">
                {mode === 1 ? "Crear" : mode === 3 ? "Actualizar" : "Guardar"}
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};