from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.crud import venue as crud_venue
from app.schemas.schemas import Venue, VenueCreate, VenueUpdate, VenueList, VenueSearch, User
from app.api.v1.endpoints.auth import get_current_active_user, get_current_admin_user

router = APIRouter()


@router.get("/", response_model=VenueList)
def read_venues(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    city: Optional[str] = Query(None),
    min_capacity: Optional[int] = Query(None),
    max_capacity: Optional[int] = Query(None),
    min_rate: Optional[float] = Query(None),
    max_rate: Optional[float] = Query(None),
) -> Any:
    """
    Retrieve venues with optional filtering.
    """
    search_params = VenueSearch(
        city=city,
        min_capacity=min_capacity,
        max_capacity=max_capacity,
        min_rate=min_rate,
        max_rate=max_rate
    )
    
    venues = crud_venue.get_venues(db, skip=skip, limit=limit, search=search_params)
    total = crud_venue.get_venues_count(db, search=search_params)
    
    return VenueList(
        venues=venues,
        total=total,
        page=skip // limit + 1,
        size=limit
    )


@router.get("/{venue_id}", response_model=Venue)
def read_venue(
    *,
    db: Session = Depends(get_db),
    venue_id: int,
) -> Any:
    """
    Get venue by ID.
    """
    venue = crud_venue.get_venue(db, venue_id=venue_id)
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    return venue


@router.post("/", response_model=Venue)
def create_venue(
    *,
    db: Session = Depends(get_db),
    venue_in: VenueCreate,
    current_user: User = Depends(get_current_admin_user),
) -> Any:
    """
    Create new venue. Admin only.
    """
    venue = crud_venue.create_venue(db, venue=venue_in)
    return venue


@router.put("/{venue_id}", response_model=Venue)
def update_venue(
    *,
    db: Session = Depends(get_db),
    venue_id: int,
    venue_in: VenueUpdate,
    current_user: User = Depends(get_current_admin_user),
) -> Any:
    """
    Update venue. Admin only.
    """
    venue = crud_venue.get_venue(db, venue_id=venue_id)
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    
    venue = crud_venue.update_venue(db, venue_id=venue_id, venue_update=venue_in)
    return venue


@router.delete("/{venue_id}", response_model=Venue)
def delete_venue(
    *,
    db: Session = Depends(get_db),
    venue_id: int,
    current_user: User = Depends(get_current_admin_user),
) -> Any:
    """
    Delete venue (mark as inactive). Admin only.
    """
    venue = crud_venue.get_venue(db, venue_id=venue_id)
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    
    venue = crud_venue.delete_venue(db, venue_id=venue_id)
    return venue


@router.get("/city/{city}", response_model=List[Venue])
def read_venues_by_city(
    *,
    db: Session = Depends(get_db),
    city: str,
) -> Any:
    """
    Get all venues in a specific city.
    """
    venues = crud_venue.get_venues_by_city(db, city=city)
    return venues


@router.get("/{venue_id}/availability")
def check_venue_availability(
    *,
    db: Session = Depends(get_db),
    venue_id: int,
    start_datetime: str,
    end_datetime: str,
) -> Any:
    """
    Check if venue is available for the given time slot.
    """
    from datetime import datetime
    
    try:
        start_dt = datetime.fromisoformat(start_datetime.replace('Z', '+00:00'))
        end_dt = datetime.fromisoformat(end_datetime.replace('Z', '+00:00'))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid datetime format")
    
    venue = crud_venue.get_venue(db, venue_id=venue_id)
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    
    is_available = crud_venue.check_venue_availability(db, venue_id, start_dt, end_dt)
    
    return {"venue_id": venue_id, "available": is_available}
