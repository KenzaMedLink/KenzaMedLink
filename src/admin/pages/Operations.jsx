export default function Operations() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800">Operations</h2>
        <p className="text-sm text-gray-500 mt-1">
          Queue management, approvals oversight, system operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Pending Approvals", value: 0 },
          { label: "Pending Verification", value: 0 },
          { label: "Open Support Tickets", value: 0 },
          { label: "Complaints", value: 0 },
        ].map((x) => (
          <div key={x.label} className="bg-white rounded-2xl border shadow-sm p-6">
            <p className="text-sm text-gray-500">{x.label}</p>
            <p className="text-3xl font-bold mt-2">{x.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h3 className="font-semibold text-gray-800">Live Activity</h3>
        <p className="text-sm text-gray-500 mt-2">
          Add activity feed (approvals, disputes, refunds, suspensions).
        </p>
      </div>
    </div>
  )
}