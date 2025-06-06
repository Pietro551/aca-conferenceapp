from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from decimal import Decimal


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None
    company: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None


class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


# Venue Schemas
class VenueBase(BaseModel):
    name: str
    description: Optional[str] = None
    address: str
    city: str
    postal_code: Optional[str] = None
    capacity: int
    hourly_rate: Decimal
    amenities: Optional[str] = None
    image_url: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None


class VenueCreate(VenueBase):
    pass


class VenueUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    capacity: Optional[int] = None
    hourly_rate: Optional[Decimal] = None
    amenities: Optional[str] = None
    image_url: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    is_active: Optional[bool] = None


class Venue(VenueBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


# Booking Schemas
class BookingBase(BaseModel):
    venue_id: int
    start_datetime: datetime
    end_datetime: datetime
    purpose: Optional[str] = None
    notes: Optional[str] = None


class BookingCreate(BookingBase):
    pass


class BookingUpdate(BaseModel):
    start_datetime: Optional[datetime] = None
    end_datetime: Optional[datetime] = None
    purpose: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None


class Booking(BookingBase):
    id: int
    user_id: int
    total_cost: Decimal
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Include related objects
    user: Optional[User] = None
    venue: Optional[Venue] = None

    class Config:
        orm_mode = True


# Authentication Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# Search and Filter Schemas
class VenueSearch(BaseModel):
    city: Optional[str] = None
    min_capacity: Optional[int] = None
    max_capacity: Optional[int] = None
    min_rate: Optional[Decimal] = None
    max_rate: Optional[Decimal] = None
    date: Optional[datetime] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None


# Response Schemas
class VenueList(BaseModel):
    venues: List[Venue]
    total: int
    page: int
    size: int


class BookingList(BaseModel):
    bookings: List[Booking]
    total: int
    page: int
    size: int
