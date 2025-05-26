"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, AlertTriangle } from "lucide-react"
import AIAnalysis from "@/components/ai-analysis"

interface ECGMonitorProps {
  healthData: {
    heartRate: number
    bloodPressure: { systolic: number; diastolic: number }
    spo2: number
  }
  user: any
}

export default function ECGMonitor({ healthData, user }: ECGMonitorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ecgData, setEcgData] = useState<number[]>([])
  const [showAlert, setShowAlert] = useState(false)

  // Generate realistic ECG waveform data
  useEffect(() => {
    const generateECGData = () => {
      const newData = []
      for (let i = 0; i < 300; i++) {
        // Simulate ECG waveform with P, QRS, T waves
        let value = 0
        const cycle = i % 60

        if (cycle < 10) {
          // P wave
          value = Math.sin((cycle / 10) * Math.PI) * 0.3
        } else if (cycle >= 15 && cycle < 25) {
          // QRS complex
          if (cycle < 20) {
            value = -Math.sin(((cycle - 15) / 5) * Math.PI) * 0.5
          } else {
            value = Math.sin(((cycle - 20) / 5) * Math.PI) * 1.5
          }
        } else if (cycle >= 30 && cycle < 45) {
          // T wave
          value = Math.sin(((cycle - 30) / 15) * Math.PI) * 0.6
        }

        // Add realistic noise and variation
        value += (Math.random() - 0.5) * 0.1

        // Simulate abnormal QRS after 10 seconds
        if (Date.now() % 20000 > 10000 && cycle >= 15 && cycle < 25) {
          value *= 1.8 // Make QRS complex abnormal
        }

        newData.push(value)
      }

      setEcgData(newData)
    }

    generateECGData()
    const interval = setInterval(generateECGData, 1000)

    // Show alert after 8 seconds with fall detection
    const alertTimeout = setTimeout(() => {
      setShowAlert(true)
    }, 8000)

    return () => {
      clearInterval(interval)
      clearTimeout(alertTimeout)
    }
  }, [])

  // Draw ECG waveform
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || ecgData.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#f0f0f0"
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 20) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw ECG waveform
    ctx.strokeStyle = "#ef4444"
    ctx.lineWidth = 2
    ctx.beginPath()

    const scaleX = canvas.width / ecgData.length
    const scaleY = canvas.height / 4
    const centerY = canvas.height / 2

    ecgData.forEach((value, index) => {
      const x = index * scaleX
      const y = centerY - value * scaleY

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()
  }, [ecgData])

  return (
    <div className="space-y-6">
      <Card className="border-red-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Real-time ECG Monitor</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="destructive" className="bg-red-500">
                <Activity className="w-3 h-3 mr-1" />
                {healthData.heartRate} BPM
              </Badge>
              {showAlert && (
                <Badge variant="destructive" className="bg-orange-500">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Emergency Detected
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <canvas
              ref={canvasRef}
              className="w-full h-48 bg-white rounded border"
              style={{ imageRendering: "pixelated" }}
            />
          </div>

          {showAlert && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-red-800">Emergency Alert</h3>
              </div>
              <p className="text-red-700 mb-2">Abnormal QRS complex indicating potential arrhythmia</p>
              <p className="text-red-600 mb-2">⚠️ Fall detected - Patient appears unconscious</p>
              <p className="text-sm text-red-600 mb-3">
                CardioCare emergency system activated - contacts being notified via WhatsApp
                <br />
                Automatic ambulance call will be initiated in 30 seconds
              </p>
              <div className="flex space-x-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => setShowAlert(false)}
                >
                  Cancel Alert
                </button>
                <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                  I'm OK - Stop Auto-Call
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AIAnalysis healthData={healthData} />
    </div>
  )
}
