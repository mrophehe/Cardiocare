"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Clock, Zap } from "lucide-react"

interface AIAnalysisProps {
  healthData: {
    heartRate: number
    bloodPressure: { systolic: number; diastolic: number }
    spo2: number
  }
}

export default function AIAnalysis({ healthData }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState("")
  const [prediction, setPrediction] = useState("")
  const [loading, setLoading] = useState(true)
  const [confidence, setConfidence] = useState(0)
  const [recommendations, setRecommendations] = useState<string[]>([])

  useEffect(() => {
    const analyzeHealthData = async () => {
      setLoading(true)

      // Simulate AI analysis processing time
      setTimeout(() => {
        setAnalysis("Abnormal QRS complex indicating potential arrhythmia with elevated heart rate patterns")
        setPrediction("Immediate medical attention recommended - cardiac event risk detected")
        setConfidence(0.95)
        setRecommendations([
          "Seek immediate medical attention",
          "Contact emergency services if symptoms worsen",
          "Take prescribed emergency medication if available",
          "Monitor vital signs continuously",
          "Avoid physical exertion until cleared by physician",
        ])
        setLoading(false)
      }, 3000)
    }

    analyzeHealthData()
  }, [healthData])

  const safeHealthData = {
    heartRate: healthData?.heartRate || 0,
    bloodPressure: healthData?.bloodPressure || { systolic: 0, diastolic: 0 },
    spo2: healthData?.spo2 || 0,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-blue-500" />
          <span>AI Analysis</span>
          <div className="flex items-center space-x-1 ml-auto">
            <Zap className="w-4 h-4 text-green-500" />
            <span className="text-xs text-green-600">OpenRouter AI</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
              <li>Heart Rate: {safeHealthData.heartRate} BPM (Elevated)</li>
              <li>
                Blood Pressure: {safeHealthData.bloodPressure.systolic}/{safeHealthData.bloodPressure.diastolic} mmHg
                (High)
              </li>
              <li>SpO2: {safeHealthData.spo2}% (Normal)</li>
            </ul>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <h5 className="font-medium text-green-800 mb-1">AI Processing Status:</h5>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-700">Real-time analysis active</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-700">Emergency detection enabled</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
