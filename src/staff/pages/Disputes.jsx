import { useEffect, useState } from "react";
import { supabase } from "@/services/supabase";
import { useAuth } from "@/context/AuthContext";

export default function Disputes() {
  const { user, profile, initializing, isStaff } = useAuth();

  const [disputes, setDisputes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDisputes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("disputes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("fetchDisputes error:", error);
    setDisputes(data || []);
    setLoading(false);
  };

  const fetchNotes = async (disputeId) => {
    const { data, error } = await supabase
      .from("dispute_notes")
      .select("*")
      .eq("dispute_id", disputeId)
      .order("created_at");

    if (error) console.error("fetchNotes error:", error);
    setNotes(data || []);
  };

  useEffect(() => {
    if (initializing) return;
    if (!isStaff) return;

    fetchDisputes();
  }, [initializing, isStaff]);

  const openDispute = (dispute) => {
    setSelected(dispute);
    fetchNotes(dispute.id);
  };

  const addNote = async () => {
    if (!newNote || !selected) return;

    const addedBy = user?.id; // ✅ auth user id (same as profiles.id)
    if (!addedBy) return;

    const { error } = await supabase.from("dispute_notes").insert({
      dispute_id: selected.id,
      added_by: addedBy,
      note: newNote,
      // optionally also store name/role if your table supports it:
      // added_by_name: profile?.full_name ?? null,
      // added_by_role: profile?.role ?? null,
    });

    if (error) {
      console.error("addNote error:", error);
      return;
    }

    setNewNote("");
    fetchNotes(selected.id);
  };

  const resolveDispute = async () => {
    if (!selected) return;

    const { error } = await supabase
      .from("disputes")
      .update({
        status: "resolved",
        resolution: `Handled by ${profile?.full_name || profile?.role || "staff"}`,
      })
      .eq("id", selected.id);

    if (error) {
      console.error("resolveDispute error:", error);
      return;
    }

    fetchDisputes();
    setSelected(null);
  };

  if (initializing) return <div className="p-10">Loading...</div>;
  if (!isStaff) return <div className="p-10">Not authorized.</div>;

  return (
    <div className="flex gap-6">
      {/* Left List */}
      <div className="w-1/2 bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-4">Disputes</h2>

        {loading && <div className="text-sm text-gray-500">Loading...</div>}

        {disputes.map((d) => (
          <div
            key={d.id}
            onClick={() => openDispute(d)}
            className="border p-3 mb-2 cursor-pointer rounded hover:bg-gray-50"
          >
            <div className="font-medium">{d.type}</div>
            <div className="text-sm text-gray-500">{d.status}</div>
          </div>
        ))}

        {!loading && disputes.length === 0 && (
          <div className="text-sm text-gray-500">No disputes found.</div>
        )}
      </div>

      {/* Right Detail */}
      {selected && (
        <div className="w-1/2 bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Dispute Detail</h2>
          <div className="text-sm mb-3">{selected.description}</div>

          <div className="border-t pt-3 mt-3">
            <h3 className="font-medium mb-2">Notes</h3>
            {notes.map((n) => (
              <div key={n.id} className="text-sm border-b py-2">
                {n.note}
              </div>
            ))}
            {notes.length === 0 && (
              <div className="text-sm text-gray-500">No notes yet.</div>
            )}
          </div>

          <div className="mt-3 flex gap-2">
            <input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="border px-3 py-2 flex-1 rounded"
              placeholder="Add note..."
            />
            <button
              onClick={addNote}
              className="px-3 py-2 bg-blue-600 text-white rounded"
            >
              Add
            </button>
          </div>

          <button
            onClick={resolveDispute}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
          >
            Mark Resolved
          </button>
        </div>
      )}
    </div>
  );
}