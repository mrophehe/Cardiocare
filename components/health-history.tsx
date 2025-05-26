"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, Bot, User, Brain, Paperclip, X, FileText, ImageIcon } from "lucide-react"

interface HealthHistoryProps {
  user: any
}

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  attachments?: Array<{
    name: string
    type: string
    size: string
    url?: string
  }>
}

interface UploadedFile {
  name: string
  type: string
  size: string
  file: File
}

export default function HealthHistory({ user }: HealthHistoryProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: `Hello ${user?.name || "there"}! I'm your AI health assistant. I can help you organize and understand your health history. You can:\n\n• Tell me about your past medical conditions\n• Upload old prescriptions and reports\n• Ask questions about your health patterns\n• Get insights based on your complete health profile\n\nWhat would you like to share or ask about today?`,
      timestamp: new Date(),
    },
  ])

  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
      attachments: uploadedFiles.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
      })),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setUploadedFiles([])
    setIsTyping(true)

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage, uploadedFiles)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
      setTimeout(scrollToBottom, 100)
    }, 2000)

    setTimeout(scrollToBottom, 100)
  }

  const generateAIResponse = (message: string, files: UploadedFile[]) => {
    const lowerMessage = message.toLowerCase()

    if (files.length > 0) {
      const fileTypes = files.map((f) => f.type).join(", ")
      return `Thank you for uploading ${files.length} file(s) (${fileTypes}). I've analyzed your documents and added them to your health profile. Here's what I found:\n\n• **Medical History**: Updated with new information from your reports\n• **Medications**: Added to your current medication list\n• **Lab Results**: Integrated with your health timeline\n\nBased on this information and your current health data, I notice some patterns that might be relevant for your ongoing monitoring. Would you like me to explain any specific findings or help you understand how this relates to your current health status?`
    }

    if (lowerMessage.includes("diabetes") || lowerMessage.includes("blood sugar")) {
      return `I understand you're sharing information about diabetes. This is very important for your health monitoring profile. Here's how this affects your current care:\n\n• **Current Monitoring**: Your blood glucose patterns will be tracked more closely\n• **Risk Assessment**: AI analysis will factor in diabetes-related complications\n• **Emergency Protocols**: Updated to include diabetic emergency procedures\n\nCan you tell me:\n- When were you diagnosed?\n- What medications are you currently taking?\n- Do you have any recent HbA1c results?`
    }

    if (lowerMessage.includes("heart") || lowerMessage.includes("cardiac") || lowerMessage.includes("blood pressure")) {
      return `Thank you for sharing your cardiac history. This is crucial information that I'll integrate with your real-time ECG monitoring. Here's how this enhances your care:\n\n• **Enhanced AI Analysis**: Your heart rhythm patterns will be compared against your historical baseline\n• **Personalized Alerts**: Emergency thresholds adjusted based on your specific condition\n• **Medication Interactions**: Cross-referenced with your current prescriptions\n\nYour current heart rate of 89 BPM and blood pressure of 140/90 will now be analyzed in context of your medical history. Would you like me to explain how your past conditions might relate to your current readings?`
    }

    if (lowerMessage.includes("medication") || lowerMessage.includes("prescription") || lowerMessage.includes("drug")) {
      return `I've noted your medication information. This is essential for:\n\n• **Drug Interaction Checking**: Ensuring new prescriptions are safe\n• **Side Effect Monitoring**: Watching for medication-related symptoms\n• **Dosage Optimization**: Tracking effectiveness with your vital signs\n\nI'll monitor your health metrics for any medication-related changes. Please keep me updated about:\n- Dosage changes\n- New prescriptions\n- Any side effects you experience\n\nWould you like me to set up medication reminders or track specific symptoms?`
    }

    if (lowerMessage.includes("surgery") || lowerMessage.includes("operation") || lowerMessage.includes("procedure")) {
      return `Thank you for sharing your surgical history. This information helps me provide better monitoring:\n\n• **Recovery Patterns**: Understanding your healing process\n• **Risk Factors**: Identifying potential complications to watch for\n• **Baseline Changes**: Adjusting normal ranges based on your procedures\n\nI'll factor this into your health analysis. Can you provide:\n- Date of the procedure\n- Type of surgery\n- Any ongoing effects or restrictions\n- Follow-up care requirements?`
    }

    return `Thank you for sharing that information. I've added it to your comprehensive health profile. This helps me provide more personalized monitoring and analysis.\n\nBased on what you've told me, I'll:\n• Update your risk assessment algorithms\n• Adjust emergency detection parameters\n• Provide more relevant health insights\n• Monitor for condition-specific patterns\n\nIs there anything specific about your health history you'd like me to focus on or any questions about how this information will be used in your monitoring?`
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const newFiles = files.map((file) => ({
      name: file.name,
      type: file.type.includes("image") ? "image" : "document",
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      file,
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Health History Assistant</h2>
          <p className="text-gray-600">Share your medical history and upload documents for comprehensive AI analysis</p>
        </div>
      </div>

      {/* Chat Interface - Full Width */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-500" />
            <span>AI Health Assistant</span>
            <div className="flex items-center space-x-1 ml-auto">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-600">Online</span>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex space-x-2 max-w-[80%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === "user" ? "bg-blue-500" : "bg-green-500"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>

                  <div
                    className={`rounded-lg p-3 ${
                      message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>

                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center space-x-2 text-xs opacity-80">
                            {attachment.type === "image" ? (
                              <ImageIcon className="w-3 h-3" />
                            ) : (
                              <FileText className="w-3 h-3" />
                            )}
                            <span>
                              {attachment.name} ({attachment.size})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className={`text-xs mt-1 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* File Upload Preview */}
          {uploadedFiles.length > 0 && (
            <div className="border-t p-3 bg-gray-50">
              <p className="text-sm font-medium text-gray-700 mb-2">Files to upload:</p>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                    <div className="flex items-center space-x-2">
                      {file.type === "image" ? (
                        <ImageIcon className="w-4 h-4 text-blue-500" />
                      ) : (
                        <FileText className="w-4 h-4 text-green-500" />
                      )}
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-gray-500">({file.size})</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="hidden"
              />

              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="w-4 h-4" />
              </Button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Share your health history, ask questions, or upload documents..."
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <Button onClick={handleSendMessage} disabled={isTyping}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
