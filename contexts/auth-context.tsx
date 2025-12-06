"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Authentication Context

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { User, Session } from "@/lib/githubdb-sdk"

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const SESSION_KEY = "quran_app_session"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedToken = localStorage.getItem(SESSION_KEY)
        if (storedToken) {
          const response = await fetch("/api/auth/session", {
            headers: { Authorization: `Bearer ${storedToken}` },
          })

          if (response.ok) {
            const data = await response.json()
            setUser(data.user)
            setSession(data.session)
          } else {
            localStorage.removeItem(SESSION_KEY)
          }
        }
      } catch (error) {
        console.error("Session check failed:", error)
        localStorage.removeItem(SESSION_KEY)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || "Login failed" }
      }

      localStorage.setItem(SESSION_KEY, data.token)
      setUser(data.user)
      setSession({
        token: data.token,
        user: data.user,
        created: Date.now(),
        expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
      })

      return { success: true }
    } catch (error) {
      return { success: false, error: "Network error" }
    }
  }, [])

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        })

        const data = await response.json()

        if (!response.ok) {
          return { success: false, error: data.error || "Registration failed" }
        }

        // Auto-login after registration
        return login(email, password)
      } catch (error) {
        return { success: false, error: "Network error" }
      }
    },
    [login],
  )

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem(SESSION_KEY)
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem(SESSION_KEY)
      setUser(null)
      setSession(null)
    }
  }, [])

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    try {
      const token = localStorage.getItem(SESSION_KEY)
      if (!token) {
        return { success: false, error: "Not authenticated" }
      }

      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || "Update failed" }
      }

      setUser(data.user)
      return { success: true }
    } catch (error) {
      return { success: false, error: "Network error" }
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
