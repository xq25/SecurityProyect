import React from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "../../../styles/MaterialUI/MaterialForm.css";

// 🔹 Interfaz base genérica para los props del formulario
export interface FormItems<T = any> {
  mode?: number;
  labels: string[];
  info?: T | null;
  handleAction?: (data: T) => void; 
  validationSchema?: Yup.ObjectSchema<any>;
}

/**
 * 🔹 MaterialForm genérico con Formik + Yup
 * Genera formularios dinámicos y aplica validaciones automáticas.
 * Usa tipado genérico <T> para adaptar el formulario a cualquier modelo (User, Roles, etc.)
 */
export const MaterialForm = <T extends Record<string, any>>({
  mode = 0,
  labels,
  info = null,
  handleAction,
  validationSchema,
}: FormItems<T>) => {
  // 🔸 Generamos los valores iniciales basados en los labels y la info pasada
  const initialValues = labels.reduce((acc, label) => {
    const key = label.toLowerCase();
    acc[key] = info ? info[key] ?? "" : "";
    return acc;
  }, {} as Record<string, any>);

  return (
    <Paper elevation={3} className="material-form-container">
      {/* 🔹 Título dinámico según modo */}
      <Typography variant="h6" gutterBottom>
        {mode === 1
          ? "Crear Nuevo Registro"
          : mode === 2
          ? "Editar Registro"
          : "Registro"}
      </Typography>

      {/* 🔹 Formik controla estado, validaciones y envío */}
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
            {/* 🔹 Generamos campos dinámicamente según labels */}
            {labels.map((label, idx) => {
              const key = label.toLowerCase();
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
                      />
                    )}
                  </Field>
                </div>
              );
            })}

            {/* 🔹 Botón de envío */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
              disabled={!isValid || !dirty} // 🔹 Bloquea si el formulario no es válido
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
