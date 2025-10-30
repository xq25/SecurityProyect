import React from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { Formik, Form, Field } from "formik";
import "../../../styles/MaterialUI/MaterialForm.css";
import { FormItems } from "../FormGeneric";

export const MaterialForm = <T extends Record<string, any>>({
  mode = 0,
  labels,
  info = null,
  handleAction,
  validationSchema,
  disabledFields = [],
  hiddenFields = [],
  extraContent,
}: FormItems<T>) => {
  // Configuramos los valores iniciales
  const initialValues = labels.reduce((acc, label) => {
    const key = label; // Remove toLowerCase
    acc[key] = info ? (info as any)[key] ?? "" : "";
    return acc;
  }, {} as Record<string, any>);

  return (
    <Paper elevation={3} className="material-form-container">
      <Typography variant="h6" gutterBottom>
        {mode === 1
          ? "Crear Nuevo Registro"
          : mode === 2
          ? "Editar Registro"
          : "Registro"}
      </Typography>

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
          <Form className="material-form">
            {/* Contenido adicional (extra) */}
            {extraContent && (
              <div className="material-form-extra">{extraContent}</div>
            )}

            {/* Renderizado de los campos */}
            {labels.map((label, idx) => {
              const key = label; // Use original case
              
              if (hiddenFields.includes(key)) return null;
              
              const isDisabled = disabledFields.includes(key);

              return (
                <div className="material-form-field" key={idx}>
                  <Field name={key}>
                    {({ field, meta }: any) => (
                      <TextField
                        {...field}
                        label={label}
                        fullWidth
                        variant="outlined"
                        error={meta.touched && Boolean(meta.error)}
                        helperText={meta.touched && meta.error}
                        disabled={isDisabled}
                      />
                    )}
                  </Field>
                </div>
              );
            })}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
              disabled={!isValid || !dirty || isSubmitting}
            >
              {mode === 1
                ? "Crear"
                : mode === 2
                ? "Actualizar"
                : "Enviar"}
            </Button>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};
