import StaffSidebar from "../components/StaffSidebar"
import StaffNavbar from "../components/StaffNavbar"
import { Outlet } from "react-router-dom"

export default function StaffLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <StaffSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <StaffNavbar />
        <main className="flex-1 px-10 py-8 bg-gray-50 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}