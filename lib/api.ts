const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

class APIService {
  private getAuthHeaders() {
    const token = localStorage.getItem("access_token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  // Add connection test method
  async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/health/current-metrics/`, {
        headers: this.getAuthHeaders(),
      })
      return response.ok
    } catch (error) {
      console.error("Backend connection test failed:", error)
      return false
    }
  }

  // Authentication endpoints
  async initiateGoogleFitAuth() {
    const response = await fetch(`${API_BASE_URL}/auth/google-fit/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    })
    return response.json()
  }

  async completeGoogleFitAuth(code: string, state: string) {
    const response = await fetch(`${API_BASE_URL}/auth/google-fit/callback/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ code, state }),
    })
    return response.json()
  }

  async initiateAppleHealthAuth() {
    const response = await fetch(`${API_BASE_URL}/auth/apple-health/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    })
    return response.json()
  }

  async getUserProfile() {
    const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
      headers: this.getAuthHeaders(),
    })
    return response.json()
  }

  // Health data endpoints
  async getCurrentHealthMetrics() {
    const response = await fetch(`${API_BASE_URL}/health/current-metrics/`, {
      headers: this.getAuthHeaders(),
    })
    return response.json()
  }

  async getHealthData(type = "all", days = 7) {
    const response = await fetch(`${API_BASE_URL}/health/data/?type=${type}&days=${days}`, {
      headers: this.getAuthHeaders(),
    })
    return response.json()
  }

  async syncGoogleFitData() {
    const response = await fetch(`${API_BASE_URL}/health/sync/google-fit/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    })
    return response.json()
  }

  async submitECGData(waveformData: number[], heartRate: number) {
    const response = await fetch(`${API_BASE_URL}/health/ecg/submit/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        waveform_data: waveformData,
        heart_rate: heartRate,
      }),
    })
    return response.json()
  }

  async getAIAnalysis() {
    const response = await fetch(`${API_BASE_URL}/health/analysis/`, {
      headers: this.getAuthHeaders(),
    })
    return response.json()
  }

  async getHealthAlerts() {
    const response = await fetch(`${API_BASE_URL}/health/alerts/`, {
      headers: this.getAuthHeaders(),
    })
    return response.json()
  }

  // Health History endpoints
  async getHealthHistoryMessages() {
    const response = await fetch(`${API_BASE_URL}/health/history/messages/`, {
      headers: this.getAuthHeaders(),
    })
    return response.json()
  }

  async sendHealthHistoryMessage(content: string, attachments: any[] = []) {
    const response = await fetch(`${API_BASE_URL}/health/history/send/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        content: content,
        attachments: attachments,
      }),
    })
    return response.json()
  }

  // Emergency endpoints
  async triggerEmergencyAlert(emergencyType: string, patientData: any, location: string) {
    const response = await fetch(`${API_BASE_URL}/emergency/alert/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        emergency_type: emergencyType,
        patient_data: patientData,
        location: location,
      }),
    })
    return response.json()
  }

  async getEmergencyContacts() {
    const response = await fetch(`${API_BASE_URL}/emergency/contacts/`, {
      headers: this.getAuthHeaders(),
    })
    return response.json()
  }

  async addEmergencyContact(contactData: any) {
    const response = await fetch(`${API_BASE_URL}/emergency/contacts/add/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(contactData),
    })
    return response.json()
  }

  async updateEmergencyContact(contactId: number, contactData: any) {
    const response = await fetch(`${API_BASE_URL}/emergency/contacts/${contactId}/update/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(contactData),
    })
    return response.json()
  }
}

export const apiService = new APIService()
