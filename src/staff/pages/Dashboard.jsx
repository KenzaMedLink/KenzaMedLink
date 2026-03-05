import { useEffect, useState } from "react"
import { supabase } from "@/services/supabase"

export default function Dashboard() {
  const [stats, setStats] = useState({
    verification: 0,
    disputes: 0,
    tickets: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const [verifyRes, disputeRes, ticketRes] = await Promise.all([
      supabase
        .from("verifications")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),

      supabase
        .from("disputes")
        .select("*", { count: "exact", head: true })
        .eq("status", "under_review"),

      supabase
        .from("support_tickets")
        .select("*", { count: "exact", head: true })
        .eq("status", "open"),
    ])

    setStats({
      verification: verifyRes.count || 0,
      disputes: disputeRes.count || 0,
      tickets: ticketRes.count || 0,
    })
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      <StatCard title="Verification Queue" value={stats.verification} />
      <StatCard title="Disputes Under Review" value={stats.disputes} />
      <StatCard title="Open Tickets" value={stats.tickets} />
    </div>
  )
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  )
}