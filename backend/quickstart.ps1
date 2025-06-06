# South Moravia Conference Booking - Quick Start Script
# Run this script to set up and start the backend

Write-Host "🏙️ South Moravia Conference Booking Backend Setup" -ForegroundColor Cyan
Write-Host "=" * 60

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python 3.8+ and try again." -ForegroundColor Red
    exit 1
}

# Check if we're in the backend directory
if (-not (Test-Path "app\main.py")) {
    Write-Host "❌ Please run this script from the backend directory" -ForegroundColor Red
    exit 1
}

# Create virtual environment if it doesn't exist
if (-not (Test-Path "venv")) {
    Write-Host "📦 Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "🔧 Activating virtual environment..." -ForegroundColor Yellow
& "venv\Scripts\Activate.ps1"

# Install dependencies
Write-Host "📥 Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚙️ Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item "..\.env.example" ".env"
    Write-Host ""
    Write-Host "⚠️  Please edit .env file with your database credentials!" -ForegroundColor Red
    Write-Host ""
    
    $response = Read-Host "Do you want to open .env file for editing? (y/n)"
    if ($response -eq "y" -or $response -eq "Y") {
        notepad .env
    }
}

Write-Host ""
Write-Host "🎯 Setup Options:" -ForegroundColor Cyan
Write-Host "1. Test basic functionality (no database required)"
Write-Host "2. Initialize database and start server"
Write-Host "3. Just start server (database already set up)"
Write-Host "4. Run development checks"
Write-Host ""

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host "🧪 Running basic API tests..." -ForegroundColor Yellow
        python test_api.py
    }
    "2" {
        Write-Host "🗄️ Initializing database..." -ForegroundColor Yellow
        python init_db.py
        Write-Host ""
        Write-Host "🚀 Starting server..." -ForegroundColor Green
        python start.py
    }
    "3" {
        Write-Host "🚀 Starting server..." -ForegroundColor Green
        python start.py
    }
    "4" {
        Write-Host "🔍 Running development checks..." -ForegroundColor Yellow
        python dev_tools.py
    }
    default {
        Write-Host "Invalid choice. Starting server..." -ForegroundColor Yellow
        python start.py
    }
}

Write-Host ""
Write-Host "📚 Available endpoints after server starts:" -ForegroundColor Cyan
Write-Host "• API Documentation: http://localhost:8000/docs"
Write-Host "• Health Check: http://localhost:8000/health"
Write-Host "• Venues API: http://localhost:8000/api/v1/venues/"
Write-Host ""
