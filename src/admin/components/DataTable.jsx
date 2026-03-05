import StatusBadge from "./StatusBadge"

export default function DataTable({
  columns = [],
  rows = [],
  loading = false,
  emptyText = "No records found.",
}) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-10 text-center text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-10 text-center text-gray-500"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr key={row.id ?? idx} className="hover:bg-gray-50">
                  {columns.map((c) => (
                    <td key={c.key} className="px-5 py-4 text-gray-800">
                      {c.render ? (
                        c.render(row)
                      ) : c.key === "status" ? (
                        <StatusBadge status={row[c.key]} />
                      ) : (
                        <span className="text-gray-700">
                          {row[c.key] ?? "-"}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}