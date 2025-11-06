import React, { useRef } from "react";
import { FileInputItem } from "../FileInputGeneric";
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Avatar, 
  Stack,
  FormHelperText 
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import '../../../styles/MaterialUI/MaterialFileInput.css';

export const MaterialFileInput: React.FC<FileInputItem> = ({
  label = "Seleccionar archivo",
  accept = "image/*",
  onChange,
  value,
  preview,
  disabled = false,
  required = false,
  name = "file",
  error,
  touched,
  onBlur,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  // ✅ Determinar estado de validación
  const hasError = touched && error;
  const isValid = touched && !error && value;

  return (
    <Box className="material-file-input-container" sx={{ mb: 3 }}>
      {/* Label - Color primario de Material */}
      {label && (
        <Typography 
          className="material-file-input-label" 
          sx={{ 
            mb: 1, 
            fontWeight: 600, 
            color: 'primary.main', // ✅ Azul Material (#1976d2)
            fontSize: '0.95rem'
          }}
        >
          {label}
          {required && (
            <Typography component="span" sx={{ color: 'error.main', ml: 0.5 }}>
              *
            </Typography>
          )}
        </Typography>
      )}

      {/* Input Group */}
      <Stack direction="row" spacing={1} alignItems="center" className="material-file-input-group">
        <TextField
          fullWidth
          value={value?.name || ""}
          placeholder="No se ha seleccionado ningún archivo"
          InputProps={{ 
            readOnly: true,
            endAdornment: isValid ? (
              <CheckCircleIcon sx={{ color: 'success.main', mr: 1 }} /> // ✅ Verde Material (#2e7d32)
            ) : hasError ? (
              <ErrorIcon sx={{ color: 'error.main', mr: 1 }} /> // ✅ Rojo Material (#d32f2f)
            ) : null
          }}
          disabled={disabled}
          variant="outlined"
          size="small"
          onBlur={onBlur}
          // ✅ Estilos con colores nativos de Material
          error={!!hasError}
          color={isValid ? "success" : "primary"}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: hasError ? 'error.main' : isValid ? 'success.main' : 'primary.main',
                borderWidth: 2,
              },
              '& fieldset': {
                borderColor: hasError ? 'error.main' : isValid ? 'success.main' : undefined,
              },
            },
          }}
        />
        <Button
          variant="outlined"
          startIcon={<UploadFileIcon />}
          onClick={handleBrowseClick}
          disabled={disabled}
          size="small"
          color={hasError ? "error" : "primary"} // ✅ Colores nativos
          sx={{
            whiteSpace: 'nowrap',
            minWidth: '120px',
            borderWidth: 1.5,
            '&:hover': {
              borderWidth: 1.5,
            }
          }}
        >
          Browse
        </Button>
      </Stack>

      {/* ✅ Error Message - Rojo Material */}
      {hasError && (
        <FormHelperText error sx={{ mt: 1, fontWeight: 500, display: 'flex', alignItems: 'center' }}>
          <ErrorIcon sx={{ fontSize: 16, mr: 0.5 }} />
          {error}
        </FormHelperText>
      )}

      {/* ✅ Success Message - Verde Material */}
      {isValid && (
        <FormHelperText sx={{ mt: 1, color: 'success.main', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} />
          Archivo cargado correctamente
        </FormHelperText>
      )}

      {/* Input real oculto */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="material-file-input-hidden"
        disabled={disabled}
        style={{ display: 'none' }}
      />

      {/* Vista previa de imagen - Verde Material */}
      {preview && (
        <Box 
          className="material-file-input-preview" 
          sx={{ 
            mt: 3, 
            textAlign: 'center',
            p: 2,
            border: '2px solid',
            borderColor: 'success.main', // ✅ Verde Material
            borderRadius: 1,
            backgroundColor: 'grey.50',
            display: 'inline-block'
          }}
        >
          <Avatar
            variant="rounded"
            src={preview}
            alt="Preview"
            className="material-file-input-preview-image"
            sx={{
              width: 300,
              height: 300,
              objectFit: 'contain',
              mx: 'auto'
            }}
          />
          {value && (
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 2, 
                color: 'success.main', // ✅ Verde Material
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} />
              {value.name}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};