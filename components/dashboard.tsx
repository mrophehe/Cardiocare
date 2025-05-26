"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Navigation from "@/components/navigation"
import ECGMonitor from "@/components/ecg-monitor"
import HealthMetrics from "@/components/health-metrics"
import AlertHistory from "@/components/alert-history"
import EmergencyContacts from "@/components/emergency-contacts"
import HealthHistory from "@/components/health-history"
import EmergencyAlert from "@/components/emergency-alert"

interface DashboardProps {
  user: any
  onLogout: () => void
}

interface HealthData {
  heartRate: number
  bloodPressure: { systolic: number; diastolic: number }
  spo2: number
  temperature: number
  riskLevel: string
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("ECG Monitor")
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false)
  const [healthData, setHealthData] = useState<HealthData>({
    heartRate: 89,
    bloodPressure: { systolic: 140, diastolic: 90 },
    spo2: 97,
    temperature: 98.6,
    riskLevel: "High Risk",
  })

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthData((prev) => ({
        ...prev,
        heartRate: 85 + Math.floor(Math.random() * 10),
        spo2: 95 + Math.floor(Math.random() * 5),
        temperature: 98.0 + Math.random() * 1.5,
        bloodPressure: {
          systolic: 135 + Math.floor(Math.random() * 10),
          diastolic: 85 + Math.floor(Math.random() * 10),
        },
      }))
    }, 3000)

    // Simulate emergency detection after 15 seconds
    const emergencyTimeout = setTimeout(() => {
      setShowEmergencyAlert(true)
    }, 15000)

    return () => {
      clearInterval(interval)
      clearTimeout(emergencyTimeout)
    }
  }, [])

  const renderActiveTab = () => {
    const props = { healthData, user }

    switch (activeTab) {
      case "ECG Monitor":
        return <ECGMonitor {...props} />
      case "Health Metrics":
        return <HealthMetrics {...props} />
      case "Alert History":
        return <AlertHistory user={user} />
      case "Emergency Contacts":
        return <EmergencyContacts user={user} />
      case "Health History":
        return <HealthHistory user={user} />
      default:
        return <ECGMonitor {...props} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header healthData={healthData} user={user} onLogout={onLogout} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-6">{renderActiveTab()}</main>
      {showEmergencyAlert && <EmergencyAlert onClose={() => setShowEmergencyAlert(false)} user={user} />}
    </div>
  )
}
