import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

interface Session {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  expires?: string
}

interface SessionContextValue {
  session: Session | null
  loading: boolean
  signIn: (provider?: string) => void
  signOut: () => Promise<void>
}

const SessionContext = createContext<SessionContextValue>({
  session: null,
  loading: true,
  signIn: () => {},
  signOut: async () => {},
})

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        setSession(data?.user ? data : null)
        setLoading(false)
      })
      .catch(() => {
        setSession(null)
        setLoading(false)
      })
  }, [])

  const signIn = useCallback((provider = "github") => {
    window.location.href = `/api/auth/signin/${provider}`
  }, [])

  const signOut = useCallback(async () => {
    const res = await fetch("/api/auth/csrf")
    const data = await res.json()
    const csrfToken = data?.csrfToken

    await fetch("/api/auth/signout", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ csrfToken: csrfToken ?? "" }),
    })

    setSession(null)
    window.location.href = "/"
  }, [])

  const value = useMemo(
    () => ({ session, loading, signIn, signOut }),
    [session, loading, signIn, signOut]
  )

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext)
