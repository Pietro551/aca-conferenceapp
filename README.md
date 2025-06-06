# 🏙️ South Moravia Conference Booking App

A modern web application for browsing and booking conference rooms and venues across the city in South Moravia. Built for convenience, performance, and a polished user experience.

## ✨ Project Overview

This app enables users to:
- Discover available conference venues in South Moravian cities
- View availability and venue details
- Book time slots online
- Manage reservations

Target users: small to mid-size businesses, event organizers, public institutions.

Tech stack:  
- Frontend: React + TailwindCSS (planned)
- Backend: Python FastAPI ✅ (implemented)
- Database: PostgreSQL ✅ (implemented)
- Hosting: Azure (planned)



## 🚧 Project Status

🟢 Development completed:
- ✅ Backend API (FastAPI) - Complete with authentication, venue management, and booking system
- ✅ Frontend (React + TailwindCSS) - Complete with responsive design and full feature set
- 🟡 Database deployment - Planned
- 🟡 Production deployment - Planned

## 🗺️ Roadmap (Q3-Q4 2025)

- [x] ✅ Backend API (FastAPI) - Complete with authentication, venue management, and booking system
- [x] ✅ Database schema design and models
- [x] ✅ User authentication and authorization
- [x] ✅ Venue search and filtering
- [x] ✅ Booking management system
- [x] ✅ Admin dashboard endpoints
- [x] ✅ Frontend (React + TailwindCSS) - Complete with responsive design and full feature set
- [ ] 🟡 Database deployment - Planned  
- [ ] 🟡 Production deployment - Planned

## 🚀 Getting Started

### Backend Setup (FastAPI)

The backend is fully implemented and ready to use:

```powershell
cd backend
.\quickstart.ps1
```

Or manually:

```powershell
cd backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp ..\.env.example .env
# Edit .env with your PostgreSQL credentials
python init_db.py
python start.py
```

**API Documentation**: http://localhost:8000/docs

### Frontend Setup (React + TailwindCSS)

The frontend is fully implemented and ready to use:

1. **Install Node.js** (if not already installed):
   - Download from [nodejs.org](https://nodejs.org/)
   - Or use Chocolatey: `choco install nodejs`

2. **Start the frontend**:
```powershell
cd frontend
npm install
npm start
```

**Frontend Application**: http://localhost:3000

### Frontend Setup (Coming Soon)

Frontend implementation with React + TailwindCSS is planned.

## 🤝 Contributing

We're currently in planning. Contributions are welcome once the MVP skeleton is ready.

## 📄 License

MIT License

