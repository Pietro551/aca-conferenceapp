from typing import Any, List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.crud import booking as crud_booking
from app.schemas.schemas import Booking, BookingCreate, BookingUpdate, BookingList, User
from app.api.v1.endpoints.auth import get_current_active_user, get_current_admin_user

router = APIRouter()


@router.get("/", response_model=BookingList)
def read_bookings(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Retrieve bookings. Admin sees all, users see only their own.
    """
    if current_user.is_admin:
        bookings = crud_booking.get_bookings(db, skip=skip, limit=limit)
        total = crud_booking.get_bookings_count(db)
    else:
        bookings = crud_booking.get_user_bookings(db, user_id=current_user.id, skip=skip, limit=limit)
        total = crud_booking.get_bookings_count(db, user_id=current_user.id)
    
    return BookingList(
        bookings=bookings,
        total=total,
        page=skip // limit + 1,
        size=limit
    )


@router.get("/{booking_id}", response_model=Booking)
def read_booking(
    *,
    db: Session = Depends(get_db),
    booking_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get booking by ID. Users can only access their own bookings unless they're admin.
    """
    booking = crud_booking.get_booking(db, booking_id=booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Users can only access their own bookings unless they're admin
    if booking.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return booking


@router.post("/", response_model=Booking)
def create_booking(
    *,
    db: Session = Depends(get_db),
    booking_in: BookingCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Create new booking.
    """
    booking = crud_booking.create_booking(db, booking=booking_in, user_id=current_user.id)
    if not booking:
        raise HTTPException(
            status_code=400, 
            detail="Venue is not available for the selected time slot"
        )
    return booking


@router.put("/{booking_id}", response_model=Booking)
def update_booking(
    *,
    db: Session = Depends(get_db),
    booking_id: int,
    booking_in: BookingUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update booking. Users can only update their own bookings.
    """
    booking = crud_booking.get_booking(db, booking_id=booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Users can only update their own bookings unless they're admin
    if booking.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    booking = crud_booking.update_booking(
        db, booking_id=booking_id, booking_update=booking_in, user_id=current_user.id
    )
    if not booking:
        raise HTTPException(
            status_code=400, 
            detail="Venue is not available for the selected time slot"
        )
    return booking


@router.delete("/{booking_id}", response_model=Booking)
def cancel_booking(
    *,
    db: Session = Depends(get_db),
    booking_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Cancel booking. Users can only cancel their own bookings.
    """
    booking = crud_booking.get_booking(db, booking_id=booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Users can only cancel their own bookings unless they're admin
    if booking.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    booking = crud_booking.cancel_booking(db, booking_id=booking_id, user_id=current_user.id)
    return booking


@router.post("/{booking_id}/confirm", response_model=Booking)
def confirm_booking(
    *,
    db: Session = Depends(get_db),
    booking_id: int,
    current_user: User = Depends(get_current_admin_user),
) -> Any:
    """
    Confirm booking. Admin only.
    """
    booking = crud_booking.get_booking(db, booking_id=booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    booking = crud_booking.confirm_booking(db, booking_id=booking_id)
    if not booking:
        raise HTTPException(status_code=400, detail="Cannot confirm this booking")
    
    return booking


@router.get("/venue/{venue_id}", response_model=List[Booking])
def read_venue_bookings(
    *,
    db: Session = Depends(get_db),
    venue_id: int,
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_admin_user),
) -> Any:
    """
    Get all bookings for a specific venue. Admin only.
    """
    start_datetime = None
    end_datetime = None
    
    if start_date:
        try:
            start_datetime = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid start_date format")
    
    if end_date:
        try:
            end_datetime = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid end_date format")
    
    bookings = crud_booking.get_venue_bookings(
        db, 
        venue_id=venue_id, 
        start_date=start_datetime,
        end_date=end_datetime,
        skip=skip, 
        limit=limit
    )
    return bookings
