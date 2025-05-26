"use client"

import { Heart, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  healthData: {
    riskLevel?: string
  }
  user: any
  onLogout: () => void
}

export default function Header({ healthData, user, onLogout }: HeaderProps) {
  const getProviderDisplay = (provider?: string) => {
    if (!provider) return "Connected"

    switch (provider) {
      case "google_fit":
        return "Connected to Google Fit"
      case "apple_health":
        return "Connected to Apple Health"
      default:
        return "Connected"
    }
  }

  const userName = user?.name || "User"
  const riskLevel = healthData?.riskLevel || "Normal"
  const userProvider = user?.provider

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">CardioCare</h1>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-red-600">{riskLevel}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-green-600">{getProviderDisplay(userProvider)}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
