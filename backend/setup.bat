@echo off
echo Setting up South Moravia Conference Booking Backend...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Check if .env file exists
if not exist ".env" (
    echo Creating .env file from template...
    copy ..\.env.example .env
    echo.
    echo Please edit .env file with your database credentials before running the application
    echo.
)

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Edit .env file with your PostgreSQL database credentials
echo 2. Create PostgreSQL database: conference_booking
echo 3. Run: python init_db.py (to initialize database)
echo 4. Run: python start.py (to start the server)
echo.
pause
