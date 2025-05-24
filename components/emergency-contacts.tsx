import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, MessageSquare, Plus, Edit } from "lucide-react"

interface EmergencyContactsProps {
  user: any
}

export default function EmergencyContacts({ user }: EmergencyContactsProps) {
  const contacts = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      relationship: "Primary Care Physician",
      phone: "+1 (555) 123-4567",
      priority: 1,
    },
    {
      id: 2,
      name: "Emergency Services",
      relationship: "Emergency",
      phone: "911",
      priority: 1,
    },
    {
      id: 3,
      name: "Jane Doe",
      relationship: "Spouse",
      phone: "+1 (555) 987-6543",
      priority: 2,
    },
    {
      id: 4,
      name: "Michael Doe",
      relationship: "Son",
      phone: "+1 (555) 456-7890",
      priority: 3,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Emergency Contacts</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Primary Contacts for {user?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{contact.name}</h3>
                  <p className="text-sm text-gray-500">{contact.relationship}</p>
                  <p className="text-sm text-gray-700">{contact.phone}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Auto-call Emergency Services</h4>
                <p className="text-sm text-gray-500">Automatically call 911 if critical emergency detected</p>
              </div>
              <input type="checkbox" className="h-4 w-4" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">WhatsApp Notifications</h4>
                <p className="text-sm text-gray-500">Send alerts via WhatsApp to emergency contacts</p>
              </div>
              <input type="checkbox" className="h-4 w-4" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">AI Voice Assistant</h4>
                <p className="text-sm text-gray-500">Use AI voice to communicate with emergency services</p>
              </div>
              <input type="checkbox" className="h-4 w-4" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
