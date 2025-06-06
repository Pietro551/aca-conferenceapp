# South Moravia Conference Booking App - Backend

A FastAPI-based backend for the South Moravia Conference Booking application, enabling users to discover, view, and book conference venues across South Moravian cities.

## 🚀 Features

- **User Authentication**: JWT-based authentication with registration and login
- **Venue Management**: CRUD operations for conference venues with search and filtering
- **Booking System**: Create, update, cancel, and manage venue bookings
- **Admin Panel**: Administrative functions for venue and booking management
- **Search & Filter**: Advanced venue search by city, capacity, price range
- **Availability Check**: Real-time venue availability checking
- **Role-based Access**: User and admin role management

## 🛠️ Tech Stack

- **Framework**: FastAPI 0.104.1
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT with python-jose
- **Password Hashing**: Passlib with bcrypt
- **Migrations**: Alembic
- **Server**: Uvicorn ASGI server

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── auth.py      # Authentication endpoints
│   │       │   ├── users.py     # User management
│   │       │   ├── venues.py    # Venue operations
│   │       │   └── bookings.py  # Booking management
│   │       └── api.py           # API router
│   ├── core/
│   │   ├── config.py            # Application settings
│   │   ├── database.py          # Database connection
│   │   └── security.py          # Security utilities
│   ├── crud/
│   │   ├── user.py              # User CRUD operations
│   │   ├── venue.py             # Venue CRUD operations
│   │   └── booking.py           # Booking CRUD operations
│   ├── models/
│   │   └── models.py            # SQLAlchemy models
│   ├── schemas/
│   │   └── schemas.py           # Pydantic schemas
│   └── main.py                  # FastAPI application
├── alembic.ini                  # Alembic configuration
├── init_db.py                   # Database initialization
├── start.py                     # Application startup
└── requirements.txt             # Python dependencies
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- PostgreSQL 12+
- pip (Python package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aca-conferenceapp/backend
   ```

2. **Quick Setup (Windows PowerShell)**
   ```powershell
   .\quickstart.ps1
   ```

3. **Manual Setup**
   ```powershell
   # Create virtual environment
   python -m venv venv
   venv\Scripts\Activate.ps1

   # Install dependencies
   pip install -r requirements.txt

   # Set up environment variables
   cp ..\.env.example .env
   # Edit .env with your database credentials

   # Create PostgreSQL database
   # In PostgreSQL: CREATE DATABASE conference_booking;

   # Initialize database
   python init_db.py

   # Start the application
   python start.py
   ```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

Once the server is running, you can access:

- **Interactive API Docs (Swagger)**: http://localhost:8000/docs
- **Alternative API Docs (ReDoc)**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints:

1. **Register a new user** or **login** to get an access token
2. **Include the token** in the Authorization header: `Bearer <your_token>`

### Default Admin User

After running `init_db.py`, a default admin user is created:
- **Email**: admin@example.com
- **Password**: admin123

**⚠️ Important**: Change the admin password in production!

## 🏢 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/token` - Get access token (OAuth2)
- `POST /api/v1/auth/login` - Login with email/password
- `GET /api/v1/auth/me` - Get current user info

### Users
- `GET /api/v1/users/` - List users (admin only)
- `GET /api/v1/users/{user_id}` - Get user by ID
- `PUT /api/v1/users/{user_id}` - Update user
- `DELETE /api/v1/users/{user_id}` - Deactivate user (admin only)

### Venues
- `GET /api/v1/venues/` - List venues with filtering
- `GET /api/v1/venues/{venue_id}` - Get venue details
- `POST /api/v1/venues/` - Create venue (admin only)
- `PUT /api/v1/venues/{venue_id}` - Update venue (admin only)
- `DELETE /api/v1/venues/{venue_id}` - Delete venue (admin only)
- `GET /api/v1/venues/city/{city}` - Get venues by city
- `GET /api/v1/venues/{venue_id}/availability` - Check availability

### Bookings
- `GET /api/v1/bookings/` - List bookings
- `GET /api/v1/bookings/{booking_id}` - Get booking details
- `POST /api/v1/bookings/` - Create booking
- `PUT /api/v1/bookings/{booking_id}` - Update booking
- `DELETE /api/v1/bookings/{booking_id}` - Cancel booking
- `POST /api/v1/bookings/{booking_id}/confirm` - Confirm booking (admin only)
- `GET /api/v1/bookings/venue/{venue_id}` - Get venue bookings (admin only)

## 🔍 Search & Filtering

### Venue Search Parameters
- `city` - Filter by city name
- `min_capacity` - Minimum venue capacity
- `max_capacity` - Maximum venue capacity
- `min_rate` - Minimum hourly rate
- `max_rate` - Maximum hourly rate

Example:
```
GET /api/v1/venues/?city=Brno&min_capacity=20&max_rate=2000
```

## 📊 Data Models

### User
- ID, email, password, first_name, last_name, phone, company
- is_active, is_admin flags
- Created/updated timestamps

### Venue
- ID, name, description, address, city, postal_code
- Capacity, hourly_rate, amenities, image_url
- Contact information, is_active flag
- Created/updated timestamps

### Booking
- ID, user_id, venue_id, start_datetime, end_datetime
- Total_cost, status (pending/confirmed/cancelled)
- Purpose, notes, created/updated timestamps

## 🔒 Security Features

- **Password Hashing**: Bcrypt hashing for secure password storage
- **JWT Tokens**: Secure token-based authentication
- **CORS**: Configurable Cross-Origin Resource Sharing
- **Input Validation**: Pydantic schema validation
- **Role-based Access**: User and admin permission levels

## 🚀 Deployment

### Environment Variables for Production
```env
DATABASE_URL=postgresql://user:password@host:port/dbname
SECRET_KEY=your-super-secret-key-minimum-32-characters
DEBUG=False
BACKEND_CORS_ORIGINS=["https://yourdomain.com"]
```

### Docker Deployment (Optional)
```dockerfile
FROM python:3.9

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "start.py"]
```

## 🧪 Testing

### Automated Tests
```powershell
# Run basic API tests
python test_api.py

# Or with pytest
python -m pytest test_api.py -v
```

### Development Tools
```powershell
# Check database connection and show sample data
python dev_tools.py test-db

# Test API endpoints
python dev_tools.py test-api

# Run all development checks
python dev_tools.py
```

### API Examples
```powershell
# Run interactive API demonstration
python api_examples.py
```

### Manual Testing
- **Interactive API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **Sample API Call**: `GET http://localhost:8000/api/v1/venues/`

## 📈 Performance Considerations

- Database indexing on frequently queried fields
- Pagination for large result sets
- Connection pooling for database connections
- Query optimization for venue searches

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/docs`
- Review the database schema in `models/models.py`
