from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from datetime import datetime
from decimal import Decimal
from app.models.models import Booking, Venue
from app.schemas.schemas import BookingCreate, BookingUpdate
from app.crud.venue import check_venue_availability


def get_booking(db: Session, booking_id: int) -> Optional[Booking]:
    return db.query(Booking).filter(Booking.id == booking_id).first()


def get_bookings(db: Session, skip: int = 0, limit: int = 100) -> List[Booking]:
    return db.query(Booking).offset(skip).limit(limit).all()


def get_user_bookings(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Booking]:
    return db.query(Booking).filter(Booking.user_id == user_id).offset(skip).limit(limit).all()


def get_venue_bookings(
    db: Session, 
    venue_id: int, 
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    skip: int = 0, 
    limit: int = 100
) -> List[Booking]:
    query = db.query(Booking).filter(Booking.venue_id == venue_id)
    
    if start_date:
        query = query.filter(Booking.start_datetime >= start_date)
    if end_date:
        query = query.filter(Booking.end_datetime <= end_date)
    
    return query.offset(skip).limit(limit).all()


def calculate_booking_cost(db: Session, venue_id: int, start_datetime: datetime, end_datetime: datetime) -> Decimal:
    """Calculate the total cost for a booking based on venue hourly rate and duration"""
    venue = db.query(Venue).filter(Venue.id == venue_id).first()
    if not venue:
        raise ValueError("Venue not found")
    
    # Calculate duration in hours
    duration = end_datetime - start_datetime
    hours = duration.total_seconds() / 3600
    
    # Round up to the nearest hour for billing
    import math
    hours = math.ceil(hours)
    
    return venue.hourly_rate * Decimal(hours)


def create_booking(db: Session, booking: BookingCreate, user_id: int) -> Optional[Booking]:
    # Check if venue is available
    if not check_venue_availability(db, booking.venue_id, booking.start_datetime, booking.end_datetime):
        return None
    
    # Calculate total cost
    total_cost = calculate_booking_cost(db, booking.venue_id, booking.start_datetime, booking.end_datetime)
    
    db_booking = Booking(
        user_id=user_id,
        venue_id=booking.venue_id,
        start_datetime=booking.start_datetime,
        end_datetime=booking.end_datetime,
        total_cost=total_cost,
        purpose=booking.purpose,
        notes=booking.notes,
        status="pending"
    )
    
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking


def update_booking(db: Session, booking_id: int, booking_update: BookingUpdate, user_id: int) -> Optional[Booking]:
    db_booking = db.query(Booking).filter(
        and_(Booking.id == booking_id, Booking.user_id == user_id)
    ).first()
    
    if not db_booking:
        return None
    
    update_data = booking_update.dict(exclude_unset=True)
    
    # If datetime is being updated, check availability and recalculate cost
    if 'start_datetime' in update_data or 'end_datetime' in update_data:
        start_datetime = update_data.get('start_datetime', db_booking.start_datetime)
        end_datetime = update_data.get('end_datetime', db_booking.end_datetime)
        
        if not check_venue_availability(db, db_booking.venue_id, start_datetime, end_datetime, booking_id):
            return None
        
        # Recalculate cost
        total_cost = calculate_booking_cost(db, db_booking.venue_id, start_datetime, end_datetime)
        update_data['total_cost'] = total_cost
    
    for key, value in update_data.items():
        setattr(db_booking, key, value)
    
    db.commit()
    db.refresh(db_booking)
    return db_booking


def cancel_booking(db: Session, booking_id: int, user_id: int) -> Optional[Booking]:
    db_booking = db.query(Booking).filter(
        and_(Booking.id == booking_id, Booking.user_id == user_id)
    ).first()
    
    if db_booking and db_booking.status in ["pending", "confirmed"]:
        db_booking.status = "cancelled"
        db.commit()
        db.refresh(db_booking)
    
    return db_booking


def confirm_booking(db: Session, booking_id: int) -> Optional[Booking]:
    """Admin function to confirm a booking"""
    db_booking = db.query(Booking).filter(Booking.id == booking_id).first()
    
    if db_booking and db_booking.status == "pending":
        db_booking.status = "confirmed"
        db.commit()
        db.refresh(db_booking)
    
    return db_booking


def get_bookings_count(db: Session, user_id: Optional[int] = None) -> int:
    query = db.query(Booking)
    if user_id:
        query = query.filter(Booking.user_id == user_id)
    return query.count()
