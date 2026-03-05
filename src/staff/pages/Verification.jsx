import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/services/supabase";
import { useAuth } from "@/context/AuthContext";

const APPROVAL_STATUSES = ["pending", "approved", "rejected"];
const VERIF_STATUSES = ["pending", "reviewed", "approved", "rejected"];

function Pill({ value }) {
  const cls =
    value === "pending"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : value === "reviewed"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : value === "approved"
      ? "bg-green-50 text-green-700 border-green-200"
      : value === "rejected"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${cls}`}>
      {(value || "unknown").toUpperCase()}
    </span>
  );
}

export default function ApprovalsAndVerifications() {
  const { user, isStaff, initializing } = useAuth();

  const [tab, setTab] = useState("approvals"); // approvals | verifications
  const [status, setStatus] = useState("pending");
  const [q, setQ] = useState("");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);
  const [error, setError] = useState("");

  // inline notes/reason per row
  const [noteDraft, setNoteDraft] = useState({}); // { [id]: string }

  const statusOptions = tab === "approvals" ? APPROVAL_STATUSES : VERIF_STATUSES;

  useEffect(() => {
    // reset status when switching tab
    setStatus("pending");
    setRows([]);
    setError("");
    setQ("");
    setNoteDraft({});
  }, [tab]);

  const fetchRows = async () => {
    setLoading(true);
    setError("");

    try {
      if (tab === "approvals") {
        const { data, error } = await supabase
          .from("approvals")
          .select(
            "id, user_id, id_type, id_number, approved_by, created_at, status, reason"
          )
          .eq("status", status)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setRows(data || []);
        return;
      }

      // verifications
      const { data, error } = await supabase
        .from("verifications")
        .select(
          "id, user_id, entity_type, license_number, license_expiry, document_url, created_at, status, staff_recommendation, staff_notes"
        )
        .eq("status", status)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRows(data || []);
    } catch (e) {
      // If Supabase aborts due to auth lock, ignore it (prevents fake "timeout" UI)
      if (e?.name === "AbortError") return;

      setError(e?.message || "Failed to fetch records");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initializing) return;
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, status, initializing]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;

    return rows.filter((r) => {
      const userId = (r.user_id || "").toLowerCase();
      const a =
        tab === "approvals"
          ? `${r.id_type || ""} ${r.id_number || ""} ${r.reason || ""}`.toLowerCase()
          : `${r.entity_type || ""} ${r.license_number || ""} ${r.staff_notes || ""}`.toLowerCase();
      return userId.includes(needle) || a.includes(needle);
    });
  }, [rows, q, tab]);

  // --- Actions: APPROVALS (patients) ---
  const approvePatient = async (id) => {
    if (!isStaff || !user) return;

    setActingId(id);
    setError("");

    const reason = (noteDraft[id] || "").trim();

    const { error } = await supabase
      .from("approvals")
      .update({
        status: "approved",
        approved_by: user.id,
        reason: reason || null,
      })
      .eq("id", id);

    if (error) setError(error.message);

    setActingId(null);
    fetchRows();
  };

  const rejectPatient = async (id) => {
    if (!isStaff || !user) return;

    setActingId(id);
    setError("");

    const reason = (noteDraft[id] || "").trim();
    if (!reason) {
      setError("Please enter a reason before rejecting.");
      setActingId(null);
      return;
    }

    const { error } = await supabase
      .from("approvals")
      .update({
        status: "rejected",
        approved_by: user.id,
        reason,
      })
      .eq("id", id);

    if (error) setError(error.message);

    setActingId(null);
    fetchRows();
  };

  // --- Actions: VERIFICATIONS (providers) ---
  const recommendProvider = async (id, decision) => {
    if (!isStaff || !user) return;

    setActingId(id);
    setError("");

    const notes = (noteDraft[id] || "").trim();

    const { error } = await supabase
      .from("verifications")
      .update({
        status: "reviewed",
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        staff_recommendation: decision, // approve | reject
        staff_notes: notes || null,
      })
      .eq("id", id);

    if (error) setError(error.message);

    setActingId(null);
    fetchRows();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {tab === "approvals" ? "Patient Approvals" : "Provider Verifications"}
          </h1>
          <p className="text-sm text-gray-500">
            {tab === "approvals"
              ? "Approve patient identity (ID type + number)."
              : "Review provider licenses (doctors, labs, pharmacies) and recommend to GM."}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setTab("approvals")}
            className={`px-3 py-2 rounded-md text-sm border ${
              tab === "approvals"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Approvals
          </button>

          <button
            type="button"
            onClick={() => setTab("verifications")}
            className={`px-3 py-2 rounded-md text-sm border ${
              tab === "verifications"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Verifications
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
            placeholder="Search user_id / id / license / notes..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <button
            type="button"
            onClick={fetchRows}
            className="px-4 py-2 rounded-md bg-gray-900 text-white text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {!isStaff && !initializing && (
        <div className="p-3 rounded-md bg-amber-50 text-amber-700 text-sm border border-amber-200">
          You are not authorized to view this page.
        </div>
      )}

      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* List */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-4 border-b font-medium">
          {tab === "approvals" ? "Approvals" : "Verifications"} ({filtered.length})
        </div>

        {loading ? (
          <div className="p-6 text-gray-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-gray-500">No records found.</div>
        ) : (
          <div className="divide-y">
            {filtered.map((r) => (
              <div key={r.id} className="p-4 flex flex-col gap-3 md:flex-row md:justify-between">
                {/* Left */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">
                      User: <span className="font-mono">{r.user_id}</span>
                    </div>
                    <Pill value={r.status} />
                  </div>

                  <div className="text-xs text-gray-500">
                    Created: {new Date(r.created_at).toLocaleString()}
                  </div>

                  {tab === "approvals" ? (
                    <div className="text-sm text-gray-700">
                      <div>
                        ID Type: <b>{r.id_type || "-"}</b>
                      </div>
                      <div>
                        ID Number: <b className="font-mono">{r.id_number || "-"}</b>
                      </div>
                      {r.reason && (
                        <div className="mt-1 text-gray-600">
                          Reason: <span>{r.reason}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-700 space-y-1">
                      <div>
                        Entity: <b>{r.entity_type || "-"}</b>
                      </div>
                      <div>
                        License #: <b className="font-mono">{r.license_number || "-"}</b>
                      </div>
                      <div>
                        Expiry:{" "}
                        <b>
                          {r.license_expiry
                            ? new Date(r.license_expiry).toLocaleDateString()
                            : "-"}
                        </b>
                      </div>
                      <div>
                        Document:{" "}
                        {r.document_url ? (
                          <a
                            href={r.document_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-gray-400">No document</span>
                        )}
                      </div>
                      {r.staff_recommendation && (
                        <div className="text-gray-600">
                          Recommended: <b>{r.staff_recommendation.toUpperCase()}</b>
                        </div>
                      )}
                      {r.staff_notes && (
                        <div className="text-gray-600">
                          Staff Notes: <span>{r.staff_notes}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right */}
                <div className="min-w-[320px] space-y-2">
                  <textarea
                    className="w-full border rounded-md p-2 text-sm bg-white"
                    rows={2}
                    placeholder={
                      tab === "approvals"
                        ? "Reason (required for reject, optional for approve)"
                        : "Staff notes (optional)"
                    }
                    value={noteDraft[r.id] || ""}
                    onChange={(e) =>
                      setNoteDraft((prev) => ({ ...prev, [r.id]: e.target.value }))
                    }
                  />

                  {tab === "approvals" ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={!isStaff || actingId === r.id || r.status !== "pending"}
                        onClick={() => approvePatient(r.id)}
                        className="px-3 py-2 rounded-md bg-green-600 text-white text-sm disabled:opacity-60"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={!isStaff || actingId === r.id || r.status !== "pending"}
                        onClick={() => rejectPatient(r.id)}
                        className="px-3 py-2 rounded-md bg-red-600 text-white text-sm disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={!isStaff || actingId === r.id || r.status !== "pending"}
                        onClick={() => recommendProvider(r.id, "approve")}
                        className="px-3 py-2 rounded-md bg-green-600 text-white text-sm disabled:opacity-60"
                      >
                        Recommend Approve
                      </button>
                      <button
                        type="button"
                        disabled={!isStaff || actingId === r.id || r.status !== "pending"}
                        onClick={() => recommendProvider(r.id, "reject")}
                        className="px-3 py-2 rounded-md bg-red-600 text-white text-sm disabled:opacity-60"
                      >
                        Recommend Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}