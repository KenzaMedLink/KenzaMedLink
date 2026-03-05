import { useEffect, useState } from "react"
import { supabase } from "@/services/supabase"

export default function Dashboard() {
  const [stats, setStats] = useState({
    approvals: 0,
    disputes: 0,
    complaints: 0,
    tickets: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          approvalsRes,
          disputesRes,
          complaintsRes,
          ticketsRes,
        ] = await Promise.all([
          supabase
            .from("appointments")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending"),

          supabase
            .from("disputes")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending"),

          supabase
            .from("complaints")
            .select("*", { count: "exact", head: true }),

          supabase
            .from("support_tickets")
            .select("*", { count: "exact", head: true }),
        ])

        setStats({
          approvals: approvalsRes.count || 0,
          disputes: disputesRes.count || 0,
          complaints: complaintsRes.count || 0,
          tickets: ticketsRes.count || 0,
        })
      } catch (err) {
        console.error("Dashboard stats error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // ✅ REALTIME SUBSCRIPTION (separate from Promise.all)
    const channel = supabase
      .channel("dashboard-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public" },
        () => fetchStats()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (loading) return <div>Loading overview...</div>

  return (
    <div className="grid grid-cols-4 gap-6">
      <StatCard title="Pending Approvals" value={stats.approvals} />
      <StatCard title="Pending Disputes" value={stats.disputes} />
      <StatCard title="Complaints" value={stats.complaints} />
      <StatCard title="Support Tickets" value={stats.tickets} />
    </div>
  )
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white shadow rounded-xl p-6 text-gray-900">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  )
}