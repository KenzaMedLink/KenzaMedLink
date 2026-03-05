import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/services/supabase";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("checking"); 
  // checking | request | set | done
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const redirectTo = useMemo(
    () => `${window.location.origin}/reset-password`,
    []
  );

  useEffect(() => {
    // Read email from query param (?email=...)
    const params = new URLSearchParams(window.location.search);
    const qEmail = params.get("email");
    if (qEmail) setEmail(qEmail);

    let mounted = true;

    const init = async () => {
      try {
        // If user clicked email recovery link, session will exist
        const { data } = await supabase.auth.getSession();
        const session = data?.session;

        if (!mounted) return;

        if (session) {
          // ✅ recovery flow: allow setting new password
          setMode("set");
          setMessage("");
          setIsError(false);
        } else {
          // ✅ no session: show "request reset link" form
          setMode("request");
          setMessage("");
          setIsError(false);
        }
      } catch (e) {
        if (!mounted) return;
        setMode("request");
        setMessage("Could not verify session. You can request a reset link.");
        setIsError(true);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const sendResetLink = async () => {
    setMessage("");
    setIsError(false);

    if (!email) {
      setMessage("Please enter your email.");
      setIsError(true);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        setMessage(error.message);
        setIsError(true);
        return;
      }

      setMessage("Reset link sent. Check your email inbox (and spam).");
      setIsError(false);
    } catch (e) {
      setMessage("Could not send reset link. Try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    setMessage("");
    setIsError(false);

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setIsError(true);
      return;
    }
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      setIsError(true);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setMessage(error.message);
        setIsError(true);
        return;
      }

      setMode("done");
      setMessage("Password updated successfully. You can now login.");
      setIsError(false);
    } catch (e) {
      setMessage("Failed to update password. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const goLogin = () => {
    // choose a default; user can switch portal from there
    window.location.replace("/staff/login");
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 px-8 py-8">
        <div className="flex justify-center">
          <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-sm">
            <span className="text-white text-xl font-bold">H</span>
          </div>
        </div>

        <h1 className="mt-4 text-center text-2xl md:text-3xl font-extrabold text-gray-900">
          Reset Password
        </h1>
        <p className="mt-1 text-center text-gray-500 text-sm">
          {mode === "set"
            ? "Create a new password for your account"
            : "We’ll send a password reset link to your email"}
        </p>

        {message && (
          <div
            className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
              isError
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Checking */}
        {mode === "checking" && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Checking reset link...
          </div>
        )}

        {/* Request reset link */}
        {mode === "request" && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="mt-2 w-full rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="email"
              />
            </div>

            <button
              onClick={sendResetLink}
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold text-base hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <button
              onClick={goLogin}
              className="w-full rounded-xl bg-gray-100 py-3 text-gray-800 font-semibold text-base hover:bg-gray-200 transition"
            >
              Back to Login
            </button>
          </div>
        )}

        {/* Set new password (recovery session exists) */}
        {mode === "set" && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") updatePassword();
                }}
                className="mt-2 w-full rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            <button
              onClick={updatePassword}
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold text-base hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        )}

        {/* Done */}
        {mode === "done" && (
          <div className="mt-6">
            <button
              onClick={goLogin}
              className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold text-base hover:bg-blue-700 transition"
            >
              Go to Login
            </button>
          </div>
        )}

        <p className="pt-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} KenzaMedLink
        </p>
      </div>
    </div>
  );
}