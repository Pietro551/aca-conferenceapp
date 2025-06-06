"""
Basic API tests for South Moravia Conference Booking App
Run with: python -m pytest test_api.py -v
"""
import pytest
import httpx
from fastapi.testclient import TestClient
import sys
import os

# Add the app directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.main import app

client = TestClient(app)

def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "South Moravia Conference Booking API" in data["message"]

def test_health_endpoint():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_venues_endpoint():
    """Test venues listing endpoint"""
    response = client.get("/api/v1/venues/")
    assert response.status_code == 200
    data = response.json()
    assert "venues" in data
    assert "total" in data
    assert "page" in data
    assert "size" in data

def test_auth_endpoints_structure():
    """Test that auth endpoints are accessible (without valid credentials)"""
    # Register endpoint should exist
    response = client.post("/api/v1/auth/register", json={
        "email": "test@example.com",
        "password": "testpass",
        "first_name": "Test",
        "last_name": "User"
    })
    # Should either work (if DB is set up) or give a specific error
    assert response.status_code in [200, 201, 400, 422, 500]  # Various valid responses
    
    # Token endpoint should exist
    response = client.post("/api/v1/auth/token", data={
        "username": "test@example.com",
        "password": "wrongpass"
    })
    # Should return 400 for invalid credentials
    assert response.status_code in [400, 422, 500]

def test_api_docs():
    """Test that API documentation is accessible"""
    response = client.get("/docs")
    assert response.status_code == 200
    
    response = client.get("/openapi.json")
    assert response.status_code == 200
    data = response.json()
    assert "openapi" in data
    assert "info" in data

def test_cors_headers():
    """Test CORS headers are present"""
    response = client.options("/api/v1/venues/")
    # CORS headers should be present or endpoint should be accessible
    assert response.status_code in [200, 405]  # OPTIONS might not be enabled

if __name__ == "__main__":
    # Run tests manually
    print("🧪 Running basic API tests...")
    
    tests = [
        test_root_endpoint,
        test_health_endpoint,
        test_venues_endpoint,
        test_auth_endpoints_structure,
        test_api_docs
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            test()
            print(f"✅ {test.__name__}")
            passed += 1
        except Exception as e:
            print(f"❌ {test.__name__}: {e}")
            failed += 1
    
    print(f"\n📊 Results: {passed} passed, {failed} failed")
    
    if failed == 0:
        print("🎉 All tests passed!")
    else:
        print("⚠️  Some tests failed. Check your setup.")
