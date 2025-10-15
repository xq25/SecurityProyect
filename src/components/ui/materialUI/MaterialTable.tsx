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

export const MaterialTable: React.FC<Props> = ({
  name = '',
  header = [],
  items = [],
}) => {
  return (
    <TableContainer component={Paper} className="material-table-container">
      <Typography variant="h6" className="table-title">
        Tabla de {name}
      </Typography>

      <Table className="material-table">
        <TableHead className="table-head">
          <TableRow>
            {header.map((col, idx) => (
              <TableCell key={idx} className="table-header-cell">
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {items.length > 0 ? (
            items.map((item, rowIdx) => (
              <TableRow key={rowIdx} hover>
                {item.contentRow.map((cell: any, colIdx: number) => (
                  <TableCell key={colIdx} className="table-cell">
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={header.length || 1}
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
