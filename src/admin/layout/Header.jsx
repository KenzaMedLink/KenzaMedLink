import { useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import { Bell, Search, LogOut } from "lucide-react"
import { useAdminAuth } from "../context/AdminAuthContext"

export default function Header() {
  const location = useLocation()
  const { admin, logout } = useAdminAuth()
  const [q, setQ] = useState("")

  const pageTitle = useMemo(() => {
    const path = location.pathname.replace("/admin", "")
    if (!path || path === "/") return "Dashboard"
    const key = path.split("/")[1] || "Dashboard"
    return key
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  }, [location.pathname])

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-800">{pageTitle}</h1>
        <p className="text-xs text-gray-500">Owner Control Panel</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border rounded-xl px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search users, transactions..."
            className="bg-transparent outline-none text-sm w-64"
          />
        </div>

        {/* Notifications */}
        <button className="w-10 h-10 rounded-xl border bg-white hover:bg-gray-50 flex items-center justify-center">
          <Bell size={18} className="text-gray-700" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-2">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
            {(admin?.email?.[0] || "O").toUpperCase()}
          </div>

          <button
            onClick={logout}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition text-sm font-medium"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}