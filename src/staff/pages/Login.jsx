import { useState } from "react";
import { supabase } from "@/services/supabase";
import { useNavigate } from "react-router-dom";

function SecurityWarning() {
  return (
    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-sm">
          !
        </div>

        <p className="text-xs leading-5 text-red-700">
          Unauthorized access or use of information on this application is
          prohibited. Violations may attract legal penalties. All activities are
          monitored and recorded to ensure patient confidentiality and privacy.
        </p>
      </div>
    </div>
  );
}

export default function StaffLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

    if (signInError) {
      setError("Invalid credentials");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (!profile || !["staff", "manager", "owner"].includes(profile.role)) {
      setError("Unauthorized account.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    navigate("/staff", { replace: true });
    setLoading(false);
  };

  return (
    <div className="h-[100dvh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      {/* ✅ match manager sizing: p-6, rounded-2xl */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-base font-bold">
            H
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">Welcome Back</h2>
          <p className="text-gray-500 text-sm mt-1">Staff Portal Login</p>
        </div>

        {/* Warning */}
        <SecurityWarning />

        {/* Error */}
        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* ✅ more spacing like manager */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Staff ID / Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              placeholder="Enter your password"
            />
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                className="rounded border-gray-300"
              />
              Remember Me
            </label>

            <button
              type="button"
              onClick={() => navigate("/reset-password")}
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* ✅ taller button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 mt-5">
          © 2026 KenzaMedLink
        </div>
      </div>
    </div>
  );
}