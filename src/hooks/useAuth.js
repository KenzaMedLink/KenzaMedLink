import { useEffect, useState } from "react"
import { supabase } from "@/services/supabase"

export default function useAuth() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        setUser(data.user)

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single()

        setRole(profile?.role)
      }
      setLoading(false)
    }

    getUser()
  }, [])

  return { user, role, loading }
}