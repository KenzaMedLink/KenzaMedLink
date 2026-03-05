export default function SystemHealth() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800">System Health</h2>
        <p className="text-sm text-gray-500 mt-1">
          Monitor uptime, background jobs, API integrations, queues.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <p className="text-sm text-gray-500">API Status</p>
          <p className="text-2xl font-bold mt-2 text-green-600">Operational</p>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <p className="text-sm text-gray-500">Queue Backlog</p>
          <p className="text-2xl font-bold mt-2">0</p>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <p className="text-sm text-gray-500">Errors (24h)</p>
          <p className="text-2xl font-bold mt-2">0</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h3 className="font-semibold text-gray-800">Health Logs</h3>
        <p className="text-sm text-gray-500 mt-2">
          Add logs table here (service, message, severity, timestamp).
        </p>
      </div>
    </div>
  )
}