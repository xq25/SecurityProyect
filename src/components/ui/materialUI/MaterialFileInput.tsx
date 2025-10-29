import React, { useRef } from "react";
import { FileInputItem } from "../FileInputGeneric";
import { Box, Button, TextField, Typography, Avatar, Stack } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import '../../../styles/MaterialUI/MaterialFileInput.css';

export const MaterialFileInput: React.FC<FileInputItem> = ({
  label = "Seleccionar archivo",
  accept = "image/*",
  onChange,
  value,
  preview,
  disabled = false,
  required = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  return (
    <Box className="material-file-input-container">
      {label && (
        <Typography className="material-file-input-label">
          {label}
          {required && <span className="material-file-input-required">*</span>}
        </Typography>
      )}

      <Stack direction="row" spacing={2} alignItems="center" className="material-file-input-group">
        <TextField
          fullWidth
          value={value?.name || ""}
          placeholder="No se ha seleccionado ningún archivo"
          InputProps={{ readOnly: true }}
          disabled={disabled}
          required={required}
          variant="outlined"
        />
        <Button
          variant="outlined"
          startIcon={<UploadFileIcon />}
          onClick={handleBrowseClick}
          disabled={disabled}
        >
          Seleccionar
        </Button>
      </Stack>

      {/* Input real oculto */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="material-file-input-hidden"
        disabled={disabled}
        required={required}
      />

      {/* Vista previa de imagen */}
      {preview && (
        <Box className="material-file-input-preview">
          <Avatar
            variant="rounded"
            src={preview}
            alt="Vista previa"
            className="material-file-input-preview-image"
          />
        </Box>
      )}
    </Box>
  );
};
