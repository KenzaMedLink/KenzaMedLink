export default function StatusBadge({ status }) {
  const s = (status || "").toLowerCase()

  const map = {
    active: "bg-green-50 text-green-700 border-green-200",
    approved: "bg-green-50 text-green-700 border-green-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    under_review: "bg-yellow-50 text-yellow-700 border-yellow-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    suspended: "bg-red-50 text-red-700 border-red-200",
    blocked: "bg-red-50 text-red-700 border-red-200",
    flagged: "bg-orange-50 text-orange-700 border-orange-200",
  }

  const cls = map[s] || "bg-gray-50 text-gray-700 border-gray-200"

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${cls}`}>
      {status || "unknown"}
    </span>
  )
}