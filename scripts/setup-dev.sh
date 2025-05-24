#!/bin/bash

# Development Setup Script

echo "🛠️  Setting up CardioCare development environment..."

# Frontend setup
echo "📱 Setting up frontend..."
npm install
cp .env.local.example .env.local

# Backend setup
echo "🔧 Setting up backend..."
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Setup database
python manage.py makemigrations
python manage.py migrate

# Create superuser
echo "Creating Django superuser..."
python manage.py createsuperuser

cd ..

echo "✅ Development environment setup complete!"
echo ""
echo "🚀 To start development:"
echo "1. Frontend: npm run dev"
echo "2. Backend: cd backend && python manage.py runserver"
echo "3. Celery: cd backend && celery -A cardiocare worker -l info"
