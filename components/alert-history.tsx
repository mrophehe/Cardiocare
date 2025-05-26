import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, CheckCircle, Heart, Activity } from "lucide-react"

interface AlertHistoryProps {
  user: any
}

export default function AlertHistory({ user }: AlertHistoryProps) {
  const alerts = [
    {
      id: 1,
      type: "Emergency",
      message: "Abnormal QRS complex detected - Potential arrhythmia",
      timestamp: "2024-01-24 14:30:22",
      status: "Active",
      severity: "High",
      icon: AlertTriangle,
      details: "Heart rate: 142 BPM, Irregular rhythm detected",
    },
    {
      id: 2,
      type: "Warning",
      message: "Elevated heart rate detected during rest period",
      timestamp: "2024-01-24 12:15:10",
      status: "Resolved",
      severity: "Medium",
      icon: Heart,
      details: "Heart rate: 105 BPM for 15 minutes",
    },
    {
      id: 3,
      type: "Emergency",
      message: "Blood pressure spike detected - Hypertensive crisis",
      timestamp: "2024-01-23 19:45:33",
      status: "Resolved",
      severity: "High",
      icon: Activity,
      details: "BP: 180/110 mmHg, Emergency contacts notified",
    },
    {
      id: 4,
      type: "Warning",
      message: "SpO2 levels below normal range",
      timestamp: "2024-01-23 16:22:15",
      status: "Resolved",
      severity: "Medium",
      icon: Activity,
      details: "SpO2: 92% for 8 minutes",
    },
    {
      id: 5,
      type: "Info",
      message: "Daily health summary generated",
      timestamp: "2024-01-23 08:00:00",
      status: "Completed",
      severity: "Low",
      icon: CheckCircle,
      details: "All metrics within normal range",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "Resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Clock className="w-4 h-4 text-blue-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Alert History</h2>
        <div className="text-sm text-gray-500">Showing alerts for {user?.name}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-600">2</p>
                <p className="text-sm text-gray-600">Active Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-600">12</p>
                <p className="text-sm text-gray-600">Resolved This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-blue-600">24/7</p>
                <p className="text-sm text-gray-600">Monitoring Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Health Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <alert.icon
                      className={`w-5 h-5 ${
                        alert.severity === "High"
                          ? "text-red-500"
                          : alert.severity === "Medium"
                            ? "text-yellow-500"
                            : "text-blue-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{alert.message}</p>
                    <p className="text-sm text-gray-600 mt-1">{alert.details}</p>
                    <p className="text-xs text-gray-500 mt-2">{alert.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                  <Badge variant={alert.status === "Active" ? "destructive" : "secondary"}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(alert.status)}
                      <span>{alert.status}</span>
                    </div>
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
