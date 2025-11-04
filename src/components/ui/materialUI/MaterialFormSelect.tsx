import React from "react";
import { useFormik } from "formik";
import {
  TextField,
  MenuItem,
  Button,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import { FormSelectItems } from "../FormSelectGeneric";
import "../../../styles/MaterialUI/MaterialFormSelect.css";

export const MaterialFormSelect: React.FC<FormSelectItems> = ({
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
  // ✅ Crear initialValues dinámicamente
  const initialValues = labels.reduce((acc, label) => {
    acc[label] = info ? info[label] || "" : "";
    return acc;
  }, {} as any);

  // ✅ Configurar Formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (handleAction) handleAction(values);
    },
  });

  // ✅ Manejador del Select
  const handleSelectChange = (event: any) => {
    const value = event.target.value;
    onSelectChange(selectValueKey === "id" ? parseInt(value) : value);
  };

  return (
    <Paper elevation={3} className="material-form-select-container">
      <Typography variant="h6" className="material-form-select-title" gutterBottom>
        {mode === 1 ? "Crear Nuevo Registro" : "Actualizar Registro"}
      </Typography>

      <form onSubmit={formik.handleSubmit} className="material-form-select-body">
        {/* 🔹 Campos dinámicos */}
        {labels.map((label) => (
          <div key={label} className="material-form-field">
            <TextField
                fullWidth
                id={label}
                name={label}
                label={label}
                value={formik.values[label]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched[label] && Boolean(formik.errors[label])}
                helperText={
                    formik.touched[label] && typeof formik.errors[label] === "string"
                    ? formik.errors[label]
                    : undefined
                }
                variant="outlined"
            />

          </div>
        ))}

        {/* 🔹 Select */}
        <FormControl
          fullWidth
          required={selectRequired}
          className="material-form-select"
          error={false}
        >
          <InputLabel>{selectLabel}</InputLabel>
          <Select
            value={selectValue || ""}
            onChange={handleSelectChange}
            label={selectLabel}
          >
            <MenuItem value="">
              <em>{selectPlaceholder}</em>
            </MenuItem>
            {selectOptions.map((option) => (
              <MenuItem key={option[selectValueKey]} value={option[selectValueKey]}>
                {option[selectDisplayKey]}
                {option.email && ` - ${option.email}`}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {selectRequired ? "Campo obligatorio" : "Opcional"}
          </FormHelperText>
        </FormControl>

        {/* 🔹 Botón */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="material-form-submit"
          disabled={formik.isSubmitting}
        >
          {mode === 1 ? "CREAR" : "ACTUALIZAR"}
        </Button>
      </form>
    </Paper>
  );
};
