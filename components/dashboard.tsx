"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Navigation from "@/components/navigation"
import ECGMonitor from "@/components/ecg-monitor"
import HealthMetrics from "@/components/health-metrics"
import AlertHistory from "@/components/alert-history"
import EmergencyContacts from "@/components/emergency-contacts"
import EmergencyAlert from "@/components/emergency-alert"
import { apiService } from "@/lib/api"

interface DashboardProps {
  user: any
  onLogout: () => void
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("ECG Monitor")
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false)
  const [healthData, setHealthData] = useState({
    heartRate: 89,
    bloodPressure: { systolic: 140, diastolic: 90 },
    spo2: 97,
    temperature: 98.6,
    riskLevel: "High Risk",
  })
  const [loading, setLoading] = useState(true)
  const [backendConnected, setBackendConnected] = useState(false)

  // Fetch real-time health data from Django backend
  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const data = await apiService.getCurrentHealthMetrics()
        setHealthData(data)
        setBackendConnected(true)
      } catch (error) {
        console.error("Error fetching health data:", error)
        setBackendConnected(false)
        // Use mock data if backend is not available
      } finally {
        setLoading(false)
      }
    }

    const syncHealthData = async () => {
      if (user?.provider === "google_fit") {
        try {
          await apiService.syncGoogleFitData()
        } catch (error) {
          console.error("Error syncing Google Fit data:", error)
        }
      }
    }

    fetchHealthData()
    syncHealthData()

    // Set up real-time updates
    const interval = setInterval(fetchHealthData, 5000) // Update every 5 seconds

    // Simulate emergency detection after 15 seconds
    const emergencyTimeout = setTimeout(() => {
      setShowEmergencyAlert(true)
    }, 15000)

    return () => {
      clearInterval(interval)
      clearTimeout(emergencyTimeout)
    }
  }, [user])

  // Simulate real-time data updates when backend is not connected
  useEffect(() => {
    if (!backendConnected) {
      const interval = setInterval(() => {
        setHealthData((prev) => ({
          ...prev,
          heartRate: 85 + Math.floor(Math.random() * 10),
          spo2: 95 + Math.floor(Math.random() * 5),
          temperature: 98.0 + Math.random() * 1.5,
        }))
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [backendConnected])

  // Add this useEffect after the existing ones
  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        const isConnected = await apiService.testConnection()
        setBackendConnected(isConnected)

        if (isConnected) {
          console.log("✅ Django backend connected successfully!")
        } else {
          console.log("⚠️ Django backend not available - using demo mode")
        }
      } catch (error) {
        console.error("Backend connection error:", error)
        setBackendConnected(false)
      }
    }

    testBackendConnection()
  }, [])

  const renderActiveTab = () => {
    switch (activeTab) {
      case "ECG Monitor":
        return <ECGMonitor healthData={healthData} user={user} backendConnected={backendConnected} />
      case "Health Metrics":
        return <HealthMetrics healthData={healthData} user={user} backendConnected={backendConnected} />
      case "Alert History":
        return <AlertHistory user={user} backendConnected={backendConnected} />
      case "Emergency Contacts":
        return <EmergencyContacts user={user} backendConnected={backendConnected} />
      default:
        return <ECGMonitor healthData={healthData} user={user} backendConnected={backendConnected} />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CardioCare dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Connecting to Django backend...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header healthData={healthData} user={user} onLogout={onLogout} backendConnected={backendConnected} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-6">{renderActiveTab()}</main>
      {showEmergencyAlert && <EmergencyAlert onClose={() => setShowEmergencyAlert(false)} user={user} />}
    </div>
  )
}
