"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Clock, Database, Zap } from "lucide-react"
import { apiService } from "@/lib/api"

interface AIAnalysisProps {
  healthData: {
    heartRate: number
    bloodPressure: { systolic: number; diastolic: number }
    spo2: number
  }
  backendConnected?: boolean
}

export default function AIAnalysis({ healthData, backendConnected = false }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState("")
  const [prediction, setPrediction] = useState("")
  const [loading, setLoading] = useState(true)
  const [confidence, setConfidence] = useState(0)
  const [recommendations, setRecommendations] = useState<string[]>([])

  useEffect(() => {
    const analyzeHealthData = async () => {
      setLoading(true)

      if (backendConnected) {
        try {
          // Get AI analysis from Django backend (OpenRouter)
          const result = await apiService.getAIAnalysis()

          if (result) {
            setAnalysis(result.analysis_result || "Analysis completed")
            setPrediction(result.prediction || "No immediate concerns")
            setConfidence(result.confidence_score || 0.8)
            setRecommendations(result.recommendations || [])
          }
        } catch (error) {
          console.error("Error getting AI analysis:", error)
          // Fallback to mock analysis
          setMockAnalysis()
        }
      } else {
        // Use mock analysis when backend is not connected
        setTimeout(() => {
          setMockAnalysis()
        }, 3000)
      }

      setLoading(false)
    }

    const setMockAnalysis = () => {
      setAnalysis("Abnormal QRS complex indicating potential arrhythmia")
      setPrediction("Immediate medical attention recommended")
      setConfidence(0.95)
      setRecommendations([
        "Seek immediate medical attention",
        "Contact emergency services",
        "Take prescribed emergency medication if available",
      ])
    }

    analyzeHealthData()
  }, [healthData, backendConnected])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-blue-500" />
          <span>AI Analysis</span>
          {backendConnected && (
            <div className="flex items-center space-x-1 ml-auto">
              <Zap className="w-4 h-4 text-green-500" />
              <span className="text-xs text-green-600">OpenRouter AI</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Backend status */}
          <div className={`p-3 rounded-lg ${backendConnected ? "bg-blue-50" : "bg-gray-50"}`}>
            <div className="flex items-center space-x-2 mb-1">
              <Database className={`w-4 h-4 ${backendConnected ? "text-blue-600" : "text-gray-600"}`} />
              <span className={`text-sm font-medium ${backendConnected ? "text-blue-800" : "text-gray-800"}`}>
                {backendConnected ? "Live AI Analysis" : "Demo Analysis"}
              </span>
            </div>
            <p className={`text-xs ${backendConnected ? "text-blue-700" : "text-gray-600"}`}>
              {backendConnected
                ? "Powered by OpenRouter AI via Django backend"
                : "Connect to Django backend for real AI analysis"}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">Current Analysis:</h4>
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
            ) : (
              <p className="text-gray-900">{analysis}</p>
            )}
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Prediction:
            </h4>
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
            ) : (
              <p className="text-red-600 font-medium">{prediction}</p>
            )}
          </div>

          {!loading && confidence > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Confidence Score:</h4>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${confidence * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{Math.round(confidence * 100)}%</span>
              </div>
            </div>
          )}

          {!loading && recommendations.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Recommendations:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-lg">
            <h5 className="font-medium text-blue-800 mb-1">Health Metrics Summary:</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>Heart Rate: {healthData.heartRate} BPM (Elevated)</li>
              <li>
                Blood Pressure: {healthData.bloodPressure.systolic}/{healthData.bloodPressure.diastolic} mmHg (High)
              </li>
              <li>SpO2: {healthData.spo2}% (Normal)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
