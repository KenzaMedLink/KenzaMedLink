import React from "react"

export default function DataTable({
  columns = [],
  data = [],
  actions,
}) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-3">
                  {col.header}
                </th>
              ))}
              {actions && <th className="px-6 py-3">Actions</th>}
            </tr>
          </thead>

          <tbody className="divide-y">
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No data found
                </td>
              </tr>
            )}

            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    {col.render
                      ? col.render(row)
                      : row[col.accessor]}
                  </td>
                ))}

                {actions && (
                  <td className="px-6 py-4">
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}