"""
Development utilities for the South Moravia Conference Booking App
"""
import asyncio
import sys
import os

# Add the app directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

async def test_api_endpoints():
    """Test basic API endpoints functionality"""
    import httpx
    
    base_url = "http://localhost:8000"
    
    print("🧪 Testing API endpoints...")
    
    try:
        async with httpx.AsyncClient() as client:
            # Test root endpoint
            response = await client.get(f"{base_url}/")
            if response.status_code == 200:
                print("✅ Root endpoint working")
                print(f"   Response: {response.json()}")
            else:
                print(f"❌ Root endpoint failed: {response.status_code}")
            
            # Test health endpoint
            response = await client.get(f"{base_url}/health")
            if response.status_code == 200:
                print("✅ Health endpoint working")
                print(f"   Response: {response.json()}")
            else:
                print(f"❌ Health endpoint failed: {response.status_code}")
            
            # Test API docs
            response = await client.get(f"{base_url}/docs")
            if response.status_code == 200:
                print("✅ API documentation accessible at /docs")
            else:
                print(f"❌ API docs failed: {response.status_code}")
                
            # Test venues endpoint (should work without auth)
            response = await client.get(f"{base_url}/api/v1/venues/")
            if response.status_code == 200:
                print("✅ Venues endpoint working")
                venues_data = response.json()
                print(f"   Found {venues_data.get('total', 0)} venues")
            else:
                print(f"❌ Venues endpoint failed: {response.status_code}")
    
    except httpx.ConnectError:
        print("❌ Could not connect to server. Make sure it's running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Error testing endpoints: {e}")

def check_database_connection():
    """Check if database connection is working"""
    print("🔍 Checking database connection...")
    
    try:
        from app.core.database import engine
        from sqlalchemy import text
        
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            if result.fetchone():
                print("✅ Database connection successful")
            else:
                print("❌ Database connection failed")
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        print("   Make sure PostgreSQL is running and .env file is configured correctly")

def check_tables():
    """Check if database tables exist"""
    print("📊 Checking database tables...")
    
    try:
        from app.core.database import engine
        from sqlalchemy import text
        
        tables_to_check = ['users', 'venues', 'bookings']
        
        with engine.connect() as conn:
            for table in tables_to_check:
                try:
                    result = conn.execute(text(f"SELECT COUNT(*) FROM {table}"))
                    count = result.fetchone()[0]
                    print(f"✅ Table '{table}' exists with {count} records")
                except Exception:
                    print(f"❌ Table '{table}' does not exist")
    except Exception as e:
        print(f"❌ Error checking tables: {e}")

def show_sample_data():
    """Show sample data from database"""
    print("📋 Sample data overview...")
    
    try:
        from sqlalchemy.orm import sessionmaker
        from app.core.database import engine
        from app.models.models import User, Venue, Booking
        
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        try:
            # Show users
            users = db.query(User).limit(3).all()
            print(f"\n👥 Users ({len(users)} shown):")
            for user in users:
                role = "Admin" if user.is_admin else "User"
                print(f"   • {user.first_name} {user.last_name} ({user.email}) - {role}")
            
            # Show venues
            venues = db.query(Venue).limit(3).all()
            print(f"\n🏢 Venues ({len(venues)} shown):")
            for venue in venues:
                print(f"   • {venue.name} in {venue.city} (Capacity: {venue.capacity}, Rate: {venue.hourly_rate} CZK/hour)")
            
            # Show bookings
            bookings = db.query(Booking).limit(3).all()
            print(f"\n📅 Bookings ({len(bookings)} shown):")
            for booking in bookings:
                print(f"   • Booking #{booking.id} - {booking.status} (Cost: {booking.total_cost} CZK)")
                
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ Error showing sample data: {e}")

async def run_development_checks():
    """Run all development checks"""
    print("🚀 South Moravia Conference Booking - Development Check")
    print("=" * 60)
    
    # Check database
    check_database_connection()
    print()
    
    check_tables()
    print()
    
    show_sample_data()
    print()
    
    # Test API (if server is running)
    await test_api_endpoints()
    
    print("\n" + "=" * 60)
    print("Development check complete!")
    print("\nNext steps:")
    print("1. If database is not set up: run 'python init_db.py'")
    print("2. To start the server: run 'python start.py'")
    print("3. API docs will be available at: http://localhost:8000/docs")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "test-db":
            check_database_connection()
            check_tables()
            show_sample_data()
        elif command == "test-api":
            asyncio.run(test_api_endpoints())
        else:
            print("Available commands:")
            print("  python dev_tools.py test-db   - Test database connection and show data")
            print("  python dev_tools.py test-api  - Test API endpoints")
            print("  python dev_tools.py           - Run all checks")
    else:
        asyncio.run(run_development_checks())
