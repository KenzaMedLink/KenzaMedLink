import { useState } from "react";
import { supabase } from "@/services/supabase";

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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(false); // UI only
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      // ✅ optional safety: ensure we actually have a user
      if (!data?.user) {
        setError("Login failed. Please try again.");
        return;
      }

      window.location.replace("/admin");
    } catch (e) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setInfo("");

    if (!email) {
      setError("Please enter your email first.");
      return;
    }

    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setInfo("Reset link sent. Check your email.");
    } catch (e) {
      setError("Could not send reset link. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
            <span className="text-white text-base font-bold">H</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Admin Portal Login</p>
        </div>

        {/* Warning */}
        <SecurityWarning />

        {/* Alerts */}
        {(error || info) && (
          <div
            className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {error || info}
          </div>
        )}

        {/* Form */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Staff ID / Email</label>
            <input
              type="email"
              placeholder="owner@kenzamedlink.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Remember Me
            </label>

            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-blue-600 hover:underline"
              disabled={loading}
            >
              Forgot Password?
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-white font-medium text-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Please wait..." : "Login"}
          </button>

          <p className="text-center text-xs text-gray-400 mt-5">
            © {new Date().getFullYear()} KenzaMedLink
          </p>
        </div>
      </div>
    </div>
  );
}