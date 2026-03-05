export default function KPIcard({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
      <h4 className="text-gray-500 text-sm">{title}</h4>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}