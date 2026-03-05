import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/services/supabase"
import DataTable from "../components/DataTable"
import StatusBadge from "../components/StatusBadge"

export default function Verification() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  const [q, setQ] = useState("")
  const [entity, setEntity] = useState("all")
  const [status, setStatus] = useState("pending")

  useEffect(() => {
    fetchQueue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity, status])

  async function fetchQueue() {
    setLoading(true)

    let query = supabase
      .from("verifications")
      .select("id, user_id, entity_type, status, license_expiry, created_at, documents_count")
      .order("created_at", { ascending: false })
      .limit(200)

    if (entity !== "all") query = query.eq("entity_type", entity)
    if (status !== "all") query = query.eq("status", status)

    const { data, error } = await query
    if (error) {
      console.error("Verification fetch error:", error.message)
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
        String(r.user_id || "").toLowerCase().includes(term) ||
        String(r.entity_type || "").toLowerCase().includes(term) ||
        String(r.status || "").toLowerCase().includes(term)
      )
    })
  }, [rows, q])

  const columns = [
    { key: "id", header: "ID" },
    { key: "entity_type", header: "Type" },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "license_expiry",
      header: "License Expiry",
      render: (r) =>
        r.license_expiry ? new Date(r.license_expiry).toLocaleDateString() : "—",
    },
    {
      key: "documents_count",
      header: "Docs",
      render: (r) => (r.documents_count ?? "—"),
    },
    {
      key: "created_at",
      header: "Submitted",
      render: (r) =>
        r.created_at ? new Date(r.created_at).toLocaleString() : "—",
    },
  ]

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Verification Queue</h2>
            <p className="text-sm text-gray-500 mt-1">
              Pulled from <span className="font-medium">verifications</span>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <select
              value={entity}
              onChange={(e) => setEntity(e.target.value)}
              className="border rounded-xl px-3 py-2 text-sm bg-white"
            >
              <option value="all">All entities</option>
              <option value="doctor">doctor</option>
              <option value="lab">lab</option>
              <option value="pharmacy">pharmacy</option>
              <option value="admin">admin</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded-xl px-3 py-2 text-sm bg-white"
            >
              <option value="all">All status</option>
              <option value="pending">pending</option>
              <option value="under_review">under_review</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
            </select>

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search id/user/type/status…"
              className="border rounded-xl px-4 py-2 text-sm w-full sm:w-80"
            />
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={loading}
        emptyText="No verifications found."
      />
    </div>
  )
}