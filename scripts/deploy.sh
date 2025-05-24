#!/bin/bash

# CardioCare Deployment Script

echo "🚀 Starting CardioCare deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment files if they don't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating frontend environment file..."
    cp .env.local.example .env.local
    echo "⚠️  Please edit .env.local with your configuration"
fi

if [ ! -f backend/.env ]; then
    echo "📝 Creating backend environment file..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please edit backend/.env with your API keys"
fi

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose exec backend python manage.py migrate

# Create superuser (optional)
echo "👤 Creating Django superuser..."
docker-compose exec backend python manage.py createsuperuser --noinput --email admin@cardiocare.com --username admin || true

# Check service health
echo "🔍 Checking service health..."
curl -f http://localhost:3000 > /dev/null 2>&1 && echo "✅ Frontend is running" || echo "❌ Frontend failed to start"
curl -f http://localhost:8000/api/auth/health/ > /dev/null 2>&1 && echo "✅ Backend is running" || echo "❌ Backend failed to start"

echo "🎉 Deployment complete!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8000"
echo "👨‍💼 Admin: http://localhost:8000/admin"
echo ""
echo "📋 Next steps:"
echo "1. Configure your API keys in backend/.env"
echo "2. Set up Google Fit OAuth credentials"
echo "3. Configure Twilio for WhatsApp notifications"
echo "4. Add OpenRouter API key for AI analysis"
