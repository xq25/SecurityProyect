import React from "react";
import { Props } from "../TableGeneric";
import "../../../styles/Bootstrap/BootstrapTable.css";

export const BootstrapTable: React.FC<Props> = ({
  name = "",
  header = [],
  items = [],
  options = [],
}) => {
  const autoHeader =
    header.length === 0 && items.length > 0 ? Object.keys(items[0]) : header;

  return (
    <div className="card shadow-sm mt-4 border-success">
      {/* Título superior */}
      <div className="card-header bg-success text-white">
        <h5 className="mb-0 fw-bold">Tabla de {name}</h5>
      </div>

      {/* Tabla */}
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            {/* Encabezado */}
            <thead className="table-success">
              <tr>
                {autoHeader.map((col, idx) => (
                  <th key={idx} scope="col" className="text-uppercase fw-semibold">
                    {col}
                  </th>
                ))}
                {options.length > 0 && <th scope="col" className="text-uppercase fw-semibold">Options</th>}
              </tr>
            </thead>

            {/* Cuerpo */}
            <tbody>
              {items.length > 0 ? (
                items.map((item: Record<string, any>, rowIdx: number) => (
                  <tr key={rowIdx}>
                    {autoHeader.map((key, colIdx) => (
                      <td key={colIdx}>{String(item[key])}</td>
                    ))}
                    {options.length > 0 && (
                      <td>
                        <div className="d-flex gap-2">
                          {options.map((OptionComponent, optIdx) =>
                            React.cloneElement(OptionComponent, {
                              key: optIdx,
                              item,
                            })
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={autoHeader.length + (options.length > 0 ? 1 : 0)} className="text-center py-4 text-muted fst-italic">
                    No hay datos proporcionados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};