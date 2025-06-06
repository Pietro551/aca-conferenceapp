"""
API Usage Examples for South Moravia Conference Booking App

This file demonstrates how to use the API endpoints with real examples.
Run the server first: python start.py
"""

import httpx
import asyncio
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8000"

class ConferenceBookingAPI:
    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.token = None
        
    async def register_user(self, user_data: dict):
        """Register a new user"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/v1/auth/register",
                json=user_data
            )
            return response
    
    async def login(self, email: str, password: str):
        """Login and get access token"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/v1/auth/token",
                data={"username": email, "password": password}
            )
            if response.status_code == 200:
                token_data = response.json()
                self.token = token_data["access_token"]
                print(f"✅ Logged in successfully!")
                return True
            else:
                print(f"❌ Login failed: {response.text}")
                return False
    
    def _get_headers(self):
        """Get authorization headers"""
        if self.token:
            return {"Authorization": f"Bearer {self.token}"}
        return {}
    
    async def get_venues(self, **filters):
        """Get venues with optional filtering"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/api/v1/venues/",
                params=filters
            )
            return response
    
    async def get_venue(self, venue_id: int):
        """Get specific venue details"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/api/v1/venues/{venue_id}"
            )
            return response
    
    async def check_availability(self, venue_id: int, start_time: str, end_time: str):
        """Check venue availability"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/api/v1/venues/{venue_id}/availability",
                params={"start_datetime": start_time, "end_datetime": end_time}
            )
            return response
    
    async def create_booking(self, booking_data: dict):
        """Create a new booking"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/v1/bookings/",
                json=booking_data,
                headers=self._get_headers()
            )
            return response
    
    async def get_my_bookings(self):
        """Get current user's bookings"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/api/v1/bookings/",
                headers=self._get_headers()
            )
            return response
    
    async def cancel_booking(self, booking_id: int):
        """Cancel a booking"""
        async with httpx.AsyncClient() as client:
            response = await client.delete(
                f"{self.base_url}/api/v1/bookings/{booking_id}",
                headers=self._get_headers()
            )
            return response

async def demo_basic_usage():
    """Demonstrate basic API usage"""
    print("🏙️ South Moravia Conference Booking API Demo")
    print("=" * 50)
    
    api = ConferenceBookingAPI()
    
    # 1. Get venues (no auth required)
    print("\n📍 Getting available venues...")
    response = await api.get_venues()
    if response.status_code == 200:
        venues_data = response.json()
        print(f"Found {venues_data['total']} venues")
        for venue in venues_data['venues'][:3]:  # Show first 3
            print(f"  • {venue['name']} in {venue['city']} (Capacity: {venue['capacity']})")
    else:
        print(f"❌ Failed to get venues: {response.status_code}")
        return
    
    # 2. Get venues in specific city
    print("\n🏙️ Getting venues in Brno...")
    response = await api.get_venues(city="Brno")
    if response.status_code == 200:
        brno_venues = response.json()
        print(f"Found {brno_venues['total']} venues in Brno")
    
    # 3. Filter by capacity and price
    print("\n🔍 Filtering venues (capacity 20-100, max rate 2000 CZK)...")
    response = await api.get_venues(min_capacity=20, max_capacity=100, max_rate=2000)
    if response.status_code == 200:
        filtered_venues = response.json()
        print(f"Found {filtered_venues['total']} venues matching criteria")

async def demo_user_workflow():
    """Demonstrate complete user workflow"""
    print("\n" + "=" * 50)
    print("👤 User Workflow Demo")
    print("=" * 50)
    
    api = ConferenceBookingAPI()
    
    # User registration
    user_data = {
        "email": f"demo.user.{datetime.now().timestamp():.0f}@example.com",
        "password": "demopass123",
        "first_name": "Demo",
        "last_name": "User",
        "company": "Demo Company s.r.o."
    }
    
    print(f"\n📝 Registering user: {user_data['email']}")
    response = await api.register_user(user_data)
    if response.status_code == 200:
        print("✅ User registered successfully!")
    else:
        print(f"❌ Registration failed: {response.status_code} - {response.text}")
        return
    
    # Login
    print(f"\n🔑 Logging in...")
    login_success = await api.login(user_data['email'], user_data['password'])
    if not login_success:
        return
    
    # Get venues and pick one for booking
    response = await api.get_venues()
    if response.status_code == 200:
        venues_data = response.json()
        if venues_data['venues']:
            venue = venues_data['venues'][0]  # Pick first venue
            venue_id = venue['id']
            
            print(f"\n🏢 Selected venue: {venue['name']}")
            
            # Check availability for tomorrow 10-12
            tomorrow = datetime.now() + timedelta(days=1)
            start_time = tomorrow.replace(hour=10, minute=0, second=0, microsecond=0)
            end_time = tomorrow.replace(hour=12, minute=0, second=0, microsecond=0)
            
            start_iso = start_time.isoformat()
            end_iso = end_time.isoformat()
            
            print(f"🔍 Checking availability for {start_time.strftime('%Y-%m-%d %H:%M')} - {end_time.strftime('%H:%M')}")
            response = await api.check_availability(venue_id, start_iso, end_iso)
            if response.status_code == 200:
                availability = response.json()
                if availability['available']:
                    print("✅ Venue is available!")
                    
                    # Create booking
                    booking_data = {
                        "venue_id": venue_id,
                        "start_datetime": start_iso,
                        "end_datetime": end_iso,
                        "purpose": "Team Meeting",
                        "notes": "Quarterly review meeting"
                    }
                    
                    print("📅 Creating booking...")
                    response = await api.create_booking(booking_data)
                    if response.status_code == 200:
                        booking = response.json()
                        print(f"✅ Booking created! ID: {booking['id']}, Cost: {booking['total_cost']} CZK")
                        
                        # Get user's bookings
                        print("\n📋 Getting my bookings...")
                        response = await api.get_my_bookings()
                        if response.status_code == 200:
                            bookings_data = response.json()
                            print(f"Found {bookings_data['total']} bookings:")
                            for b in bookings_data['bookings']:
                                start_dt = datetime.fromisoformat(b['start_datetime'].replace('Z', ''))
                                print(f"  • Booking #{b['id']} - {start_dt.strftime('%Y-%m-%d %H:%M')} ({b['status']})")
                    else:
                        print(f"❌ Booking failed: {response.status_code} - {response.text}")
                else:
                    print("❌ Venue is not available for selected time")

async def demo_admin_workflow():
    """Demonstrate admin workflow (requires admin user)"""
    print("\n" + "=" * 50)
    print("👑 Admin Workflow Demo")
    print("=" * 50)
    
    api = ConferenceBookingAPI()
    
    # Try to login as admin (created by init_db.py)
    print("🔑 Logging in as admin...")
    login_success = await api.login("admin@example.com", "admin123")
    if not login_success:
        print("❌ Admin login failed. Make sure to run 'python init_db.py' first")
        return
    
    # Admin can see all bookings
    print("\n📊 Getting all bookings (admin view)...")
    response = await api.get_my_bookings()  # Will show all bookings for admin
    if response.status_code == 200:
        bookings_data = response.json()
        print(f"Total bookings in system: {bookings_data['total']}")

def print_api_endpoints():
    """Print available API endpoints"""
    print("\n" + "=" * 50)
    print("📡 Available API Endpoints")
    print("=" * 50)
    
    endpoints = {
        "Authentication": [
            "POST /api/v1/auth/register - Register new user",
            "POST /api/v1/auth/token - Get access token",
            "POST /api/v1/auth/login - Login with email/password",
            "GET /api/v1/auth/me - Get current user info"
        ],
        "Venues": [
            "GET /api/v1/venues/ - List venues with filtering",
            "GET /api/v1/venues/{id} - Get venue details",
            "GET /api/v1/venues/{id}/availability - Check availability",
            "GET /api/v1/venues/city/{city} - Get venues by city"
        ],
        "Bookings": [
            "GET /api/v1/bookings/ - List user's bookings",
            "POST /api/v1/bookings/ - Create booking",
            "GET /api/v1/bookings/{id} - Get booking details",
            "PUT /api/v1/bookings/{id} - Update booking",
            "DELETE /api/v1/bookings/{id} - Cancel booking"
        ]
    }
    
    for category, urls in endpoints.items():
        print(f"\n{category}:")
        for url in urls:
            print(f"  {url}")

async def main():
    """Run all demos"""
    try:
        # Test if server is running
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{BASE_URL}/health")
            if response.status_code != 200:
                print("❌ Server not responding. Please start the server with 'python start.py'")
                return
        
        print_api_endpoints()
        await demo_basic_usage()
        await demo_user_workflow()
        await demo_admin_workflow()
        
        print("\n" + "=" * 50)
        print("🎉 Demo complete!")
        print("\n📚 For full API documentation, visit: http://localhost:8000/docs")
        
    except httpx.ConnectError:
        print("❌ Could not connect to server.")
        print("Please start the server first: python start.py")
    except Exception as e:
        print(f"❌ Error running demo: {e}")

if __name__ == "__main__":
    asyncio.run(main())
