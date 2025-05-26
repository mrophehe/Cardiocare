"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Droplets, Wind, Thermometer, RefreshCw, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HealthMetricsProps {
  healthData: {
    heartRate: number
    bloodPressure: { systolic: number; diastolic: number }
    spo2: number
    temperature: number
  }
  user: any
}

export default function HealthMetrics({ healthData, user }: HealthMetricsProps) {
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date>(new Date())

  const handleSyncData = async () => {
    setSyncing(true)
    // Simulate sync process
    setTimeout(() => {
      setLastSync(new Date())
      setSyncing(false)
    }, 2000)
  }

  const safeHealthData = {
    heartRate: healthData?.heartRate || 0,
    bloodPressure: healthData?.bloodPressure || { systolic: 0, diastolic: 0 },
    spo2: healthData?.spo2 || 0,
    temperature: healthData?.temperature || 0,
  }

  const metrics = [
    {
      title: "Heart Rate",
      value: `${safeHealthData.heartRate} BPM`,
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-50",
      status: safeHealthData.heartRate > 100 ? "High" : "Normal",
    },
    {
      title: "Blood Pressure",
      value: `${safeHealthData.bloodPressure.systolic}/${safeHealthData.bloodPressure.diastolic}`,
      icon: Droplets,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      status: safeHealthData.bloodPressure.systolic > 130 ? "High" : "Normal",
    },
    {
      title: "SpO2",
      value: `${safeHealthData.spo2}%`,
      icon: Wind,
      color: "text-green-500",
      bgColor: "bg-green-50",
      status: safeHealthData.spo2 < 95 ? "Low" : "Normal",
    },
    {
      title: "Temperature",
      value: `${safeHealthData.temperature.toFixed(1)}°F`,
      icon: Thermometer,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      status: safeHealthData.temperature > 99.5 ? "High" : "Normal",
    },
  ]

  const userProvider = user?.provider || "google_fit"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Health Metrics</h2>
        <Button onClick={handleSyncData} disabled={syncing} variant="outline" size="sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Sync Data"}
        </Button>
      </div>

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
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="font-medium text-green-800">Health Data Provider</p>
                <p className="text-sm text-green-600">
                  {userProvider === "google_fit" ? "Google Fit" : "Apple Health"}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-medium text-green-600">Connected</p>
                </div>
                <p className="text-xs text-green-500">OAuth authenticated</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="font-medium text-green-800">AI Analysis Engine</p>
                <p className="text-sm text-green-600">OpenRouter AI + Real-time Processing</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-medium text-green-600">Active</p>
                </div>
                <p className="text-xs text-green-500">Monitoring 24/7</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="font-medium text-green-800">Emergency System</p>
                <p className="text-sm text-green-600">Twilio WhatsApp + AI Voice</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-medium text-green-600">Ready</p>
                </div>
                <p className="text-xs text-green-500">Auto-call enabled</p>
              </div>
            </div>

            {lastSync && (
              <div className="text-center text-sm text-gray-500 pt-2 border-t">
                Last sync: {lastSync.toLocaleTimeString()} • Next sync in 5 minutes
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
