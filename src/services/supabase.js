import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const globalKey = "__KenzaMedLinkSupabase__";

export const supabase =
  window[globalKey] ||
  (window[globalKey] = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,      // ✅ let library handle it
      detectSessionInUrl: true,
      storageKey: "km-auth",
    },
  }));

// optional debugging
if (import.meta.env.DEV) window.supabase = supabase;