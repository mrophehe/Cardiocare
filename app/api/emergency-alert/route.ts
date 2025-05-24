import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { emergencyType, patientData, location } = await request.json()

    // In a real implementation, you would use Twilio here
    console.log("Sending emergency alert via Twilio:", {
      emergencyType,
      patientData,
      location,
    })

    // Simulate sending WhatsApp messages to emergency contacts
    const contacts = [
      { name: "Dr. Sarah Johnson", phone: "+1555123456" },
      { name: "Jane Doe", phone: "+1555987654" },
    ]

    const notifications = contacts.map((contact) => ({
      to: contact.phone,
      message: `EMERGENCY ALERT: ${patientData.name} has experienced a ${emergencyType}. Location: ${location}. Please respond immediately.`,
      status: "sent",
    }))

    return NextResponse.json({
      success: true,
      notifications,
      emergencyCallInitiated: true,
    })
  } catch (error) {
    console.error("Error sending emergency alert:", error)
    return NextResponse.json({ error: "Failed to send emergency alert" }, { status: 500 })
  }
}
