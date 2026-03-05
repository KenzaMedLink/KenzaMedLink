import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/services/supabase"
import DataTable from "../components/DataTable"
import StatusBadge from "../components/StatusBadge"

export default function Transactions() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  const [q, setQ] = useState("")
  const [status, setStatus] = useState("all")

  useEffect(() => {
    fetchTx()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  async function fetchTx() {
    setLoading(true)

    let query = supabase
      .from("transactions")
      .select("id, user_id, type, amount, status, created_at, reference")
      .order("created_at", { ascending: false })
      .limit(200)

    if (status !== "all") query = query.eq("status", status)

    const { data, error } = await query
    if (error) {
      console.error("Transactions fetch error:", error.message)
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
        String(r.reference || "").toLowerCase().includes(term) ||
        String(r.user_id || "").toLowerCase().includes(term) ||
        String(r.type || "").toLowerCase().includes(term)
      )
    })
  }, [rows, q])

  const columns = [
    { key: "id", header: "Tx ID" },
    { key: "type", header: "Type" },
    {
      key: "amount",
      header: "Amount",
      render: (r) => `₦${Number(r.amount || 0).toLocaleString()}`,
    },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "created_at",
      header: "Date",
      render: (r) =>
        r.created_at ? new Date(r.created_at).toLocaleString() : "—",
    },
    { key: "reference", header: "Reference" },
  ]

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Transactions</h2>
            <p className="text-sm text-gray-500 mt-1">
              Pulled from <span className="font-medium">transactions</span>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded-xl px-3 py-2 text-sm bg-white"
            >
              <option value="all">All status</option>
              <option value="success">success</option>
              <option value="pending">pending</option>
              <option value="failed">failed</option>
              <option value="refunded">refunded</option>
              <option value="flagged">flagged</option>
            </select>

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Tx ID / user / reference…"
              className="border rounded-xl px-4 py-2 text-sm w-full sm:w-80"
            />
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={loading}
        emptyText="No transactions found."
      />
    </div>
  )
}