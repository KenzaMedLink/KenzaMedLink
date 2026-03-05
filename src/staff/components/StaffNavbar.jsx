import { LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/services/supabase"

export default function StaffNavbar() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/staff/login")
  }

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-8">
      {/* Left Title */}
      <h1 className="text-lg font-semibold text-gray-700">
        Staff Dashboard
      </h1>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="
            flex items-center gap-2
            px-4 py-2
            bg-red-50 text-red-600
            hover:bg-red-100
            rounded-lg
            text-sm font-medium
            transition
          "
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  )
}