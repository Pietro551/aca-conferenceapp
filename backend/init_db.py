"""
Database initialization script
Run this to create tables and initial data
"""
from sqlalchemy import create_engine
from app.core.config import settings
from app.core.database import Base
from app.models.models import User, Venue, Booking
from app.core.security import get_password_hash

def init_db():
    """Initialize database with tables and sample data"""
    engine = create_engine(settings.DATABASE_URL)
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

def create_sample_data():
    """Create sample venues and admin user"""
    from sqlalchemy.orm import sessionmaker
    from app.crud.user import create_user
    from app.crud.venue import create_venue
    from app.schemas.schemas import UserCreate, VenueCreate
    from decimal import Decimal
    
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Create admin user if not exists
        admin_email = "admin@example.com"
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        
        if not existing_admin:
            admin_user = User(
                email=admin_email,
                hashed_password=get_password_hash("admin123"),
                first_name="Admin",
                last_name="User",
                is_admin=True,
                is_active=True
            )
            db.add(admin_user)
            print(f"Created admin user: {admin_email}")
        
        # Create sample venues if none exist
        venue_count = db.query(Venue).count()
        if venue_count == 0:
            sample_venues = [
                Venue(
                    name="Brno Business Center",
                    description="Modern conference facility in the heart of Brno",
                    address="Náměstí Svobody 1",
                    city="Brno",
                    postal_code="60200",
                    capacity=50,
                    hourly_rate=Decimal("1500.00"),
                    amenities="WiFi, Projector, Audio System, Coffee Service",
                    contact_email="info@brnobusiness.cz",
                    contact_phone="+420 555 123 456"
                ),
                Venue(
                    name="Olomouc Conference Hall",
                    description="Historic venue with modern amenities",
                    address="Horní náměstí 1",
                    city="Olomouc",
                    postal_code="77900",
                    capacity=100,
                    hourly_rate=Decimal("2000.00"),
                    amenities="WiFi, Projector, Stage, Catering Available",
                    contact_email="info@olomoucconference.cz",
                    contact_phone="+420 555 654 321"
                ),
                Venue(
                    name="Zlín Tech Hub",
                    description="Modern tech-focused meeting space",
                    address="Třída Tomáše Bati 1",
                    city="Zlín",
                    postal_code="76001",
                    capacity=30,
                    hourly_rate=Decimal("1200.00"),
                    amenities="WiFi, Smart Boards, Video Conferencing, Parking",
                    contact_email="info@zlintech.cz",
                    contact_phone="+420 555 789 012"
                )
            ]
            
            for venue in sample_venues:
                db.add(venue)
            
            print("Created sample venues")
        
        db.commit()
        print("Sample data created successfully!")
        
    except Exception as e:
        print(f"Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Initializing South Moravia Conference Booking Database...")
    init_db()
    create_sample_data()
    print("Database initialization complete!")
