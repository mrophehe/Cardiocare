#!/bin/bash

echo "🚀 Setting up CardioCare development environment..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

# Backend setup
echo "📦 Setting up Django backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "📝 Created .env file. Please edit it with your API keys."
fi

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Load mock data
echo "📊 Loading mock data..."
python manage.py load_mock_data --sync-mode

# Create superuser if it doesn't exist
echo "👤 Creating superuser (skip if already exists)..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(is_superuser=True).exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superuser created: admin/admin123')
else:
    print('Superuser already exists')
"

cd ..

# Frontend setup
echo "🎨 Setting up Next.js frontend..."
npm install

# Copy environment file if it doesn't exist
if [ ! -f ".env.local" ]; then
    cp .env.local.example .env.local
    echo "📝 Created .env.local file."
fi

echo "✅ Development environment setup complete!"
echo ""
echo "🚀 To start the application:"
echo "1. Start the backend:"
echo "   cd backend && source venv/bin/activate && python manage.py runserver"
echo ""
echo "2. Start the frontend (in another terminal):"
echo "   npm run dev"
echo ""
echo "3. Start CSV file watcher (optional, in another terminal):"
echo "   cd backend && source venv/bin/activate && python manage.py watch_csv_changes"
echo ""
echo "📱 Access the app at: http://localhost:3000"
echo "🔧 Django admin at: http://localhost:8000/admin (admin/admin123)"
