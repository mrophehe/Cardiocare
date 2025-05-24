"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, RefreshCw, ExternalLink } from "lucide-react"
import { apiService } from "@/lib/api"

export default function BackendStatus() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [apiUrl, setApiUrl] = useState("")

  useEffect(() => {
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api")
    testConnection()
  }, [])

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const connected = await apiService.testConnection()
      setIsConnected(connected)
    } catch (error) {
      setIsConnected(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={`border-2 ${isConnected ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${isConnected ? "bg-green-100" : "bg-orange-100"}`}>
              {isLoading ? (
                <RefreshCw className="w-5 h-5 text-gray-600 animate-spin" />
              ) : isConnected ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange-600" />
              )}
            </div>
            <div>
              <h3 className={`font-semibold ${isConnected ? "text-green-800" : "text-orange-800"}`}>Django Backend</h3>
              <p className={`text-sm ${isConnected ? "text-green-600" : "text-orange-600"}`}>
                {isLoading ? "Testing connection..." : isConnected ? "Connected & Ready" : "Not Available"}
              </p>
              <p className="text-xs text-gray-500 mt-1">API: {apiUrl}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={testConnection} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
              Test
            </Button>
            {!isConnected && (
              <Button variant="outline" size="sm" asChild>
                <a href="https://github.com/your-repo/cardiocare-backend" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Setup Guide
                </a>
              </Button>
            )}
          </div>
        </div>

        {!isConnected && (
          <div className="mt-4 p-3 bg-orange-100 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2">🚀 Start Django Backend:</h4>
            <div className="text-sm text-orange-700 space-y-1 font-mono">
              <div>1. cd cardiocare-backend</div>
              <div>2. pip install -r requirements.txt</div>
              <div>3. python manage.py migrate</div>
              <div>4. python manage.py runserver</div>
            </div>
          </div>
        )}

        {isConnected && (
          <div className="mt-4 p-3 bg-green-100 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">✅ Backend Features Active:</h4>
            <div className="text-sm text-green-700 space-y-1">
              <div>• OpenRouter AI Analysis</div>
              <div>• Google Fit / Apple Health Sync</div>
              <div>• Twilio WhatsApp Alerts</div>
              <div>• PostgreSQL Data Storage</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
