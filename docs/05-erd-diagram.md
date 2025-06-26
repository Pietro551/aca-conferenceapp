# Entity-Relationship Diagram (ERD)
## South Moravia Conference Booking App

**Document Version:** 1.0  
**Date:** June 2025  
**Status:** Final  
**Tool:** dbdiagram.io compatible format

---

## 📊 ERD Overview

This document contains the Entity-Relationship Diagram for the South Moravia Conference Booking App database. The diagram illustrates the structure and relationships between the three core entities: Users, Venues, and Bookings.

---

## 🛠️ Database Schema (dbdiagram.io format)

### Complete ERD Code

```sql
// South Moravia Conference Booking App - Database Schema
// Created: June 2025
// Tool: dbdiagram.io

Table users {
  id integer [primary key, increment, note: 'Unique user identifier']
  email varchar(255) [unique, not null, note: 'User email for authentication']
  hashed_password varchar(255) [not null, note: 'Bcrypt hashed password']
  first_name varchar(100) [not null, note: 'User first name']
  last_name varchar(100) [not null, note: 'User last name']
  phone varchar(50) [null, note: 'Contact phone number']
  company varchar(200) [null, note: 'Company or organization']
  is_active boolean [default: true, note: 'Account status']
  is_admin boolean [default: false, note: 'Admin privileges']
  created_at timestamp [default: `now()`, note: 'Account creation time']
  updated_at timestamp [default: `now()`, note: 'Last update time']
  
  Note: 'User accounts for customers and administrators'
}

Table venues {
  id integer [primary key, increment, note: 'Unique venue identifier']
  name varchar(200) [not null, note: 'Venue name']
  description text [null, note: 'Detailed venue description']
  address varchar(500) [not null, note: 'Complete street address']
  city varchar(100) [not null, note: 'City in South Moravia']
  postal_code varchar(20) [null, note: 'Czech postal code']
  capacity integer [not null, note: 'Maximum occupancy']
  hourly_rate decimal(10,2) [not null, note: 'Price per hour in CZK']
  amenities text [null, note: 'JSON string of available amenities']
  image_url varchar(500) [null, note: 'Venue photo URL']
  contact_email varchar(255) [null, note: 'Direct venue contact email']
  contact_phone varchar(50) [null, note: 'Direct venue contact phone']
  is_active boolean [default: true, note: 'Venue availability status']
  created_at timestamp [default: `now()`, note: 'Venue creation time']
  updated_at timestamp [default: `now()`, note: 'Last update time']
  
  Note: 'Conference rooms and meeting venues'
}

Table bookings {
  id integer [primary key, increment, note: 'Unique booking identifier']
  user_id integer [not null, ref: > users.id, note: 'Reference to user']
  venue_id integer [not null, ref: > venues.id, note: 'Reference to venue']
  start_datetime timestamp [not null, note: 'Booking start time']
  end_datetime timestamp [not null, note: 'Booking end time']
  total_cost decimal(10,2) [not null, note: 'Total cost in CZK']
  status varchar(50) [default: 'pending', note: 'Booking status: pending/confirmed/cancelled']
  purpose varchar(200) [null, note: 'Meeting or event purpose']
  notes text [null, note: 'Additional booking notes']
  created_at timestamp [default: `now()`, note: 'Booking creation time']
  updated_at timestamp [default: `now()`, note: 'Last update time']
  
  Note: 'Venue reservations linking users to venues'
}

// Relationships
Ref: bookings.user_id > users.id [note: 'One user can have many bookings']
Ref: bookings.venue_id > venues.id [note: 'One venue can have many bookings']

// Indexes for performance
Table users {
  indexes {
    email [unique, name: 'idx_users_email']
    (first_name, last_name) [name: 'idx_users_name']
  }
}

Table venues {
  indexes {
    name [name: 'idx_venues_name']
    city [name: 'idx_venues_city']
    (city, capacity) [name: 'idx_venues_city_capacity']
    hourly_rate [name: 'idx_venues_price']
  }
}

Table bookings {
  indexes {
    user_id [name: 'idx_bookings_user']
    venue_id [name: 'idx_bookings_venue']
    (venue_id, start_datetime, end_datetime) [name: 'idx_bookings_availability']
    start_datetime [name: 'idx_bookings_start']
    status [name: 'idx_bookings_status']
  }
}
```

---

## 🎨 Visual ERD Description

### Entity Layout
```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│      USERS      │         │    BOOKINGS     │         │     VENUES      │
├─────────────────┤         ├─────────────────┤         ├─────────────────┤
│ 🔑 id (PK)      │────────┐│ 🔑 id (PK)      │┌────────│ 🔑 id (PK)      │
│ 📧 email (UQ)   │        ││ 🔗 user_id (FK) ││        │ 🏢 name         │
│ 🔒 hashed_pwd   │        ││ 🔗 venue_id(FK) ││        │ 📝 description  │
│ 👤 first_name   │        ││ 📅 start_dt     ││        │ 📍 address      │
│ 👤 last_name    │        ││ 📅 end_dt       ││        │ 🏙️ city         │
│ 📞 phone        │        ││ 💰 total_cost   ││        │ 📮 postal_code  │
│ 🏢 company      │        ││ 📊 status       ││        │ 👥 capacity     │
│ ✅ is_active    │        ││ 🎯 purpose      ││        │ 💵 hourly_rate  │
│ 👑 is_admin     │        ││ 📝 notes       ││        │ 🎯 amenities    │
│ 📅 created_at   │        ││ 📅 created_at   ││        │ 🖼️ image_url    │
│ 📅 updated_at   │        ││ 📅 updated_at   ││        │ 📧 contact_email│
└─────────────────┘        │└─────────────────┘│        │ 📞 contact_phone│
                           │                  │        │ ✅ is_active    │
        1 : N              │                  │ N : 1  │ 📅 created_at   │
    "One user can have     │                  │        │ 📅 updated_at   │
     many bookings"        │                  │        └─────────────────┘
                           │                  │           "One venue can
                           │                  │            have many
                           └──────────────────┘            bookings"
```

