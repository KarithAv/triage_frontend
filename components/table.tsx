"use client";
import React, { useState } from "react";

interface Column {
  key: string;
  label: string;
}

interface TableProps {
  columns: Column[];
  data: any[];
  pageSize?: number; // Opcional – por defecto será 10
}

const Table: React.FC<TableProps> = ({ columns, data, pageSize = 10 }) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const currentData = data.slice(startIndex, endIndex);

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-md p-4">
      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-purple-700 text-white">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-gray-500"
              >
                No hay datos disponibles
              </td>
            </tr>
          ) : (
            currentData.map((row, idx) => (
              <tr
                key={idx}
                className={`border-b hover:bg-gray-50 ${
                  idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 text-center text-sm text-gray-800"
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-purple-600 text-white rounded disabled:opacity-50"
          >
            Anterior
          </button>

          <span className="text-sm text-gray-700">
            Página {page} de {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-purple-600 text-white rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
