"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Smartphone, Watch, AlertCircle } from "lucide-react"
import { apiService } from "@/lib/api"

interface LoginScreenProps {
  onLogin: (userData: any, token: string) => void
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [loading, setLoading] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleFitLogin = async () => {
    setLoading(true)
    setSelectedProvider("google_fit")
    setError(null)

    try {
      // Call Django backend to initiate Google Fit OAuth
      const response = await apiService.initiateGoogleFitAuth()

      if (response.authorization_url) {
        // Redirect to Google OAuth
        window.location.href = response.authorization_url
      } else {
        throw new Error("Failed to get authorization URL")
      }
    } catch (error) {
      console.error("Google Fit login error:", error)
      setError("Failed to connect to Google Fit. Please try again.")

      // Fallback to demo mode for development
      setTimeout(() => {
        simulateLogin("google_fit")
      }, 1000)
    } finally {
      setLoading(false)
    }
  }

  const handleAppleHealthLogin = async () => {
    setLoading(true)
    setSelectedProvider("apple_health")
    setError(null)

    try {
      const response = await apiService.initiateAppleHealthAuth()

      if (response.redirect_url) {
        // For iOS app integration
        window.location.href = response.redirect_url
      } else {
        // For web demo, simulate the process
        setTimeout(() => {
          simulateLogin("apple_health")
        }, 2000)
      }
    } catch (error) {
      console.error("Apple Health login error:", error)
      setError("Apple Health requires iOS app. Using demo mode.")

      // Fallback to demo mode
      setTimeout(() => {
        simulateLogin("apple_health")
      }, 1000)
    } finally {
      setLoading(false)
    }
  }

  const simulateLogin = (provider: string) => {
    // Simulate successful authentication for demo
    const userData = {
      id: 1,
      email: "john.doe@example.com",
      name: "John Doe",
      provider: provider,
    }
    const token = "demo_access_token_" + provider

    onLogin(userData, token)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">CardioCare</CardTitle>
          <p className="text-gray-600 mt-2">AI-Powered Health Monitoring</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Connect Your Health Data</h2>
            <p className="text-gray-600 text-sm">
              Choose your preferred health platform to get started with AI-powered monitoring
            </p>
          </div>

          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <p className="text-sm text-yellow-800">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Button
              onClick={handleGoogleFitLogin}
              disabled={loading}
              className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <div className="flex items-center space-x-3">
                <Smartphone className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Google Fit</div>
                  <div className="text-sm opacity-90">Android & Web</div>
                </div>
              </div>
              {loading && selectedProvider === "google_fit" && (
                <div className="ml-auto">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              )}
            </Button>

            <Button
              onClick={handleAppleHealthLogin}
              disabled={loading}
              className="w-full h-16 bg-gray-900 hover:bg-gray-800 text-white"
            >
              <div className="flex items-center space-x-3">
                <Watch className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Apple Health</div>
                  <div className="text-sm opacity-90">iPhone & Apple Watch</div>
                </div>
              </div>
              {loading && selectedProvider === "apple_health" && (
                <div className="ml-auto">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              )}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              By connecting your health data, you agree to our Terms of Service and Privacy Policy. Your health data is
              encrypted and secure.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">What we monitor:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Real-time ECG and heart rate</li>
              <li>• Blood pressure and SpO2</li>
              <li>• Emergency detection with AI</li>
              <li>• Automatic SOS alerts</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              🔧 <strong>Demo Mode:</strong> Backend integration with Django API
              <br />
              Connecting to: http://localhost:8000/api
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
