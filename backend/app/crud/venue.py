from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from datetime import datetime
from decimal import Decimal
from app.models.models import Venue
from app.schemas.schemas import VenueCreate, VenueUpdate, VenueSearch


def get_venue(db: Session, venue_id: int) -> Optional[Venue]:
    return db.query(Venue).filter(Venue.id == venue_id).first()


def get_venues(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    search: Optional[VenueSearch] = None
) -> List[Venue]:
    query = db.query(Venue).filter(Venue.is_active == True)
    
    if search:
        if search.city:
            query = query.filter(Venue.city.ilike(f"%{search.city}%"))
        if search.min_capacity:
            query = query.filter(Venue.capacity >= search.min_capacity)
        if search.max_capacity:
            query = query.filter(Venue.capacity <= search.max_capacity)
        if search.min_rate:
            query = query.filter(Venue.hourly_rate >= search.min_rate)
        if search.max_rate:
            query = query.filter(Venue.hourly_rate <= search.max_rate)
    
    return query.offset(skip).limit(limit).all()


def get_venues_count(db: Session, search: Optional[VenueSearch] = None) -> int:
    query = db.query(Venue).filter(Venue.is_active == True)
    
    if search:
        if search.city:
            query = query.filter(Venue.city.ilike(f"%{search.city}%"))
        if search.min_capacity:
            query = query.filter(Venue.capacity >= search.min_capacity)
        if search.max_capacity:
            query = query.filter(Venue.capacity <= search.max_capacity)
        if search.min_rate:
            query = query.filter(Venue.hourly_rate >= search.min_rate)
        if search.max_rate:
            query = query.filter(Venue.hourly_rate <= search.max_rate)
    
    return query.count()


def create_venue(db: Session, venue: VenueCreate) -> Venue:
    db_venue = Venue(**venue.dict())
    db.add(db_venue)
    db.commit()
    db.refresh(db_venue)
    return db_venue


def update_venue(db: Session, venue_id: int, venue_update: VenueUpdate) -> Optional[Venue]:
    db_venue = db.query(Venue).filter(Venue.id == venue_id).first()
    if db_venue:
        update_data = venue_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_venue, key, value)
        db.commit()
        db.refresh(db_venue)
    return db_venue


def delete_venue(db: Session, venue_id: int) -> Optional[Venue]:
    db_venue = db.query(Venue).filter(Venue.id == venue_id).first()
    if db_venue:
        db_venue.is_active = False
        db.commit()
        db.refresh(db_venue)
    return db_venue


def get_venues_by_city(db: Session, city: str) -> List[Venue]:
    return db.query(Venue).filter(
        and_(Venue.city.ilike(f"%{city}%"), Venue.is_active == True)
    ).all()


def check_venue_availability(
    db: Session, 
    venue_id: int, 
    start_datetime: datetime, 
    end_datetime: datetime,
    exclude_booking_id: Optional[int] = None
) -> bool:
    """Check if a venue is available for the given time slot"""
    from app.models.models import Booking
    
    query = db.query(Booking).filter(
        and_(
            Booking.venue_id == venue_id,
            Booking.status.in_(["pending", "confirmed"]),
            or_(
                and_(
                    Booking.start_datetime <= start_datetime,
                    Booking.end_datetime > start_datetime
                ),
                and_(
                    Booking.start_datetime < end_datetime,
                    Booking.end_datetime >= end_datetime
                ),
                and_(
                    Booking.start_datetime >= start_datetime,
                    Booking.end_datetime <= end_datetime
                )
            )
        )
    )
    
    if exclude_booking_id:
        query = query.filter(Booking.id != exclude_booking_id)
    
    conflicting_booking = query.first()
    return conflicting_booking is None
