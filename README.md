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

### 💬 **Health History Assistant**
- **AI Chatbot** - Interactive conversation about medical history
- **Document Upload** - Upload prescriptions, lab reports, medical records
- **Contextual Analysis** - AI provides insights based on complete health profile
- **Medical Timeline** - Track health events and medication changes

### 🔄 **Dynamic Data Management**
- **CSV-Based Data System** - All mock data stored in editable CSV files
- **Real-time Sync** - Changes to CSV files automatically update the app
- **File Watcher** - Automatic detection and loading of CSV changes
- **Bidirectional Export** - Export current database state back to CSV

## 🏗️ Architecture

### **Frontend (React/Next.js)**
\`\`\`
├── 🎨 Modern React UI with Tailwind CSS
├── 📊 Real-time ECG visualization with Canvas API
├── 🔄 Live health data updates every 5 seconds
├── 📱 Responsive design for all devices
├── 🚨 Emergency alert system with countdown
└── 💬 AI health history chatbot interface
\`\`\`

### **Backend (Django)**
\`\`\`
├── 🔐 OAuth integration with Google Fit & Apple Health
├── 🤖 OpenRouter AI for health analysis
├── 📞 Twilio integration for WhatsApp & voice calls
├── 🗄️ PostgreSQL database for health data storage
├── ⚡ Celery for background AI processing
├── 🔄 Redis for real-time data caching
├── 📊 Dynamic CSV data management system
└── 👀 File watcher for automatic data sync
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
- **Data Management**: Dynamic CSV system with file watching
- **File Monitoring**: Watchdog for real-time file changes

### **External APIs**
- **OpenRouter AI** - Health data analysis and emergency prediction
- **Google Fit API** - Android health data integration
- **Apple HealthKit** - iOS health data integration
- **Twilio API** - WhatsApp messaging and voice calls
- **Google OAuth 2.0** - Secure authentication

## 🚀 Quick Start

### **Option 1: Automated Setup (Recommended)**

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/cardiocare.git
cd cardiocare

# Run automated setup script
chmod +x scripts/dev-setup.sh
./scripts/dev-setup.sh

# Start the backend
cd backend && source venv/bin/activate && python manage.py runserver

# Start the frontend (in another terminal)
npm run dev

# Start CSV file watcher (optional, in another terminal)
chmod +x scripts/watch-and-reload.sh
./scripts/watch-and-reload.sh
\`\`\`

### **Option 2: Docker Compose**

\`\`\`bash
# Clone and start with Docker
git clone https://github.com/your-username/cardiocare.git
cd cardiocare

# Copy environment files
cp .env.local.example .env.local
cp backend/.env.example backend/.env

# Start all services
docker-compose up --build

# Load mock data
docker-compose exec backend python manage.py load_mock_data --sync-mode

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# Admin: http://localhost:8000/admin
\`\`\`

### **Option 3: Manual Setup**

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

# Load mock data with sync mode
python manage.py load_mock_data --sync-mode

# Start Django server
python manage.py runserver

# Start Celery worker (in another terminal)
celery -A cardiocare worker -l info
\`\`\`

## 📊 Dynamic Mock Data Management

### **CSV File Structure**
All mock data is stored in CSV files in the `mock-data/` directory:

- **users.csv** - User accounts and profiles
- **emergency_contacts.csv** - Emergency contact information
- **health_data.csv** - Health metrics (heart rate, blood pressure, etc.)
- **ecg_readings.csv** - ECG waveform data
- **ai_analyses.csv** - AI analysis results
- **health_alerts.csv** - Health alerts and notifications
- **emergency_responses.csv** - Emergency response logs
- **health_history_messages.csv** - Chat conversation history

### **Real-time Data Sync**

#### **Manual Data Loading**
\`\`\`bash
# Load all CSV data (create new, skip existing)
python manage.py load_mock_data

# Sync mode (add new, update existing, remove deleted)
python manage.py load_mock_data --sync-mode

# Clear existing data and reload
python manage.py load_mock_data --clear-existing

# Load from custom directory
python manage.py load_mock_data --data-dir /path/to/csv/files
\`\`\`

#### **Automatic File Watching**
\`\`\`bash
# Start file watcher for automatic sync
python manage.py watch_csv_changes

# Watch custom directory
python manage.py watch_csv_changes --data-dir /path/to/csv/files

# Or use the convenience script
./scripts/watch-and-reload.sh
\`\`\`

#### **Export Current Data**
\`\`\`bash
# Export current database to CSV files
python manage.py export_to_csv

# Export to custom directory
python manage.py export_to_csv --output-dir /path/to/export
\`\`\`

### **How It Works**

1. **Edit CSV Files**: Modify any CSV file in the `mock-data/` directory
2. **Automatic Detection**: File watcher detects changes within 2 seconds
3. **Smart Sync**: System adds new records, updates existing ones, removes deleted ones
4. **App Updates**: Frontend automatically reflects the changes on next API call
5. **No Restart Required**: Changes appear without restarting the server

### **Example: Adding a New User**

1. Edit `mock-data/users.csv`:
\`\`\`csv
id,email,name,first_name,last_name,provider,provider_id,date_of_birth,gender,height,weight,emergency_auto_call,emergency_whatsapp,emergency_ai_voice,created_at
4,new.user@example.com,New User,New,User,google_fit,google_999999,1995-01-01,male,175.0,70.0,true,true,true,2024-01-05T10:00:00Z
\`\`\`

2. **If file watcher is running**: Data automatically syncs within 2 seconds
3. **If file watcher is not running**: Run `python manage.py load_mock_data --sync-mode`
4. **Result**: New user appears in the app immediately

### **Example: Modifying Health Data**

1. Edit `mock-data/health_data.csv` to change heart rate:
\`\`\`csv
1,1,heart_rate,"{""bpm"": 95}",bpm,google_fit,2024-01-24T14:30:00Z,2024-01-24T14:30:00Z
\`\`\`

2. **Result**: Heart rate in the app updates from 89 to 95 BPM

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
GET  /api/health/history/messages/  # Get health history chat messages
POST /api/health/history/send/      # Send health history message
\`\`\`

### **Emergency Endpoints**
\`\`\`
POST /api/emergency/alert/          # Trigger emergency alert
GET  /api/emergency/contacts/       # Get emergency contacts
POST /api/emergency/contacts/add/   # Add emergency contact
POST /api/emergency/contacts/<id>/update/ # Update emergency contact
\`\`\`

### **Data Management Endpoints**
\`\`\`
POST /api/data/reload/              # Manually reload CSV data
GET  /api/data/status/              # Get data sync status
POST /api/data/export/              # Export current data to CSV
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

# Load mock data
railway run python manage.py load_mock_data --sync-mode
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

# Run migrations and load data
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
heroku run python manage.py load_mock_data --sync-mode
\`\`\`

### **Docker Production**
\`\`\`bash
# Build and run production containers
docker-compose -f docker-compose.prod.yml up --build -d

# Load mock data
docker-compose exec backend python manage.py load_mock_data --sync-mode
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

### **Health History**
- AI chatbot interface for medical history
- Document upload for prescriptions and reports
- Contextual AI responses based on medical conditions
- Real-time conversation with health insights

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

### **CSV Data Testing**
\`\`\`bash
# Test data loading
python manage.py load_mock_data --sync-mode

# Test file watching
python manage.py watch_csv_changes &
echo "Modifying CSV file..."
echo "4,test@example.com,Test User,Test,User,google_fit,test_123,1990-01-01,male,170.0,70.0,true,true,true,2024-01-01T00:00:00Z" >> mock-data/users.csv

# Test export functionality
python manage.py export_to_csv --output-dir test-export

# Verify data in Django admin
python manage.py runserver
# Visit http://localhost:8000/admin
\`\`\`

## 📊 Monitoring

### **Health Checks**
- Frontend: `http://localhost:3000/api/health`
- Backend: `http://localhost:8000/api/auth/health/`

