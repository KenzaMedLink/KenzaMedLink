import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/services/supabase"
import DataTable from "../components/DataTable"
import StatusBadge from "../components/StatusBadge"

export default function Users() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  const [q, setQ] = useState("")
  const [role, setRole] = useState("all")

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role])

  async function fetchUsers() {
    setLoading(true)

    let query = supabase
      .from("profiles")
      .select("id, email, full_name, role, status, created_at")
      .order("created_at", { ascending: false })
      .limit(200)

    if (role !== "all") query = query.eq("role", role)

    const { data, error } = await query
    if (error) {
      console.error("Users fetch error:", error.message)
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
        (r.full_name || "").toLowerCase().includes(term) ||
        (r.email || "").toLowerCase().includes(term) ||
        (r.role || "").toLowerCase().includes(term)
      )
    })
  }, [rows, q])

  const columns = [
    {
      key: "user",
      header: "User",
      render: (r) => (
        <div>
          <div className="font-semibold text-gray-900">{r.full_name || "—"}</div>
          <div className="text-xs text-gray-500">{r.email}</div>
        </div>
      ),
    },
    { key: "role", header: "Role" },
    {
      key: "status",
      header: "Status",
      render: (r) => <StatusBadge status={r.status || "active"} />,
    },
    {
      key: "created_at",
      header: "Created",
      render: (r) =>
        r.created_at ? new Date(r.created_at).toLocaleString() : "—",
    },
  ]

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Users</h2>
            <p className="text-sm text-gray-500 mt-1">
              Pulled from <span className="font-medium">profiles</span>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border rounded-xl px-3 py-2 text-sm bg-white"
            >
              <option value="all">All roles</option>
              <option value="patient">patient</option>
              <option value="doctor">doctor</option>
              <option value="lab">lab</option>
              <option value="pharmacy">pharmacy</option>
              <option value="staff">staff</option>
              <option value="manager">manager</option>
              <option value="owner">owner</option>
            </select>

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name/email/role…"
              className="border rounded-xl px-4 py-2 text-sm w-full sm:w-80"
            />
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={loading}
        emptyText="No users found in profiles."
      />
    </div>
  )
}