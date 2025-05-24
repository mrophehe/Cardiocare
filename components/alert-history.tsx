import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, CheckCircle } from "lucide-react"

interface AlertHistoryProps {
  user: any
}

export default function AlertHistory({ user }: AlertHistoryProps) {
  const alerts = [
    {
      id: 1,
      type: "Emergency",
      message: "Abnormal QRS complex detected",
      timestamp: "2024-01-24 14:30:22",
      status: "Active",
      severity: "High",
    },
    {
      id: 2,
      type: "Warning",
      message: "Elevated heart rate detected",
      timestamp: "2024-01-24 12:15:10",
      status: "Resolved",
      severity: "Medium",
    },
    {
      id: 3,
      type: "Info",
      message: "Daily health summary generated",
      timestamp: "2024-01-24 08:00:00",
      status: "Completed",
      severity: "Low",
    },
    {
      id: 4,
      type: "Emergency",
      message: "Blood pressure spike detected",
      timestamp: "2024-01-23 19:45:33",
      status: "Resolved",
      severity: "High",
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
      <h2 className="text-2xl font-bold text-gray-900">Alert History</h2>

      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts for {user?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(alert.status)}
                  <div>
                    <p className="font-medium text-gray-900">{alert.message}</p>
                    <p className="text-sm text-gray-500">{alert.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                  <Badge variant={alert.status === "Active" ? "destructive" : "secondary"}>{alert.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