### Relationship Details

#### USER → BOOKING (One-to-Many)
- **Cardinality:** 1:N
- **Foreign Key:** bookings.user_id → users.id
- **Business Rule:** Each user can create multiple bookings
- **Referential Integrity:** ON DELETE RESTRICT, ON UPDATE CASCADE

#### VENUE → BOOKING (One-to-Many)
- **Cardinality:** 1:N
- **Foreign Key:** bookings.venue_id → venues.id
- **Business Rule:** Each venue can have multiple bookings
- **Referential Integrity:** ON DELETE RESTRICT, ON UPDATE CASCADE

#### USER ↔ VENUE (Many-to-Many through BOOKING)
- **Implementation:** Junction table pattern
- **Additional Attributes:** Booking contains scheduling and business data
- **Business Logic:** Temporal constraints and conflict prevention

---

## 📐 Technical Specifications

### Data Types and Constraints

#### Primary Keys
- **Type:** Integer, Auto-increment
- **Purpose:** Surrogate keys for optimal performance
- **Uniqueness:** Database-enforced uniqueness

#### Foreign Keys
- **Enforcement:** Database-level referential integrity
- **Cascading:** Updates cascade, deletes restricted
- **Indexing:** Automatic indexing for optimal JOIN performance

#### Business Constraints
- **Email Uniqueness:** Unique constraint on users.email
- **Temporal Logic:** end_datetime > start_datetime (application-level)
- **Future Bookings:** start_datetime >= current_timestamp (application-level)
- **Positive Values:** capacity > 0, hourly_rate > 0 (application-level)

### Indexing Strategy

#### Performance Indexes
```sql
-- User authentication
CREATE INDEX idx_users_email ON users(email);

-- Venue searching
CREATE INDEX idx_venues_city ON venues(city);
CREATE INDEX idx_venues_capacity ON venues(capacity);

-- Booking availability
CREATE INDEX idx_bookings_venue_datetime ON bookings(venue_id, start_datetime, end_datetime);

-- Admin queries
CREATE INDEX idx_bookings_status ON bookings(status);
```

#### Composite Indexes
- **City + Capacity:** For venue filtering queries
- **Venue + DateTime:** For availability checking
- **User + Status:** For user booking history

---

## 🔄 Database Operations Flow

### Typical Query Patterns

#### 1. User Registration & Authentication
```sql
-- User registration
INSERT INTO users (email, hashed_password, first_name, last_name) 
VALUES (?, ?, ?, ?);

-- User authentication
SELECT id, email, is_admin, is_active 
FROM users WHERE email = ? AND hashed_password = ?;
```

#### 2. Venue Search
```sql
-- Search venues by city and capacity
SELECT * FROM venues 
WHERE city = ? AND capacity >= ? AND is_active = true
ORDER BY hourly_rate ASC;
```

#### 3. Booking Creation
```sql
-- Check availability
SELECT COUNT(*) FROM bookings 
WHERE venue_id = ? AND status != 'cancelled'
AND (start_datetime < ? AND end_datetime > ?);

-- Create booking
INSERT INTO bookings (user_id, venue_id, start_datetime, end_datetime, total_cost)
VALUES (?, ?, ?, ?, ?);
```

#### 4. Admin Operations
```sql
-- Get all pending bookings
SELECT b.*, u.company, v.name as venue_name
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN venues v ON b.venue_id = v.id
WHERE b.status = 'pending';
```

---

## 🎯 ERD Implementation Notes

### dbdiagram.io Usage
1. **Copy the SQL code** from the "Complete ERD Code" section above
2. **Paste into dbdiagram.io** editor
3. **Generate visual diagram** with automatic layout
4. **Export options:** PNG, PDF, SQL DDL

### Alternative Tools
- **Lucidchart:** Import SQL schema or create manually
- **Draw.io:** Manual ERD creation with database shapes
- **MySQL Workbench:** Reverse engineer from existing database
- **pgAdmin:** PostgreSQL-specific ERD generation

### Schema Evolution
- **Version Control:** Track schema changes in documentation
- **Migration Scripts:** Database schema updates via Alembic
- **Backward Compatibility:** Consider existing data during changes

---

## 🔍 Validation Checklist

### ERD Completeness
- ✅ All entities properly defined
- ✅ All attributes with correct data types
- ✅ All relationships clearly specified
- ✅ Primary keys identified
- ✅ Foreign keys properly referenced
- ✅ Indexes defined for performance
- ✅ Business rules documented

### Business Requirements Alignment
- ✅ Supports user authentication and authorization
- ✅ Enables venue search and filtering
- ✅ Manages booking lifecycle
- ✅ Prevents booking conflicts
- ✅ Supports administrative functions
- ✅ Maintains data integrity
- ✅ Optimized for performance

---

*This ERD serves as the definitive database design specification for the South Moravia Conference Booking App, ensuring data integrity, performance, and scalability.*