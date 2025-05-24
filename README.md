# CardioCare - AI Health Monitoring App
> **AI-powered health monitoring system with real-time emergency detection and automatic ambulance calling**

## 🚀 Live Demo

**Frontend**: [Deploy to Vercel](https://vercel.com/new/clone?repository-url=https://github.com/your-username/cardiocare)
**Backend**: [Deploy to Railway](https://railway.app/new/template/cardiocare-backend)

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

### **Option 1: Docker Compose (Recommended)**

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/cardiocare.git
cd cardiocare

# Copy environment files
cp .env.local.example .env.local
cp backend/.env.example backend/.env

# Edit environment files with your API keys
# nano .env.local
# nano backend/.env

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# Admin: http://localhost:8000/admin
\`\`\`

### **Option 2: Manual Setup**

#### **Frontend Setup**
\`\`\`bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
# Edit .env.local with your backend URL

# Start development server
npm run dev
\`\`\`

#### **Backend Setup**
\`\`\`bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your API keys

# Setup database
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

# Start Django server
python manage.py runserver

# Start Celery worker (in another terminal)
celery -A cardiocare worker -l info
\`\`\`

## 🔧 Environment Variables

### **Frontend (.env.local)**
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
\`\`\`

### **Backend (.env)**
\`\`\`env
SECRET_KEY=your-secret-key-here
DEBUG=True

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cardiocare

# Google Fit OAuth
GOOGLE_OAUTH2_CLIENT_ID=your-google-client-id
GOOGLE_OAUTH2_CLIENT_SECRET=your-google-client-secret

# Twilio (WhatsApp & Voice)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token

# OpenRouter AI
OPENROUTER_API_KEY=your-openrouter-api-key

# Redis
REDIS_URL=redis://localhost:6379/0
\`\`\`

## 📋 API Documentation

### **Authentication Endpoints**
\`\`\`
POST /api/auth/google-fit/          # Initiate Google Fit OAuth
POST /api/auth/google-fit/callback/ # Complete Google Fit OAuth
POST /api/auth/apple-health/        # Initiate Apple Health auth
GET  /api/auth/profile/             # Get user profile
GET  /api/auth/health/              # Health check
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

## 🚀 Deployment

### **Frontend (Vercel)**
\`\`\`bash
# Deploy to Vercel
npm run build
vercel --prod

# Or use the Vercel button above
\`\`\`

### **Backend (Railway/Heroku)**

#### **Railway Deployment**
\`\`\`bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway add postgresql redis
railway deploy
\`\`\`

#### **Heroku Deployment**
\`\`\`bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create cardiocare-backend

# Add addons
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create heroku-redis:hobby-dev

# Set environment variables
heroku config:set SECRET_KEY=your-secret-key
heroku config:set OPENROUTER_API_KEY=your-openrouter-key
heroku config:set TWILIO_ACCOUNT_SID=your-twilio-sid
heroku config:set TWILIO_AUTH_TOKEN=your-twilio-token

# Deploy
git subtree push --prefix backend heroku main

# Run migrations
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
\`\`\`

### **Docker Production**
\`\`\`bash
# Build and run production containers
docker-compose -f docker-compose.prod.yml up --build -d
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

## 🧪 Testing

### **Frontend Tests**
\`\`\`bash
npm run test
npm run test:e2e
\`\`\`

### **Backend Tests**
\`\`\`bash
cd backend
python manage.py test
\`\`\`

## 📊 Monitoring

### **Health Checks**
- Frontend: `http://localhost:3000/api/health`
- Backend: `http://localhost:8000/api/auth/health/`

### **Logs**
\`\`\`bash
# Docker logs
docker-compose logs -f

# Individual service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f celery
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenRouter** - For providing access to advanced AI models
- **Twilio** - For reliable communication infrastructure
- **Google & Apple** - For health data integration APIs
- **Vercel** - For seamless frontend deployment
- **Railway** - For backend hosting and deployment
