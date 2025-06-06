@echo off
REM South Moravia Conference Booking - Frontend Setup Script

echo 🎨 Setting up South Moravia Conference Booking Frontend...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed.
    echo Please install Node.js from https://nodejs.org/ or use:
    echo   choco install nodejs
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% equ 0 (
    echo ✅ Dependencies installed successfully!
) else (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 🎉 Frontend setup complete!
echo.
echo 🚀 To start the development server:
echo    npm start
echo.
echo 📖 The frontend will be available at:
echo    http://localhost:3000
echo.
echo 🔗 Make sure the backend is running at:
echo    http://localhost:8000
echo.
echo 📝 Demo credentials:
echo    Admin: admin@example.com / password123
echo    User: user@example.com / password123
echo.
pause
