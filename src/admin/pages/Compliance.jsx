export default function Compliance() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800">Compliance</h2>
        <p className="text-sm text-gray-500 mt-1">
          License expiry monitoring, audit logs, dispute oversight.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <p className="text-sm text-gray-500">Licenses Expiring</p>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <p className="text-sm text-gray-500">Open Disputes</p>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <p className="text-sm text-gray-500">Audit Alerts</p>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h3 className="font-semibold text-gray-800">Compliance Feed</h3>
        <div className="mt-4 text-sm text-gray-500">
          Add your compliance table + filters here.
        </div>
      </div>
    </div>
  )
}