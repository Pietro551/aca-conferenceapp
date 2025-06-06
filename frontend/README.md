# 🎨 South Moravia Conference Booking - Frontend

A modern React TypeScript frontend for the South Moravia Conference Booking platform, built with TailwindCSS for a beautiful and responsive user experience.

## ✨ Features

### 🏠 Public Features
- **Landing Page**: Beautiful hero section with platform overview
- **Venue Discovery**: Browse and search conference venues across South Moravian cities
- **Advanced Filtering**: Filter by city, capacity, price range, and amenities
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 👤 User Features
- **Authentication**: Secure login and registration system
- **Booking Management**: Create, view, and cancel venue bookings
- **Real-time Availability**: Check venue availability in real-time
- **Cost Calculation**: Automatic pricing based on duration and hourly rates
- **Personal Dashboard**: View upcoming and past bookings

### 🔧 Admin Features
- **Admin Dashboard**: Comprehensive management interface
- **Booking Management**: Confirm or cancel user bookings
- **Venue Management**: View and manage all venues (editing coming soon)
- **User Management**: View and deactivate user accounts

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS with custom design system
- **Routing**: React Router DOM v6
- **State Management**: React Query for server state
- **Forms**: React Hook Form with validation
- **HTTP Client**: Axios with interceptors
- **Notifications**: React Toastify
- **Date Handling**: Date-fns utility library

## 🏗️ Architecture

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── VenueCard.tsx
│   │   ├── BookingCard.tsx
│   │   ├── BookingModal.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/            # Page components
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── VenuesPage.tsx
│   │   ├── BookingsPage.tsx
│   │   └── AdminPage.tsx
│   ├── hooks/            # Custom React hooks
│   │   └── useAuth.tsx
│   ├── services/         # API services
│   │   └── api.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/            # Utility functions
│   │   └── index.ts
│   ├── App.tsx           # Main application component
│   ├── index.tsx         # Application entry point
│   └── index.css         # Global styles and Tailwind imports
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # TailwindCSS configuration
├── tsconfig.json         # TypeScript configuration
└── postcss.config.js     # PostCSS configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API running on `http://localhost:8000`

### Installation

1. **Install Node.js** (if not already installed):
   - Download from [nodejs.org](https://nodejs.org/)
   - Or use a package manager like Chocolatey: `choco install nodejs`

2. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

4. **Open your browser**:
   - Navigate to `http://localhost:3000`
   - The app should reload automatically when you make changes

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (⚠️ irreversible)

## 🎨 Design System

### Colors
- **Primary**: Blue tones (#3b82f6, #2563eb, #1d4ed8)
- **Success**: Green tones (#22c55e, #16a34a)
- **Warning**: Amber tones (#f59e0b, #d97706)
- **Danger**: Red tones (#ef4444, #dc2626)

### Components
- **Buttons**: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-success`, `.btn-danger`
- **Forms**: `.form-input`, `.form-label`
- **Cards**: `.card`, `.card-header`, `.card-body`

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

## 🔗 API Integration

The frontend communicates with the FastAPI backend through:

- **Base URL**: `http://localhost:8000/api/v1`
- **Authentication**: JWT Bearer tokens
- **Error Handling**: Automatic token refresh and error notifications
- **Request/Response**: TypeScript interfaces for type safety

### Key Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /venues` - List venues with filters
- `GET /venues/{id}/availability` - Check availability
- `POST /bookings` - Create booking
- `GET /bookings` - User bookings
- `GET /bookings/all` - All bookings (admin)

## 🛡️ Security

- **Authentication**: JWT tokens stored in localStorage
- **Route Protection**: Protected routes for authenticated users
- **Admin Routes**: Additional protection for admin-only features
- **Form Validation**: Client-side validation with react-hook-form
- **XSS Protection**: React's built-in XSS protection

## 📱 Responsive Design

- **Mobile First**: Designed with mobile devices as the primary target
- **Breakpoints**: 
  - `sm`: 640px (tablet)
  - `md`: 768px (small desktop)
  - `lg`: 1024px (large desktop)
  - `xl`: 1280px (extra large)

## 🚀 Future Enhancements

- [ ] **Dark Mode**: Theme switching capability
- [ ] **Offline Support**: PWA with service workers
- [ ] **Push Notifications**: Booking reminders and updates
- [ ] **Calendar Integration**: Export bookings to calendar apps
- [ ] **Advanced Search**: Map-based venue discovery
- [ ] **Payment Integration**: Online payment processing
- [ ] **Multi-language**: Internationalization support

## 🐛 Known Issues

- Venue editing modal not yet implemented (admin feature)
- Time zone handling for bookings
- Limited file upload support for venue images

## 📄 License

This project is part of the South Moravia Conference Booking App and follows the same MIT License as the main project.
