"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Phone, X, MapPin, Mic, Volume2 } from "lucide-react"

interface EmergencyAlertProps {
  onClose: () => void
  user: any
}

export default function EmergencyAlert({ onClose, user }: EmergencyAlertProps) {
  const [countdown, setCountdown] = useState(30)
  const [phase, setPhase] = useState<"countdown" | "calling" | "connected" | "ai-speaking">("countdown")
  const [aiDialogue, setAiDialogue] = useState<string[]>([])
  const [currentDialogue, setCurrentDialogue] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setPhase("calling")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (phase === "calling") {
      // Simulate dialing emergency services
      setTimeout(() => {
        setPhase("connected")
      }, 3000)
    } else if (phase === "connected") {
      // Start AI conversation
      setTimeout(() => {
        setPhase("ai-speaking")
        startAIConversation()
      }, 2000)
    }
  }, [phase])

  const startAIConversation = () => {
    const conversation = [
      "911, what's your emergency?",
      "This is CardioCare AI emergency system. I'm calling on behalf of John Doe who has experienced a critical cardiac emergency.",
      "What is the nature of the emergency?",
      "Patient has abnormal QRS complex indicating potential arrhythmia. Heart rate elevated to 89 BPM with irregular rhythm detected.",
      "What is the patient's location?",
      "Patient location: 123 Main Street, San Francisco, CA 94102. GPS coordinates: 37.7749° N, 122.4194° W",
      "Is the patient conscious?",
      "Patient status unknown - emergency detected via continuous ECG monitoring. Patient may be unconscious or experiencing cardiac distress.",
      "We're dispatching an ambulance immediately. ETA 8 minutes.",
      "Thank you. Patient's medical history: No known allergies. Emergency contacts have been notified. Please prioritize cardiac response team.",
    ]

    let index = 0
    const speakNext = () => {
      if (index < conversation.length) {
        const isAI = index % 2 === 1
        setCurrentDialogue(conversation[index])
        setAiDialogue((prev) => [...prev, `${isAI ? "AI Assistant" : "911 Operator"}: ${conversation[index]}`])
        index++
        setTimeout(speakNext, isAI ? 4000 : 3000) // AI speaks longer
      }
    }
    speakNext()
  }

  const handleEmergencyCall = () => {
    setPhase("calling")
  }

  const renderCountdownPhase = () => (
    <div className="text-center">
      <div className="mb-4">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-2 animate-pulse" />
        <p className="text-gray-700 mb-2">Auto-calling ambulance in:</p>
        <div className="text-6xl font-bold text-red-500 mb-4">{countdown}s</div>
      </div>

      <div className="bg-yellow-50 p-3 rounded-lg mb-4">
        <p className="text-yellow-800 text-sm font-medium">🚨 FALL DETECTION ACTIVATED</p>
        <p className="text-yellow-700 text-xs">Patient appears unconscious - initiating emergency protocol</p>
      </div>

      <div className="space-y-2">
        <Button onClick={handleEmergencyCall} className="w-full bg-red-500 hover:bg-red-600">
          <Phone className="w-4 h-4 mr-2" />
          Call Ambulance Now
        </Button>
        <Button variant="outline" onClick={onClose} className="w-full">
          Cancel - I'm OK
        </Button>
      </div>
    </div>
  )

  const renderCallingPhase = () => (
    <div className="text-center">
      <div className="animate-pulse mb-4">
        <Phone className="w-16 h-16 text-red-500 mx-auto mb-2" />
        <p className="text-lg font-medium">Calling 911...</p>
        <p className="text-sm text-gray-600">Connecting to emergency services</p>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
        <p className="text-blue-800 text-sm">Dialing emergency services...</p>
      </div>
    </div>
  )

  const renderConnectedPhase = () => (
    <div className="text-center">
      <div className="mb-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <Phone className="w-8 h-8 text-green-600" />
        </div>
        <p className="text-lg font-medium text-green-600">Connected to 911</p>
        <p className="text-sm text-gray-600">Preparing AI assistant...</p>
      </div>

      <div className="bg-green-50 p-3 rounded-lg">
        <p className="text-green-800 text-sm">✓ Emergency services connected</p>
        <p className="text-green-800 text-sm">✓ AI assistant taking over call</p>
      </div>
    </div>
  )

  const renderAISpeakingPhase = () => (
    <div>
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <Mic className="w-8 h-8 text-blue-600 animate-pulse" />
        </div>
        <p className="text-lg font-medium text-blue-600">AI Assistant Speaking</p>
        <p className="text-sm text-gray-600">Providing medical information to 911</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto mb-4">
        <div className="space-y-2">
          {aiDialogue.map((line, index) => (
            <div
              key={index}
              className={`text-sm p-2 rounded ${
                line.startsWith("AI Assistant") ? "bg-blue-100 text-blue-800 ml-4" : "bg-gray-100 text-gray-800 mr-4"
              }`}
            >
              <strong>{line.split(":")[0]}:</strong> {line.split(":").slice(1).join(":")}
            </div>
          ))}
          {currentDialogue && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span>Currently speaking...</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <MapPin className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Location Shared</span>
          </div>
          <p className="text-xs text-green-700">123 Main St, SF, CA</p>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Phone className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">ETA: 8 minutes</span>
          </div>
          <p className="text-xs text-blue-700">Ambulance dispatched</p>
        </div>
      </div>

      <div className="bg-yellow-50 p-3 rounded-lg mb-4">
        <p className="text-yellow-800 text-sm font-medium">🏥 Medical Information Provided:</p>
        <ul className="text-yellow-700 text-xs mt-1 space-y-1">
          <li>• Cardiac arrhythmia detected</li>
          <li>• No known allergies</li>
          <li>• Emergency contacts notified</li>
          <li>• Continuous monitoring active</li>
        </ul>
      </div>

      <Button variant="outline" onClick={onClose} className="w-full">
        End Monitoring
      </Button>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg border-red-500 border-2 max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-bold text-red-600">EMERGENCY DETECTED</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-800 font-medium">Critical arrhythmia detected for {user?.name}</p>
              <p className="text-red-600 text-sm">
                Patient appears unconscious - automatic emergency response activated
              </p>
            </div>

            {phase === "countdown" && renderCountdownPhase()}
            {phase === "calling" && renderCallingPhase()}
            {phase === "connected" && renderConnectedPhase()}
            {phase === "ai-speaking" && renderAISpeakingPhase()}

            <div className="text-xs text-gray-500 text-center border-t pt-3">
              ✓ WhatsApp alerts sent to emergency contacts
              <br />✓ Location automatically shared with emergency services
              <br />✓ AI voice assistant handling emergency communication
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
