import React from "react";
import { Props } from "../TableGeneric";
import "../../../styles/Tailwind/TailwindTable.css";

export const TailwindTable: React.FC<Props> = ({
  name = "",
  header = [],
  items = [],
  options = [],
}) => {
  const autoHeader =
    header.length === 0 && items.length > 0 ? Object.keys(items[0]) : header;

  const totalCols = autoHeader.length + (options.length > 0 ? 1 : 0);

  return (
    <div className="tailwind-table-container">
      {/* Título superior */}
      <h2 className="tailwind-table-title">Tabla de {name}</h2>

      {/* Contenedor con scroll horizontal en pantallas pequeñas */}
      <div className="tailwind-table-scroll">
        <table className="tailwind-table">
          <thead className="tailwind-table-head">
            <tr>
              {autoHeader.map((col, idx) => (
                <th key={idx} className="tailwind-table-header-cell">
                  {col}
                </th>
              ))}
              {options.length > 0 && (
                <th className="tailwind-table-header-cell tailwind-table-actions-head">
                  Options
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {items.length > 0 ? (
              items.map((item: Record<string, any>, rowIdx: number) => (
                <tr key={rowIdx} className="tailwind-table-row">
                  {autoHeader.map((key, colIdx) => (
                    <td key={colIdx} className="tailwind-table-cell">
                      {String(item[key])}
                    </td>
                  ))}

                  {options.length > 0 && (
                    <td className="tailwind-table-cell tailwind-table-actions-cell">
                      {options.map((OptionComponent, idx) =>
                        React.cloneElement(OptionComponent, { item, key: idx })
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={totalCols} className="tailwind-table-empty">
                  No hay datos proporcionados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};