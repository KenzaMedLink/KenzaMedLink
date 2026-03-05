export default function Finance() {
  const cards = [
    { label: "Today's Revenue", value: "₦0" },
    { label: "Monthly Revenue", value: "₦0" },
    { label: "Refund Requests", value: "0" },
    { label: "Commission Due", value: "₦0" },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800">Finance</h2>
        <p className="text-sm text-gray-500 mt-1">
          Revenue analytics, refunds, commission adjustments, wallet tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border shadow-sm p-6">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-2xl font-bold mt-2 text-gray-900">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h3 className="font-semibold text-gray-800">Quick Actions</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
            View Transactions
          </button>
          <button className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-black transition">
            Refund Queue
          </button>
          <button className="px-4 py-2 rounded-xl bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200 transition">
            Wallet Adjustment Tool
          </button>
          <button className="px-4 py-2 rounded-xl bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200 transition">
            Pricing Management
          </button>
        </div>
      </div>
    </div>
  )
}