"use client"

import { useState, useEffect } from "react"
import LoginScreen from "@/components/login-screen"
import Dashboard from "@/components/dashboard"

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    try {
      const token = localStorage.getItem("access_token")
      const userData = localStorage.getItem("user_data")

      if (token && userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error("Error loading user data:", error)
      // Clear invalid data
      localStorage.removeItem("access_token")
      localStorage.removeItem("user_data")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleLogin = (userData: any, token: string) => {
    try {
      localStorage.setItem("access_token", token)
      localStorage.setItem("user_data", JSON.stringify(userData))
      setUser(userData)
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Error saving user data:", error)
    }
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem("access_token")
      localStorage.removeItem("user_data")
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CardioCare...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return <Dashboard user={user} onLogout={handleLogout} />
}
