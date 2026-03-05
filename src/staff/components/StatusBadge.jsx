import React from "react"

export default function StatusBadge({ status }) {
  const base =
    "px-3 py-1 rounded-full text-xs font-medium"

  const statusStyles = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-600",
    pending: "bg-yellow-100 text-yellow-700",
    blocked: "bg-red-100 text-red-700",
  }

  return (
    <span
      className={`${base} ${
        statusStyles[status?.toLowerCase()] ||
        "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  )
}