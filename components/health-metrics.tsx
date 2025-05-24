"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Droplets, Wind, Thermometer, Database, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiService } from "@/lib/api"

interface HealthMetricsProps {
  healthData: {
    heartRate: number
    bloodPressure: { systolic: number; diastolic: number }
    spo2: number
    temperature: number
  }
  user: any
  backendConnected?: boolean
}

export default function HealthMetrics({ healthData, user, backendConnected = false }: HealthMetricsProps) {
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  const handleSyncData = async () => {
    if (!backendConnected) return

    setSyncing(true)
    try {
      if (user?.provider === "google_fit") {
        await apiService.syncGoogleFitData()
        setLastSync(new Date())
      }
    } catch (error) {
      console.error("Error syncing data:", error)
    } finally {
      setSyncing(false)
    }
  }

  const metrics = [
    {
      title: "Heart Rate",
      value: `${healthData.heartRate} BPM`,
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-50",
      status: healthData.heartRate > 100 ? "High" : "Normal",
    },
    {
      title: "Blood Pressure",
      value: `${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic}`,
      icon: Droplets,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      status: healthData.bloodPressure.systolic > 130 ? "High" : "Normal",
    },
    {
      title: "SpO2",
      value: `${healthData.spo2}%`,
      icon: Wind,
      color: "text-green-500",
      bgColor: "bg-green-50",
      status: healthData.spo2 < 95 ? "Low" : "Normal",
    },
    {
      title: "Temperature",
      value: `${healthData.temperature.toFixed(1)}°F`,
      icon: Thermometer,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      status: healthData.temperature > 99.5 ? "High" : "Normal",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Health Metrics</h2>

        {backendConnected && (
          <Button onClick={handleSyncData} disabled={syncing} variant="outline" size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync Data"}
          </Button>
        )}
      </div>

      {/* Backend status */}
      <Card className={backendConnected ? "border-green-200" : "border-yellow-200"}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Database className={`w-5 h-5 ${backendConnected ? "text-green-600" : "text-yellow-600"}`} />
            <div>
              <p className={`font-medium ${backendConnected ? "text-green-800" : "text-yellow-800"}`}>
                {backendConnected ? "Django Backend Connected" : "Demo Mode - Backend Offline"}
              </p>
              <p className={`text-sm ${backendConnected ? "text-green-600" : "text-yellow-600"}`}>
                {backendConnected
                  ? `Data source: ${user?.provider === "google_fit" ? "Google Fit API" : "Apple Health"} via Django`
                  : "Start Django server to enable real-time health data sync"}
              </p>
              {lastSync && <p className="text-xs text-gray-500 mt-1">Last sync: {lastSync.toLocaleTimeString()}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className={`text-sm ${metric.status === "Normal" ? "text-green-600" : "text-red-600"}`}>
                    {metric.status}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Health Data Provider</p>
                <p className="text-sm text-gray-600">
                  {user?.provider === "google_fit" ? "Google Fit" : "Apple Health"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">Connected</p>
                <p className="text-xs text-gray-500">OAuth authenticated</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Django Backend</p>
                <p className="text-sm text-gray-600">PostgreSQL + Celery + OpenRouter AI</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${backendConnected ? "text-green-600" : "text-orange-600"}`}>
                  {backendConnected ? "Connected" : "Offline"}
                </p>
                <p className="text-xs text-gray-500">{backendConnected ? "localhost:8000" : "Demo mode active"}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Emergency System</p>
                <p className="text-sm text-gray-600">Twilio WhatsApp + AI Voice</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">Ready</p>
                <p className="text-xs text-gray-500">Auto-call enabled</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
