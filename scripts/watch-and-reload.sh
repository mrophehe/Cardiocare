#!/bin/bash

echo "👀 Starting CSV file watcher..."
echo "This will automatically reload data when CSV files change."
echo "Press Ctrl+C to stop."

cd backend

# Activate virtual environment
source venv/bin/activate

# Start the CSV file watcher
python manage.py watch_csv_changes --data-dir ../mock-data
