# CardioCare - AI Health Monitoring App
> **AI-powered health monitoring system with real-time emergency detection and automatic ambulance calling**

## 🚀 Live Demo

**Frontend**: 

## 📱 Features

### 🔐 **Authentication & Data Integration**
- **Google Fit Integration** - Connect Android devices and Google health data
- **Apple Health Integration** - Connect iPhone and Apple Watch data
- **OAuth 2.0 Security** - Secure authentication with health providers

### 📊 **Real-time Health Monitoring**
- **Live ECG Monitoring** - Real-time electrocardiogram visualization
- **Vital Signs Tracking** - Heart rate, blood pressure, SpO2, temperature
- **Continuous Data Sync** - Automatic health data synchronization
- **Historical Analytics** - Track health trends over time

### 🤖 **AI-Powered Analysis**
- **OpenRouter AI Integration** - Advanced health data analysis
- **Emergency Prediction** - AI detects potential health emergencies
- **Risk Assessment** - Real-time health risk evaluation
- **Personalized Recommendations** - AI-generated health advice

### 🚨 **Emergency Response System**
- **Automatic Fall Detection** - Detects when patient becomes unconscious
- **Smart Emergency Calling** - Auto-calls 911 with 30-second countdown
- **AI Voice Assistant** - AI handles emergency calls with medical information
- **WhatsApp Alerts** - Instant notifications to emergency contacts via Twilio
- **GPS Location Sharing** - Automatic location sharing with emergency services

### 📱 **User Interface**
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Real-time Updates** - Live health data visualization
- **Emergency Contacts Management** - Manage and prioritize emergency contacts
- **Alert History** - Track all health alerts and emergency events

## 🏗️ Architecture

### **Frontend (React/Next.js)**
\`\`\`
├── 🎨 Modern React UI with Tailwind CSS
├── 📊 Real-time ECG visualization with Canvas API
├── 🔄 Live health data updates every 5 seconds
├── 📱 Responsive design for all devices
└── 🚨 Emergency alert system with countdown
\`\`\`

### **Backend (Django)**
\`\`\`
├── 🔐 OAuth integration with Google Fit & Apple Health
├── 🤖 OpenRouter AI for health analysis
├── 📞 Twilio integration for WhatsApp & voice calls
├── 🗄️ PostgreSQL database for health data storage
├── ⚡ Celery for background AI processing
└── 🔄 Redis for real-time data caching
\`\`\`

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 14 with App Router
- **UI Library**: React 18 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Custom Canvas-based ECG visualization
- **State Management**: React hooks + localStorage
- **API Client**: Fetch API with custom service layer

### **Backend**
- **Framework**: Django 4.2 with Django REST Framework
- **Database**: PostgreSQL (SQLite for development)
- **Task Queue**: Celery with Redis
- **AI Integration**: OpenRouter API
- **Communications**: Twilio (WhatsApp + Voice)
- **Authentication**: OAuth 2.0 (Google Fit, Apple Health)

### **External APIs**
- **OpenRouter AI** - Health data analysis and emergency prediction
- **Google Fit API** - Android health data integration
- **Apple HealthKit** - iOS health data integration
- **Twilio API** - WhatsApp messaging and voice calls
- **Google OAuth 2.0** - Secure authentication

## 🚀 Quick Start

### **1. Clone the Repository**
\`\`\`bash
git clone https://github.com/your-username/cardiocare.git
cd cardiocare
\`\`\`

### **2. Frontend Setup**
\`\`\`bash
# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local

# Start development server
npm run dev
\`\`\`

### **3. Environment Variables**

**Frontend (.env.local)**
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
\`\`\`

**Backend (.env)**
\`\`\`env
SECRET_KEY=your-secret-key-here
DEBUG=True

# Google Fit OAuth
GOOGLE_OAUTH2_CLIENT_ID=your-google-client-id
GOOGLE_OAUTH2_CLIENT_SECRET=your-google-client-secret

# Twilio (WhatsApp & Voice)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token

# OpenRouter AI
OPENROUTER_API_KEY=your-openrouter-api-key
\`\`\`

## 📋 API Documentation

### **Authentication Endpoints**
\`\`\`
POST /api/auth/google-fit/          # Initiate Google Fit OAuth
POST /api/auth/google-fit/callback/ # Complete Google Fit OAuth
POST /api/auth/apple-health/        # Initiate Apple Health auth
GET  /api/auth/profile/             # Get user profile
\`\`\`

### **Health Data Endpoints**
\`\`\`
GET  /api/health/current-metrics/   # Get current health metrics
POST /api/health/ecg/submit/        # Submit ECG data for analysis
GET  /api/health/analysis/          # Get AI health analysis
POST /api/health/sync/google-fit/   # Sync Google Fit data
GET  /api/health/alerts/            # Get health alerts
\`\`\`

### **Emergency Endpoints**
\`\`\`
POST /api/emergency/alert/          # Trigger emergency alert
GET  /api/emergency/contacts/       # Get emergency contacts
POST /api/emergency/contacts/       # Add emergency contact
\`\`\`

## 🔧 Configuration

### **Google Fit Setup**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Fit API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `http://localhost:3000/auth/google/callback`

### **Twilio Setup**
1. Sign up at [Twilio](https://www.twilio.com/)
2. Get Account SID and Auth Token
3. Enable WhatsApp sandbox for testing
4. Configure webhook URLs for voice calls

### **OpenRouter AI Setup**
1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Get API key
3. Configure model preferences (Claude, GPT-4, etc.)

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## 🚨 Emergency System Flow

\`\`\`mermaid
graph TD
    A[Health Data Monitoring] --> B{AI Analysis}
    B -->|High Risk| C[Emergency Detected]
    C --> D[30s Countdown Timer]
    D --> E{User Response?}
    E -->|No Response| F[Auto-call 911]
    E -->|Cancel| G[Alert Cancelled]
    F --> H[AI Voice Assistant]
    H --> I[Provide Medical Info]
    I --> J[Ambulance Dispatched]
    C --> K[WhatsApp Alerts]
    K --> L[Emergency Contacts]
\`\`\`

## 📱 Screenshots

### **Login Screen**
- Google Fit and Apple Health integration options
- Real-time backend connection status
- Security and privacy information

### **Dashboard**
- Live ECG monitoring with real-time waveform
- Health metrics cards (heart rate, blood pressure, SpO2, temperature)
- AI analysis with confidence scores and recommendations
- Emergency alert system with countdown timer

### **Emergency Alert**
- Fall detection notification
- Automatic ambulance calling with countdown
- AI voice assistant conversation with 911
- Real-time location sharing and medical information

## 🔒 Security & Privacy

- **End-to-End Encryption** - All health data encrypted in transit and at rest
- **OAuth 2.0 Authentication** - Secure authentication with health providers
- **HIPAA Compliance Ready** - Designed with healthcare privacy standards
- **No Data Selling** - Your health data is never sold or shared
- **Local Processing** - Sensitive data processed locally when possible

# Set environment variables in Vercel dashboard
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api

## 🙏 Acknowledgments

- **OpenRouter** - For providing access to advanced AI models
- **Twilio** - For reliable communication infrastructure
- **Google & Apple** - For health data integration APIs
- **Vercel** - For seamless frontend deployment
