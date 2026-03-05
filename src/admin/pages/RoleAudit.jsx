import { useEffect, useState } from "react"
import { supabase } from "@/services/supabase"

export default function RoleAudit() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    fetchLogs()
  }, [])

  async function fetchLogs() {
    const { data } = await supabase
      .from("role_activity_logs")
      .select("*")
      .order("created_at", { ascending: false })

    setLogs(data)
  }

  return (
    <div className="p-10 ml-72">
      <h1 className="text-2xl font-bold mb-6">Role Activity Logs</h1>

      {logs.map((log) => (
        <div key={log.id} className="border-b py-3">
          <p>{log.action}</p>
          <p className="text-sm text-gray-500">
            {new Date(log.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  )
}