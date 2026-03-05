import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/services/supabase"
import DataTable from "../components/DataTable"
import StatusBadge from "../components/StatusBadge"

export default function Disputes() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  const [q, setQ] = useState("")
  const [type, setType] = useState("all")

  useEffect(() => {
    fetchDisputes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  async function fetchDisputes() {
    setLoading(true)

    let query = supabase
      .from("disputes")
      .select("id, type, status, patient_id, provider_id, amount, created_at, escalated")
      .order("created_at", { ascending: false })
      .limit(200)

    if (type !== "all") query = query.eq("type", type)

    const { data, error } = await query
    if (error) {
      console.error("Disputes fetch error:", error.message)
      setRows([])
      setLoading(false)
      return
    }

    setRows(data || [])
    setLoading(false)
  }

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return rows
    return rows.filter((r) => {
      return (
        String(r.id).toLowerCase().includes(term) ||
        String(r.type || "").toLowerCase().includes(term) ||
        String(r.status || "").toLowerCase().includes(term)
      )
    })
  }, [rows, q])

  const columns = [
    { key: "id", header: "Case ID" },
    { key: "type", header: "Type" },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "amount",
      header: "Amount",
      render: (r) => (r.amount != null ? `₦${Number(r.amount).toLocaleString()}` : "—"),
    },
    {
      key: "escalated",
      header: "Escalated",
      render: (r) =>
        r.escalated ? (
          <span className="text-red-600 font-medium">Yes</span>
        ) : (
          <span className="text-gray-500">No</span>
        ),
    },
    {
      key: "created_at",
      header: "Date",
      render: (r) =>
        r.created_at ? new Date(r.created_at).toLocaleString() : "—",
    },
  ]

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Disputes</h2>
            <p className="text-sm text-gray-500 mt-1">
              Pulled from <span className="font-medium">disputes</span>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border rounded-xl px-3 py-2 text-sm bg-white"
            >
              <option value="all">All types</option>
              <option value="lab">lab</option>
              <option value="prescription">prescription</option>
              <option value="consultation">consultation</option>
            </select>

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search case/type/status…"
              className="border rounded-xl px-4 py-2 text-sm w-full sm:w-80"
            />
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={loading}
        emptyText="No disputes found."
      />
    </div>
  )
}