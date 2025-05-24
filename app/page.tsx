"use client"

import { useState, useEffect } from "react"
import LoginScreen from "@/components/login-screen"
import Dashboard from "@/components/dashboard"
import BackendStatus from "@/components/backend-status"

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem("access_token")
    const userData = localStorage.getItem("user_data")

    if (token && userData) {
      setUser(JSON.parse(userData))
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (userData: any, token: string) => {
    localStorage.setItem("access_token", token)
    localStorage.setItem("user_data", JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("user_data")
    setUser(null)
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <BackendStatus />
          <LoginScreen onLogin={handleLogin} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <BackendStatus />
      </div>
      <Dashboard user={user} onLogout={handleLogout} />
    </div>
  )
}
