import { useEffect } from "react";
import { supabase } from "@/services/supabase";

// ✅ module-level singleton guard
const KEY = "__km_session_keeper_started__";

export default function SessionKeeper() {
  useEffect(() => {
    // ✅ Prevent multiple keepers in StrictMode / HMR
    if (window[KEY]) return;
    window[KEY] = true;

    const wake = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        // ✅ only read session; no refreshSession()
        await supabase.auth.getSession();
      } catch (e) {
        // keep it quiet; this is non-critical
        console.warn("SessionKeeper wake warning:", e);
      }
    };

    document.addEventListener("visibilitychange", wake);

    // initial wake
    wake();

    return () => {
      document.removeEventListener("visibilitychange", wake);

      // ❗IMPORTANT: Do NOT reset KEY in dev.
      // React StrictMode mounts/unmounts effects twice; resetting causes duplicates.
      // window[KEY] = false;
    };
  }, []);

  return null;
}