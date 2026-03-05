import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/services/supabase"

export default function Transactions() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const fetchTx = async () => {
    setLoading(true);

    const base = supabase
      .from("transactions")
      .select("id, user_id, amount, created_at, type, status")
      .order("created_at", { ascending: false })
      .limit(200);

    const { data } = status === "all" ? await base : await base.eq("status", status);

    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTx();
  }, [status]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;

    return rows.filter((r) => {
      const s = `${r.id} ${r.user_id} ${r.type} ${r.status}`.toLowerCase();
      return s.includes(needle);
    });
  }, [rows, q]);

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h2 className="text-xl font-semibold">Transactions</h2>

        <div className="flex gap-2 flex-wrap">
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">ALL</option>
            <option value="pending">PENDING</option>
            <option value="successful">SUCCESSFUL</option>
            <option value="failed">FAILED</option>
          </select>

          <input
            className="border rounded-md px-3 py-2 text-sm w-72 bg-white"
            placeholder="Search id/user/type/status..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <button
            type="button"
            onClick={fetchTx}
            className="px-4 py-2 rounded-md bg-gray-900 text-white text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500">No transactions found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left">
                <th className="p-3">Date</th>
                <th className="p-3">ID</th>
                <th className="p-3">User</th>
                <th className="p-3">Type</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td className="p-3 text-gray-600">
                    {new Date(t.created_at).toLocaleString()}
                  </td>
                  <td className="p-3 font-mono text-xs">{t.id}</td>
                  <td className="p-3 font-mono text-xs">{t.user_id}</td>
                  <td className="p-3">{t.type}</td>
                  <td className="p-3">{t.amount}</td>
                  <td className="p-3">{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}