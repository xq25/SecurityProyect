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


// Este componente nos permite diseñar una tabla siguiendo en siguiente formato ( header: puede no tener nada o asignarlo manualmente, items : es una lista de objetos, esto nos permite definir automaticamente loss keys )
export const MaterialTable: React.FC<Props> = ({
  name = "",
  header = [],
  items = [],
}) => {
  // Si no se pasan headers, los obtiene automáticamente del primer objeto
  const autoHeader =
    header.length === 0 && items.length > 0
      ? Object.keys(items[0])
      : header;

  return (
    <TableContainer component={Paper} className="material-table-container">
      <Typography variant="h6" className="table-title">
        Tabla de {name}
      </Typography>

      <Table className="material-table">
        <TableHead className="table-head">
          <TableRow>
            {autoHeader.map((col, idx) => (
              <TableCell key={idx} className="table-header-cell">
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {items.length > 0 ? (
            items.map((item: Record<string, any>, rowIdx: number) => (
              <TableRow key={rowIdx} hover>
                {autoHeader.map((key, colIdx) => (
                  <TableCell key={colIdx} className="table-cell">
                    {String(item[key])}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={autoHeader.length || 1}
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
