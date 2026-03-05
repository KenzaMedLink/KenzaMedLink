export default function KPICard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-200">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">
            {value}
          </h2>
        </div>
        <div className="text-3xl">
          {icon}
        </div>
      </div>
    </div>
  )
}