### **Data Sync Status**
\`\`\`bash
# Check file watcher status
ps aux | grep watch_csv_changes

# Check last data sync
python manage.py shell -c "
from django.core.cache import cache
print('Last sync:', cache.get('last_csv_sync', 'Never'))
"
\`\`\`

### **Logs**
\`\`\`bash
# Docker logs
docker-compose logs -f

# Individual service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f celery

# File watcher logs
tail -f logs/csv_watcher.log
\`\`\`

### **Database Monitoring**
\`\`\`bash
# Check data integrity
python manage.py shell -c "
from accounts.models import User
from health_monitoring.models import HealthData
print(f'Users: {User.objects.count()}')
print(f'Health Data: {HealthData.objects.count()}')
"

# Compare with CSV files
wc -l mock-data/*.csv
\`\`\`

## 🔄 Development Workflow

### **Making Data Changes**

1. **Edit CSV Files**: Modify any file in `mock-data/`
2. **Automatic Sync**: File watcher detects changes
3. **Verify Changes**: Check Django admin or API responses
4. **Test Frontend**: Refresh app to see updates

### **Adding New Features**

1. **Update CSV Structure**: Add new columns if needed
2. **Update Models**: Modify Django models
3. **Create Migrations**: `python manage.py makemigrations`
4. **Update Load Script**: Modify `load_mock_data.py`
5. **Test Sync**: Run `python manage.py load_mock_data --sync-mode`

### **Debugging Data Issues**

\`\`\`bash
# Check CSV file format
python -c "
import csv
with open('mock-data/users.csv', 'r') as f:
    reader = csv.DictReader(f)
    for i, row in enumerate(reader):
        if i < 3:  # Show first 3 rows
            print(f'Row {i+1}: {row}')
"

# Validate JSON fields
python -c "
import csv, json
with open('mock-data/health_data.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        try:
            json.loads(row['value'])
        except json.JSONDecodeError as e:
            print(f'Invalid JSON in row {row[\"id\"]}: {e}')
"

# Check for missing references
python manage.py shell -c "
from health_monitoring.models import HealthData
from accounts.models import User
orphaned = HealthData.objects.exclude(user__in=User.objects.all())
print(f'Orphaned health data records: {orphaned.count()}')
"
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Update mock data in CSV files if needed
4. Add corresponding backend endpoints
5. Test with `python manage.py load_mock_data --sync-mode`
6. Test file watching with `python manage.py watch_csv_changes`
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

### **CSV Data Guidelines**

- **Maintain ID consistency**: Don't reuse IDs across different records
- **Use proper JSON format**: Escape quotes in JSON fields
- **Follow date format**: Use ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)
- **Validate relationships**: Ensure foreign key references exist
- **Test changes**: Always run sync after modifying CSV files

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenRouter** - For providing access to advanced AI models
- **Twilio** - For reliable communication infrastructure
- **Google & Apple** - For health data integration APIs
- **Vercel** - For seamless frontend deployment
- **Railway** - For backend hosting and deployment
- **Watchdog** - For file system monitoring capabilities

---

## 🎯 Key Features Summary

✅ **Dynamic CSV Data Management** - Edit CSV files and see changes instantly  
✅ **Real-time File Watching** - Automatic detection and sync of CSV changes  
✅ **Bidirectional Data Flow** - Import from CSV and export to CSV  
✅ **Smart Sync Logic** - Add new, update existing, remove deleted records  
✅ **Complete Backend API** - Every frontend feature has a corresponding endpoint  
✅ **Production Ready** - Docker, deployment scripts, and monitoring tools  
✅ **Developer Friendly** - Automated setup scripts and comprehensive documentation  

**🚀 Start developing with live data sync in under 5 minutes!**
