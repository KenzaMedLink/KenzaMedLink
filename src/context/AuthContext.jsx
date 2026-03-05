import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/services/supabase";

const AuthContext = createContext(null);

// ✅ Add your portal profile routes here
const PROFILE_ROUTE_BY_ROLE = {
  owner: "/admin/profile",
  developer: "/admin/profile",
  admin: "/admin/profile",
  staff: "/staff/profile",
  acct: "/staff/profile",
  manager: "/manager/profile",
  nhis: "/staff/profile",
  doctor: "/doctor/profile",
  lab: "/lab/profile",
  pharmacy: "/pharmacy/profile",
  patient: "/patient/profile",
};

// ✅ helper: treat "profile not completed" as:
// - missing full_name OR phone OR
// - must_change_password true OR
// - profile_completed false (if your table has it)
function needsOnboarding(p) {
  if (!p) return false;
  const fullNameMissing = !String(p.full_name || "").trim();
  const phoneMissing = !String(p.phone || "").trim();

  // These columns must exist in profiles for them to work.
  // If they don't exist yet, they will be undefined (falsey) and won't break.
  const mustChangePassword = !!p.must_change_password;
  const profileCompletedFlag =
    typeof p.profile_completed === "boolean" ? !p.profile_completed : false;

  return fullNameMissing || phoneMissing || mustChangePassword || profileCompletedFlag;
}

async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return { profile: null, role: null };
  return { profile: data, role: data?.role ?? null };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);

  // ✅ only true on first app load / direct login action
  const [initializing, setInitializing] = useState(true);

  const setAll = (u, p, r) => {
    setUser(u);
    setProfile(p);
    setRole(r);
  };

  // ✅ Central enforcement: if user must onboard, hard-redirect to profile page
  const enforceOnboarding = (p) => {
    if (!p) return;
    if (!needsOnboarding(p)) return;

    const r = String(p.role || "").toLowerCase();
    const dest = PROFILE_ROUTE_BY_ROLE[r] || "/admin/profile";

    // avoid infinite loop if already on profile page
    const current = window.location.pathname;
    if (!current.startsWith(dest)) {
      window.location.replace(dest);
    }
  };

  useEffect(() => {
    let mounted = true;
    const safe = (fn) => mounted && fn();

    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const u = data?.session?.user ?? null;

        if (!u) {
          safe(() => setAll(null, null, null));
          return;
        }

        const { profile: p, role: r } = await fetchProfile(u.id);
        safe(() => setAll(u, p, r));

        // ✅ enforce onboarding after profile loads
        enforceOnboarding(p);
      } catch (e) {
        console.error("Auth init error:", e);
        safe(() => setAll(null, null, null));
      } finally {
        safe(() => setInitializing(false));
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // ✅ ignore silent refresh
      if (event === "TOKEN_REFRESHED") return;

      const u = session?.user ?? null;

      if (!u) {
        setAll(null, null, null);
        return;
      }

      const { profile: p, role: r } = await fetchProfile(u.id);
      setAll(u, p, r);

      // ✅ enforce onboarding after login / auth changes
      enforceOnboarding(p);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const value = useMemo(() => {
    const isOwner = role === "owner";
    const isManager = role === "manager" || role === "owner";
    const isStaff = ["staff", "manager", "owner"].includes(role);
    const isAdmin = role === "owner"; // adjust if needed

    return {
      user,
      profile,
      role,
      initializing,

      isOwner,
      isAdmin,
      isManager,
      isStaff,

      // ✅ expose this so profile page can refresh state after updates
      refreshProfile: async () => {
        const { data } = await supabase.auth.getUser();
        const u = data?.user ?? null;
        if (!u) {
          setAll(null, null, null);
          return { error: "Not logged in" };
        }

        const { profile: p, role: r } = await fetchProfile(u.id);
        setAll(u, p, r);

        // enforce again after refresh
        enforceOnboarding(p);

        return { success: true };
      },

      login: async (email, password) => {
        setInitializing(true);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setInitializing(false);
          return { error: error.message };
        }

        const u = data?.session?.user ?? data?.user ?? null;

        if (!u) {
          setInitializing(false);
          return { error: "Login failed: no user returned" };
        }

        const { profile: p, role: r } = await fetchProfile(u.id);
        setAll(u, p, r);

        // ✅ enforce onboarding immediately after login
        enforceOnboarding(p);

        setInitializing(false);
        return { success: true };
      },

      logout: async (redirectTo = "/login") => {
        // ✅ update UI immediately
        setAll(null, null, null);

        try {
          await supabase.auth.signOut();
        } catch (e) {
          console.error("Logout error:", e);
        } finally {
          // ✅ hard redirect prevents protected-route lingering
          window.location.replace(redirectTo);
        }
      },
    };
  }, [user, profile, role, initializing]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}