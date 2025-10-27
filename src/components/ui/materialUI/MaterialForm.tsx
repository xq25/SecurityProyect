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
  extraContent,

}: FormItems<T>) => {
  //Aqui agregamos la informacion a los campos del formulario en caso tal de que esta misma exista (Esto solo lo usamos para actualizar)
  const initialValues = labels.reduce((acc, label) => {
    const key = label.toLowerCase();
    acc[key] = info ? info[key] ?? "" : "";
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
        onSubmit={(values, { resetForm }) => {
          if (handleAction) handleAction(values as T);
          resetForm();
        }}
      >
        {({ isValid, dirty }) => (
          <Form className="material-form">
            {/* Aqui van agregados otros componentes que deseemos y los envolvemos en una clase especifica*/}
            {extraContent && (<div className="material-form-extra">{extraContent}</div>)}

            {/* Aqui agregamos los campos de nuestro formulario*/}
            {labels.map((label, idx) => {
              const key = label.toLowerCase();
              const isDisabled = disabledFields.includes(key); //  Verificamos si el campo está deshabilitado
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
                        disabled={isDisabled} //Campo bloqueado si corresponde
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
              disabled={!isValid || !dirty}
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
