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
  disabledFields = [],      // <-- nuevo: lista de campos a deshabilitar
  selectDisabled = false,   // <-- opcional: deshabilitar select completo
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

  // ✅ Validación para habilitar el botón (AHORA: solo depende del select requerido)
  const isSelectFilled = !selectRequired || (selectValue !== undefined && selectValue !== "" && selectValue !== 0);
  // const isFormValid = formik.isValid && formik.dirty && isSelectFilled; // ...existing code...
  const shouldDisableSubmit = (selectRequired && !isSelectFilled) || formik.isSubmitting;

  return (
    <Paper elevation={3} className="material-form-select-container">
      <Typography variant="h6" className="material-form-select-title" gutterBottom>
        {mode === 1 ? "Crear Nuevo Registro" : "Actualizar Registro"}
      </Typography>

      <form onSubmit={formik.handleSubmit} className="material-form-select-body">
        {/* 🔹 Campos dinámicos */}
        {labels.map((label) => {
          const isDisabled = disabledFields.includes(label); // <-- aplicar lista

          return (
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
                disabled={isDisabled}                       // <-- deshabilitar si está en la lista
                InputProps={{ readOnly: isDisabled }}       // <-- readonly cuando deshabilitado
              />

              {isDisabled && (
                <small style={{ display: "block", marginTop: 6, color: "#6c757d" }}>
                  Este campo no puede ser modificado
                </small>
              )}
            </div>
          );
        })}

        {/* 🔹 Select */}
        <FormControl
          fullWidth
          required={selectRequired}
          className="material-form-select"
          error={false}
          disabled={selectDisabled}
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
            {selectDisabled ? "Este campo no puede ser modificado" : (selectRequired ? "Campo obligatorio" : "Opcional")}
          </FormHelperText>
        </FormControl>

        {/* 🔹 Botón */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="material-form-submit"
          disabled={shouldDisableSubmit} // <-- ahora solo deshabilita si el select requerido NO está seleccionado (o está enviando)
        >
          {mode === 1 ? "CREAR" : "ACTUALIZAR"}
        </Button>
      </form>
    </Paper>
  );
};
