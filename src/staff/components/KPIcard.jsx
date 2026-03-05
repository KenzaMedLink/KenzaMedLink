function StatCard({ title, value }) {
  return (
    <div className="
      bg-white
      rounded-2xl
      shadow-sm
      border border-gray-100
      p-6
      transition-all
      hover:shadow-lg
      hover:-translate-y-1
    ">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-4xl font-semibold mt-2 tracking-tight">
        {value}
      </h2>
    </div>
  )
}