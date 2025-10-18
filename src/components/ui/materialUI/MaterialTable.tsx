import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import "../../../styles/MaterialUI/MaterialTable.css";
import { Props } from "../TableGeneric";

// Este componente nos permite diseñar una tabla siguiendo el siguiente formato:
// - header: puede no tener nada o asignarse manualmente (lista de nombres de columnas).
// - items: es una lista de objetos, donde cada objeto representa una fila con sus datos.
// - options: es una lista de componentes React (por ejemplo botones) que se mostrarán al final de cada fila como acciones.

// 🔹 Este componente renderiza una tabla dinámica con Material UI
// Los encabezados y filas se generan automáticamente a partir de los datos.
export const MaterialTable: React.FC<Props> = ({
  name = "",
  header = [],
  items = [],
  options = [],
}) => {
  // Si no se proporcionan encabezados, se obtienen del primer objeto
  const autoHeader =
    header.length === 0 && items.length > 0 ? Object.keys(items[0]) : header;

  return (
    <TableContainer component={Paper} className="material-table-container">
      {/* Título superior */}
      <Typography variant="h6" className="table-title">
        Tabla de {name}
      </Typography>

      {/* Encabezado de la tabla */}
      <Table className="material-table">
        <TableHead className="table-head">
          <TableRow>
            {/* Mapeo de cada columna del header */}
            {autoHeader.map((col, idx) => (
              <TableCell key={idx} className="table-header-cell">
                {col}
              </TableCell>
            ))}
            {/* Columna adicional para botones o acciones */}
            {options.length > 0 && (
              <TableCell className="table-header-cell">Options</TableCell>
            )}
          </TableRow>
        </TableHead>

        {/* Cuerpo de la tabla */}
        <TableBody>
          {items.length > 0 ? (
            // Recorremos cada fila (objeto dentro del array items)
            items.map((item: Record<string, any>, rowIdx: number) => (
              <TableRow key={rowIdx} hover>
                {/* Por cada atributo del objeto se genera una celda */}
                {autoHeader.map((key, colIdx) => (
                  <TableCell key={colIdx} className="table-cell">
                    {String(item[key])}
                  </TableCell>
                ))}

                {/* Celda con los botones de acción */}
                {options.length > 0 && (
                  <TableCell className="table-cell">
                    {/* Clonamos los componentes para pasarles el usuario actual */}
                    {options.map((OptionComponent, idx) =>
                      React.cloneElement(OptionComponent, { item })
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            // Si no hay datos, mostramos un mensaje vacío
            <TableRow>
              <TableCell
                colSpan={autoHeader.length + 1}
                className="empty-message"
              >
                No hay datos proporcionados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
