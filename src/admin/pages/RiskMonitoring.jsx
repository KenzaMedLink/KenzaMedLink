import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/services/supabase"
import DataTable from "../components/DataTable"
import StatusBadge from "../components/StatusBadge"

const HIGH_AMOUNT = 2000000 // ₦2,000,000

export default function RiskMonitoring() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState("")

  useEffect(() => {
    fetchRisk()
    const channel = supabase
      .channel("risk-monitoring")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "transactions" },
        (payload) => {
          const tx = payload.new
          const amount = Number(tx?.amount || 0)

          // rule: flagged OR high amount
          if (tx?.status === "flagged" || amount >= HIGH_AMOUNT) {
            setRows((prev) => [tx, ...prev].slice(0, 200))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchRisk() {
    setLoading(true)

    // initial load: flagged or high amount
    const { data, error } = await supabase
      .from("transactions")
      .select("id, user_id, type, amount, status, created_at, reference")
      .or(`status.eq.flagged,amount.gte.${HIGH_AMOUNT}`)
      .order("created_at", { ascending: false })
      .limit(200)

    if (error) {
      console.error("Risk fetch error:", error.message)
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
        String(r.type || "").toLowerCase().includes(term) ||
        String(r.status || "").toLowerCase().includes(term)
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
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status || "flagged"} /> },
    {
      key: "created_at",
      header: "Date",
      render: (r) => (r.created_at ? new Date(r.created_at).toLocaleString() : "—"),
    },
    { key: "reference", header: "Reference" },
  ]

  const alertCount = filtered.length

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Risk Monitoring</h2>
            <p className="text-sm text-gray-500 mt-1">
              Live alerts for flagged or high-value transactions (≥ ₦{HIGH_AMOUNT.toLocaleString()}).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Tx ID / reference / user…"
              className="border rounded-xl px-4 py-2 text-sm w-full sm:w-80"
            />
            <button
              onClick={fetchRisk}
              className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-black transition"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {alertCount > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4">
          ⚠️ {alertCount} risk alerts detected.
        </div>
      )}

      <DataTable
        columns={columns}
        rows={filtered}
        loading={loading}
        emptyText="No risky transactions found."
      />
    </div>
  )
}