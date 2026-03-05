import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/services/supabase";

const ALLOWED_ROLES = ["owner", "developer", "admin", "staff", "acct", "manager", "nhis"];

function RolePill({ role }) {
  const key = (role || "staff").toLowerCase();

  const styles = {
    owner: "bg-black text-white",
    developer: "bg-purple-600 text-white",
    admin: "bg-emerald-600 text-white",
    staff: "bg-slate-700 text-white",
    acct: "bg-amber-500 text-white",
    manager: "bg-blue-600 text-white",
    nhis: "bg-teal-600 text-white",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        styles[key] || "bg-slate-700 text-white"
      }`}
    >
      {(role || "staff").toUpperCase()}
    </span>
  );
}

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  // Profile alerts (top)
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // Password alerts (inside password toggle)
  const [passError, setPassError] = useState("");
  const [passInfo, setPassInfo] = useState("");

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  // ✅ onboarding flags from DB
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
  });

  const [pass, setPass] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const displayName = useMemo(() => {
    const n = (form.full_name || "").trim();
    if (n) return n;
    // ✅ don’t fallback to email as “name”
    return "User";
  }, [form.full_name]);

  const initials = useMemo(() => {
    const name = (displayName || "").trim();
    if (!name) return "U";
    const parts = name.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join("") || "U";
  }, [displayName]);

  const needsProfile = useMemo(() => {
    const fullOk = String(form.full_name || "").trim().length >= 2;
    const phoneOk = String(form.phone || "").trim().length >= 7;
    return !(fullOk && phoneOk);
  }, [form.full_name, form.phone]);

  const onboardingRequired = needsProfile || mustChangePassword;

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        setInfo("");
        setPassError("");
        setPassInfo("");

        const { data, error: uErr } = await supabase.auth.getUser();
        if (uErr) throw uErr;

        const authUser = data?.user;
        if (!authUser) {
          setError("You are not logged in.");
          return;
        }

        if (!mounted) return;
        setUser(authUser);

        // ✅ include onboarding fields
        const { data: profile, error: pErr } = await supabase
          .from("profiles")
          .select("id, email, role, full_name, phone, must_change_password, profile_completed")
          .eq("id", authUser.id)
          .single();

        if (pErr) throw pErr;

        const r = (profile?.role || "").trim().toLowerCase();
        if (!ALLOWED_ROLES.includes(r)) {
          setError("Unauthorized role. Please contact admin.");
          return;
        }

        if (!mounted) return;

        setRole(r);
        setForm({
          full_name: profile?.full_name || "",
          phone: profile?.phone || "",
        });

        setMustChangePassword(!!profile?.must_change_password);
        setProfileCompleted(!!profile?.profile_completed);

        // ✅ If onboarding required, open password section automatically
        if (!!profile?.must_change_password) setShowPassword(true);

        // ✅ One-time friendly notice
        if (
          (!String(profile?.full_name || "").trim() ||
            !String(profile?.phone || "").trim() ||
            !!profile?.must_change_password) &&
          mounted
        ) {
          setInfo(
            "Complete your profile (Full Name + Phone) and change your password to continue using the system."
          );
        }
      } catch (e) {
        console.error(e);
        setError(e?.message || "Failed to load profile.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError("");
    setInfo("");

    try {
      const full_name = form.full_name.trim();
      const phone = form.phone.trim();

      if (full_name.length < 2) {
        setError("Please enter your full name.");
        return;
      }

      if (phone && !/^[+\d][\d\s-]{6,}$/i.test(phone)) {
        setError("Please enter a valid phone number.");
        return;
      }

      const completed = !!full_name && !!phone;

      // ✅ IMPORTANT: removed updated_at line (avoid schema cache error)
      const { error: upErr } = await supabase
        .from("profiles")
        .update({
          full_name,
          phone,
          profile_completed: completed,
        })
        .eq("id", user.id);

      if (upErr) throw upErr;

      setProfileCompleted(completed);
      setInfo("Profile updated successfully.");
    } catch (e2) {
      console.error(e2);
      setError(e2?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (!user) return;

    setChangingPass(true);
    setPassError("");
    setPassInfo("");

    try {
      const newPassword = pass.newPassword.trim();
      const confirmPassword = pass.confirmPassword.trim();

      if (newPassword.length < 8) {
        setPassError("Password must be at least 8 characters.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setPassError("Passwords do not match.");
        return;
      }

      const { error: pErr } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (pErr) throw pErr;

      // ✅ clear onboarding flag in profile
      const { error: flagErr } = await supabase
        .from("profiles")
        .update({ must_change_password: false })
        .eq("id", user.id);

      if (flagErr) throw flagErr;

      setMustChangePassword(false);
      setPass({ newPassword: "", confirmPassword: "" });
      setPassInfo("Password changed successfully.");
    } catch (e2) {
      console.error(e2);
      setPassError(e2?.message || "Failed to change password.");
    } finally {
      setChangingPass(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-slate-600">Loading profile...</div>;
  }

  if (error && !user) {
    return (
      <div className="p-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* ✅ ONBOARDING BANNER (only when required) */}
      {onboardingRequired && (
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm">
          <span className="font-bold">Action Required:</span>{" "}
          Please complete your profile (Full Name + Phone){" "}
          {mustChangePassword ? "and change your password" : ""} to continue.
        </div>
      )}

      {/* Alerts (profile only) */}
      {(error || info) && (
        <div
          className={`mb-5 rounded-2xl border px-4 py-3 text-sm shadow-sm ${
            error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {error || info}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left card: identity */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden lg:col-span-1">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                {initials}
              </div>

              <div className="min-w-0">
                <div className="text-slate-900 font-bold text-lg truncate">
                  {displayName}
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <RolePill role={role} />
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {profileCompleted ? "Profile Completed" : "Profile Incomplete"}
                  </span>
                  {mustChangePassword && (
                    <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 border border-red-200">
                      Must Change Password
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs text-slate-400">
                Your role is managed by the Admin and cannot be edited here.
              </div>
            </div>
          </div>
        </div>

        {/* Right: forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile form */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900">Personal Details</h2>
              <p className="text-sm text-slate-500 mt-1">
                Update your name and phone number.
              </p>
            </div>

            <div className="p-6">
              <form onSubmit={saveProfile} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      value={user?.email || ""}
                      disabled
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      name="full_name"
                      value={form.full_name}
                      onChange={onChange}
                      placeholder="e.g. Dr. Mahmud Sunusi"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={onChange}
                      placeholder="e.g. +234 801 234 5678"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-blue-600 py-3 text-white font-bold hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>

          {/* Change Password toggle */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition"
              aria-expanded={showPassword}
            >
              <div className="text-left">
                <h2 className="text-base font-bold text-slate-900">Change Password</h2>
                <p className="text-sm text-slate-500 mt-1">Minimum 8 characters.</p>
              </div>

              <span className="text-sm font-bold text-slate-700">
                {showPassword ? "Hide" : "Show"}
              </span>
            </button>

            {showPassword && (
              <div className="p-6 border-t border-slate-200">
                <form onSubmit={changePassword} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={pass.newPassword}
                        onChange={(e) =>
                          setPass((p) => ({ ...p, newPassword: e.target.value }))
                        }
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={pass.confirmPassword}
                        onChange={(e) =>
                          setPass((p) => ({ ...p, confirmPassword: e.target.value }))
                        }
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {/* Password alerts just above button */}
                  {(passError || passInfo) && (
                    <div
                      className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${
                        passError
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-green-200 bg-green-50 text-green-700"
                      }`}
                    >
                      {passError || passInfo}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={changingPass}
                    className="w-full rounded-xl bg-slate-900 py-3 text-white font-bold hover:bg-slate-800 transition disabled:opacity-60"
                  >
                    {changingPass ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}