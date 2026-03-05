import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/services/supabase"

function StatusPill({ value }) {
  const map = {
    open: "bg-amber-50 text-amber-700 border-amber-200",
    in_progress: "bg-blue-50 text-blue-700 border-blue-200",
    closed: "bg-gray-50 text-gray-700 border-gray-200",
    resolved: "bg-green-50 text-green-700 border-green-200",
  };
  const cls = map[value] || "bg-gray-50 text-gray-700 border-gray-200";
  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${cls}`}>
      {(value || "unknown").toUpperCase()}
    </span>
  );
}

const withTimeout = (promise, ms = 12000) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout. Click Refresh.")), ms)
    ),
  ]);

// ✅ Only verify session exists. DO NOT refresh here.
async function ensureSessionExists() {
  const { data, error } = await withTimeout(supabase.auth.getSession(), 8000);
  if (error) throw error;
  if (!data?.session) throw new Error("Session expired. Please login again.");
}

export default function SupportCenter() {
  const [tab, setTab] = useState("support"); // support | complaints
  const [status, setStatus] = useState("open");
  const [q, setQ] = useState("");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);
  const [error, setError] = useState("");

  const tabRef = useRef(tab);
  const statusRef = useRef(status);
  useEffect(() => void (tabRef.current = tab), [tab]);
  useEffect(() => void (statusRef.current = status), [status]);

  const statusOptions =
    tab === "support" ? ["open", "in_progress", "closed"] : ["open", "resolved"];

  const fetchRows = async (override) => {
    const useTab = override?.tab ?? tabRef.current;
    const useStatus = override?.status ?? statusRef.current;

    setLoading(true);
    setError("");

    try {
      await ensureSessionExists();

      const query =
        useTab === "support"
          ? supabase
              .from("support_tickets")
              .select("id, user_id, created_at, subject, message, status")
              .eq("status", useStatus)
              .order("created_at", { ascending: false })
          : supabase
              .from("complaints")
              .select("id, user_id, created_at, subject, description, status")
              .eq("status", useStatus)
              .order("created_at", { ascending: false });

      const { data, error } = await withTimeout(query, 12000);
      if (error) throw error;

      setRows(
        (data || []).map((r) => ({
          ...r,
          body: useTab === "support" ? r.message : r.description,
        }))
      );
    } catch (e) {
      console.error("SupportCenter fetchRows error:", e);
      setRows([]);
      setError(e?.message || "Failed to load records.");
    } finally {
      setLoading(false);
    }
  };

  // reset invalid status when tab changes
  useEffect(() => {
    if (!statusOptions.includes(status)) setStatus(statusOptions[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // fetch on change
  useEffect(() => {
    fetchRows({ tab, status });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, status]);

  // refetch when you return to the tab (safe)
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") fetchRows();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((r) => {
      const subject = (r.subject || "").toLowerCase();
      const body = (r.body || "").toLowerCase();
      const userId = (r.user_id || "").toLowerCase();
      return (
        subject.includes(needle) ||
        body.includes(needle) ||
        userId.includes(needle)
      );
    });
  }, [rows, q]);

  const updateStatus = async (id, newStatus) => {
    setActingId(id);
    setError("");

    try {
      await ensureSessionExists();

      const table =
        tabRef.current === "support" ? "support_tickets" : "complaints";

      const { error } = await withTimeout(
        supabase.from(table).update({ status: newStatus }).eq("id", id),
        12000
      );
      if (error) throw error;

      await fetchRows();
    } catch (e) {
      console.error("SupportCenter updateStatus error:", e);
      setError(e?.message || "Failed to update status.");
    } finally {
      setActingId(null);
    }
  };

  const renderActions = (row) => {
    if (tab === "support") {
      return (
        <div className="flex gap-2 flex-wrap">
          {row.status === "open" && (
            <button
              disabled={actingId === row.id}
              onClick={() => updateStatus(row.id, "in_progress")}
              className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-60"
            >
              Start
            </button>
          )}
          {row.status !== "closed" && (
            <button
              disabled={actingId === row.id}
              onClick={() => updateStatus(row.id, "closed")}
              className="px-3 py-1.5 rounded bg-gray-900 hover:bg-black text-white text-sm disabled:opacity-60"
            >
              Close
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="flex gap-2 flex-wrap">
        {row.status !== "resolved" && (
          <button
            disabled={actingId === row.id}
            onClick={() => updateStatus(row.id, "resolved")}
            className="px-3 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white text-sm disabled:opacity-60"
          >
            Mark Resolved
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {tab === "support"
              ? "Support (Assistance Requests)"
              : "Complaints (Report Provider)"}
          </h1>
          <p className="text-sm text-gray-500">
            {tab === "support"
              ? "Help users with platform/account issues."
              : "Reports against doctors/labs/pharmacies or users."}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setTab("support")}
            className={`px-3 py-2 rounded-md text-sm border ${
              tab === "support"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Support
          </button>

          <button
            onClick={() => setTab("complaints")}
            className={`px-3 py-2 rounded-md text-sm border ${
              tab === "complaints"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Complaints
          </button>

          <select
            className="border rounded-md px-3 py-2 text-sm bg-white"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s.toUpperCase()}
              </option>
            ))}
          </select>

          <input
            className="border rounded-md px-3 py-2 text-sm w-72 bg-white"
            placeholder="Search subject/message/user_id..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <button
            onClick={() => fetchRows()}
            className="px-4 py-2 rounded-md bg-gray-900 text-white text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-4 border-b font-medium">
          {tab === "support" ? "Tickets" : "Complaints"} ({filtered.length})
        </div>

        {loading ? (
          <div className="p-6 text-gray-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-gray-500">No records found.</div>
        ) : (
          <div className="divide-y">
            {filtered.map((row) => (
              <div
                key={row.id}
                className="p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{row.subject || "No subject"}</div>
                    <StatusPill value={row.status} />
                  </div>

                  <div className="text-sm text-gray-700">{row.body || "—"}</div>

                  <div className="text-xs text-gray-500">
                    User: <span className="font-mono">{row.user_id}</span> ·{" "}
                    {new Date(row.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="min-w-[220px]">{renderActions(row)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}