from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, venues, bookings

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(venues.router, prefix="/venues", tags=["venues"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
