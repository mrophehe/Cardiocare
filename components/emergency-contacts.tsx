"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, MessageSquare, Plus, Edit, CheckCircle, Clock } from "lucide-react"
import { useState } from "react"

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
      lastContacted: "2024-01-20 15:30",
      status: "Available",
    },
    {
      id: 2,
      name: "Emergency Services",
      relationship: "Emergency",
      phone: "911",
      priority: 1,
      lastContacted: "Never",
      status: "Always Available",
    },
    {
      id: 3,
      name: "Jane Doe",
      relationship: "Spouse",
      phone: "+1 (555) 987-6543",
      priority: 2,
      lastContacted: "2024-01-24 09:15",
      status: "Available",
    },
    {
      id: 4,
      name: "Michael Doe",
      relationship: "Son",
      phone: "+1 (555) 456-7890",
      priority: 3,
      lastContacted: "2024-01-23 18:45",
      status: "Available",
    },
    {
      id: 5,
      name: "St. Mary's Hospital",
      relationship: "Hospital",
      phone: "+1 (555) 234-5678",
      priority: 2,
      lastContacted: "Never",
      status: "24/7 Available",
    },
  ]

  const userName = user?.name || "User"

  const [editingContact, setEditingContact] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    relationship: "",
    phone: "",
    priority: 1,
  })

  const handleEditContact = (contact: any) => {
    setEditingContact(contact.id)
    setEditForm({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      priority: contact.priority,
    })
  }

  const handleSaveContact = () => {
    // Here you would typically save to backend
    console.log("Saving contact:", editForm)
    setEditingContact(null)
    // In a real app, you'd update the contacts array
  }

  const handleCancelEdit = () => {
    setEditingContact(null)
    setEditForm({ name: "", relationship: "", phone: "", priority: 1 })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Emergency Contacts</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-600">{contacts.length}</p>
                <p className="text-sm text-gray-600">Active Contacts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{"< 30s"}</p>
                <p className="text-sm text-gray-600">Average Response Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Primary Contacts for {userName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                {editingContact === contact.id ? (
                  // Edit mode
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="px-3 py-2 border rounded-md"
                        placeholder="Name"
                      />
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="px-3 py-2 border rounded-md"
                        placeholder="Phone"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={editForm.relationship}
                        onChange={(e) => setEditForm({ ...editForm, relationship: e.target.value })}
                        className="px-3 py-2 border rounded-md"
                      >
                        <option value="spouse">Spouse</option>
                        <option value="parent">Parent</option>
                        <option value="child">Child</option>
                        <option value="sibling">Sibling</option>
                        <option value="doctor">Doctor</option>
                        <option value="emergency">Emergency</option>
                        <option value="other">Other</option>
                      </select>
                      <select
                        value={editForm.priority}
                        onChange={(e) => setEditForm({ ...editForm, priority: Number.parseInt(e.target.value) })}
                        className="px-3 py-2 border rounded-md"
                      >
                        <option value={1}>Priority 1 (Highest)</option>
                        <option value={2}>Priority 2</option>
                        <option value={3}>Priority 3</option>
                        <option value={4}>Priority 4</option>
                        <option value={5}>Priority 5 (Lowest)</option>
                      </select>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleSaveContact} size="sm" className="bg-green-600 hover:bg-green-700">
                        Save
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {contact.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{contact.name}</h3>
                        <p className="text-sm text-gray-500">{contact.relationship}</p>
                        <p className="text-sm text-gray-700">{contact.phone}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500">Priority: {contact.priority}</span>
                          <span className="text-xs text-green-600">● {contact.status}</span>
                          <span className="text-xs text-gray-500">Last: {contact.lastContacted}</span>
                        </div>
                      </div>
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
                      <Button variant="ghost" size="sm" onClick={() => handleEditContact(contact)}>
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                    </div>
                  </>
                )}
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
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <h4 className="font-medium text-green-800">Auto-call Emergency Services</h4>
                <p className="text-sm text-green-600">Automatically call 911 if critical emergency detected</p>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">Enabled</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <h4 className="font-medium text-green-800">WhatsApp Notifications</h4>
                <p className="text-sm text-green-600">Send alerts via WhatsApp to emergency contacts</p>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">Enabled</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <h4 className="font-medium text-green-800">AI Voice Assistant</h4>
                <p className="text-sm text-green-600">Use AI voice to communicate with emergency services</p>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">Enabled</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
