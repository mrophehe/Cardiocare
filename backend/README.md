# CardioCare Django Backend

This is the Django backend for the CardioCare AI health monitoring application.

## 🚀 Quick Setup

### 1. Install Dependencies
\`\`\`bash
cd backend
pip install -r requirements.txt
\`\`\`

### 2. Environment Variables
\`\`\`bash
cp .env.example .env
# Edit .env with your API keys
\`\`\`

### 3. Database Setup
\`\`\`bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser  # Optional
\`\`\`

### 4. Start Development Server
\`\`\`bash
python manage.py runserver
\`\`\`

### 5. Start Celery Worker (for AI analysis)
\`\`\`bash
# In a new terminal
celery -A cardiocare worker -l info
\`\`\`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/google-fit/` - Initiate Google Fit OAuth
- `POST /api/auth/google-fit/callback/` - Complete Google Fit OAuth
- `POST /api/auth/apple-health/` - Initiate Apple Health auth
- `GET /api/auth/profile/` - Get user profile

### Health Data
- `GET /api/health/current-metrics/` - Get current health metrics
- `POST /api/health/ecg/submit/` - Submit ECG data for analysis
- `GET /api/health/analysis/` - Get AI health analysis
- `POST /api/health/sync/google-fit/` - Sync Google Fit data
- `GET /api/health/alerts/` - Get health alerts

### Emergency System
- `POST /api/emergency/alert/` - Trigger emergency alert
- `GET /api/emergency/contacts/` - Get emergency contacts

## 🔧 Configuration

### Required Environment Variables
\`\`\`env
SECRET_KEY=your-django-secret-key
OPENROUTER_API_KEY=your-openrouter-api-key
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
GOOGLE_OAUTH2_CLIENT_ID=your-google-oauth-client-id
GOOGLE_OAUTH2_CLIENT_SECRET=your-google-oauth-client-secret
\`\`\`

## 🏗️ Architecture

- **Django 4.2** - Web framework
- **Django REST Framework** - API framework
- **Celery** - Background task processing
- **Redis** - Message broker and cache
- **SQLite** - Development database (PostgreSQL for production)
- **OAuth 2.0** - Authentication with health providers

## 📱 Features

- ✅ Google Fit & Apple Health integration
- ✅ Real-time health data processing
- ✅ AI analysis with OpenRouter
- ✅ Emergency detection and alerts
- ✅ Twilio WhatsApp notifications
- ✅ Background task processing
- ✅ Admin interface for data management
\`\`\`

\`\`\`gitignore file="backend/.gitignore"
# Django
*.log
*.pot
*.pyc
__pycache__/
local_settings.py
db.sqlite3
db.sqlite3-journal
media/

# Environment variables
.env

# Virtual environment
venv/
env/
ENV/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Celery
celerybeat-schedule
celerybeat.pid

# Redis
dump.rdb
