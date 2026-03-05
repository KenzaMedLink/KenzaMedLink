import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/services/supabase";

export default function RoleManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("staff");

  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | inactive

  const ROLE_OPTIONS = useMemo(
    () => ["developer", "admin", "staff", "acct", "manager", "nhis"],
    []
  );

  /* =====================================================
     GET CURRENT USER + ROLE
  ===================================================== */
  useEffect(() => {
    async function getCurrentUser() {
      try {
        setRoleLoading(true);

        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error || !user) {
          setRoleLoading(false);
          return;
        }

        setCurrentUserId(user.id);

        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        setCurrentUserRole(data?.role?.trim());
      } catch (err) {
        console.error(err);
      } finally {
        setRoleLoading(false);
      }
    }

    getCurrentUser();
  }, []);

  /* =====================================================
     FETCH USERS
  ===================================================== */
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);

      const { data: usersData } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: deactData } = await supabase
        .from("user_deactivation_info")
        .select("*");

      const enriched = await Promise.all(
        (usersData || []).map(async (user) => {
          const deact = (deactData || []).find((d) => d.target_user === user.id);

          if (!deact) return user;

          const { data: performer } = await supabase
            .from("profiles")
            .select("role, email")
            .eq("id", deact.performed_by)
            .single();

          let displayName = performer?.email;
          if (performer?.role === "owner") displayName = "OWNER";

          return {
            ...user,
            deactivated_by: displayName,
            deactivated_at: deact.created_at,
          };
        })
      );

      setUsers(enriched);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     CREATE USER
  ===================================================== */
  async function createRole() {
    if (!newEmail) return alert("Email required");

    const { error } = await supabase.functions.invoke("create-user", {
      body: { email: newEmail, role: newRole },
    });

    if (error) return alert(error.message);

    setNewEmail("");
    fetchUsers();
  }

  /* =====================================================
     ROLE ACTIONS
  ===================================================== */
  async function assignRole(userId, role) {
    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId);

    if (error) return alert(error.message);
    fetchUsers();
  }

  async function deactivateUser(userId) {
    if (!window.confirm("Deactivate this user?")) return;

    const { error } = await supabase.functions.invoke("deactivate-user", {
      body: { targetUserId: userId },
    });

    if (error) alert(error.message);
    else fetchUsers();
  }

  async function reactivateUser(userId) {
    if (!window.confirm("Reactivate this user?")) return;

    const { error } = await supabase
      .from("profiles")
      .update({ is_active: true, deleted_at: null })
      .eq("id", userId);

    if (error) alert(error.message);
    else fetchUsers();
  }

  /* =====================================================
     ROLE BADGE STYLES
  ===================================================== */
  function roleBadge(role) {
    const styles = {
      owner: "bg-black text-white",
      developer: "bg-purple-600 text-white",
      admin: "bg-emerald-600 text-white",
      acct: "bg-amber-500 text-white",
      staff: "bg-slate-600 text-white",
      manager: "bg-blue-600 text-white",
      nhis: "bg-teal-600 text-white",
    };

    const key = (role || "staff").toLowerCase();
    return (
      <span
        className={`inline-flex items-center px-3 py-1 text-xs rounded-full font-semibold ${
          styles[key] || "bg-slate-600 text-white"
        }`}
      >
        {(role || "staff").toUpperCase()}
      </span>
    );
  }

  /* =====================================================
     GUARDS
  ===================================================== */
  if (roleLoading) return <div className="p-20 text-lg">Checking permissions...</div>;

  if (currentUserRole !== "owner")
    return (
      <div className="p-20 text-red-600 text-lg font-semibold">
        Access Restricted — Executive Level Only
      </div>
    );

  /* =====================================================
     FILTERED USERS
  ===================================================== */
  const filteredUsers = users.filter((u) => {
    const q = query.trim().toLowerCase();
    const matchQuery =
      !q ||
      String(u.email || "").toLowerCase().includes(q) ||
      String(u.full_name || "").toLowerCase().includes(q) ||
      String(u.role || "").toLowerCase().includes(q);

    const matchStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? !!u.is_active
        : !u.is_active;

    return matchQuery && matchStatus;
  });

  /* =====================================================
     UI
  ===================================================== */
  return (
    // ✅ IMPORTANT: NO pl-72 / ml-72 here.
    // DashboardLayout already handles sidebar spacing.
    <div className="bg-slate-50 min-h-screen w-full">
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Executive Role Management</h1>
          <p className="text-slate-500 mt-1">Manage system users, permissions, and access control</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-600 shadow-sm">
            Total: <span className="font-semibold text-slate-800">{users.length}</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-600 shadow-sm">
            Active:{" "}
            <span className="font-semibold text-slate-800">
              {users.filter((u) => u.is_active).length}
            </span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-600 shadow-sm">
            Inactive:{" "}
            <span className="font-semibold text-slate-800">
              {users.filter((u) => !u.is_active).length}
            </span>
          </div>
        </div>
      </div>

      {/* CREATE USER CARD */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Create New Account</h2>
            <p className="text-sm text-slate-500 mt-1">Create a new user and assign an initial role.</p>
          </div>

          <div className="flex gap-3 flex-wrap items-center w-full lg:w-auto">
            <input
              type="email"
              placeholder="Enter email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="border border-slate-300 px-4 py-2.5 rounded-xl w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="border border-slate-300 px-4 py-2.5 rounded-xl w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r.toUpperCase()}
                </option>
              ))}
            </select>

            <button
              onClick={createRole}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition w-full sm:w-auto"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex gap-3 flex-wrap w-full">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, role..."
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 w-full md:w-[420px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All statuses</option>
            <option value="active">Active only</option>
            <option value="inactive">Inactive only</option>
          </select>

          <button
            onClick={fetchUsers}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-semibold transition w-full sm:w-auto"
          >
            Refresh
          </button>
        </div>

        <div className="text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-800">{filteredUsers.length}</span> users
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden w-full">
        {loading ? (
          <div className="p-10">Loading users...</div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wide">
                <tr>
                  <th className="p-5">User</th>
                  <th className="p-5">Role</th>
                  <th className="p-5">Status</th>
                  <th className="p-5">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-slate-200 hover:bg-slate-50 transition"
                  >
                    <td className="p-5">
                      <div className="font-semibold text-slate-800">
                        {user.full_name || user.email}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">{user.email}</div>
                      <div className="mt-2 text-[11px] text-slate-500">
                        ID: <span className="font-mono">{user.id}</span>
                      </div>
                    </td>

                    <td className="p-5">{roleBadge(user.role)}</td>

                    <td className="p-5">
                      {user.is_active ? (
                        <span className="inline-flex items-center gap-2 text-green-700 font-semibold">
                          <span className="h-2 w-2 rounded-full bg-green-500" />
                          ACTIVE
                        </span>
                      ) : (
                        <div>
                          <span className="inline-flex items-center gap-2 text-red-700 font-semibold">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            INACTIVE
                          </span>
                          {user.deactivated_by && (
                            <div className="text-xs text-slate-500 mt-2">
                              Deactivated by{" "}
                              <span className="font-semibold">{user.deactivated_by}</span>
                              <br />
                              {user.deactivated_at
                                ? new Date(user.deactivated_at).toLocaleString()
                                : ""}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="p-5">
                      {user.role !== "owner" && user.is_active ? (
                        <div className="flex flex-wrap gap-2">
                          {ROLE_OPTIONS.map((r) => (
                            <button
                              key={r}
                              onClick={() => assignRole(user.id, r)}
                              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold transition"
                              title={`Assign ${r}`}
                            >
                              {r.toUpperCase()}
                            </button>
                          ))}

                          <button
                            onClick={() => deactivateUser(user.id)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition"
                          >
                            Deactivate
                          </button>
                        </div>
                      ) : !user.is_active && user.role !== "owner" ? (
                        <button
                          onClick={() => reactivateUser(user.id)}
                          className="text-xs px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                        >
                          Reactivate
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">Owner protected</span>
                      )}
                    </td>
                  </tr>
                ))}

                {!filteredUsers.length && (
                  <tr>
                    <td className="p-10 text-slate-500" colSpan={4}>
                      No users found. Adjust your search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}