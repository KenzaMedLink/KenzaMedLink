import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function RevenueChart({ data }) {
  const dummy = [
    { month: "Jan", revenue: 1200000 },
    { month: "Feb", revenue: 1800000 },
    { month: "Mar", revenue: 2200000 },
    { month: "Apr", revenue: 3000000 },
  ]

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-6">
        Revenue Growth
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dummy}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}