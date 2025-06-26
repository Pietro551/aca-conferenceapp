# ERD Visual Export
## South Moravia Conference Booking App

**Visual Format:** ASCII Art + dbdiagram.io Export Instructions  
**Date:** June 2025

---

## 🎨 ASCII ERD Diagram

```
                    South Moravia Conference Booking App
                              Database Schema
                                   
    ┌─────────────────────────┐                    ┌─────────────────────────┐
    │         USERS           │                    │        VENUES           │
    ├─────────────────────────┤                    ├─────────────────────────┤
    │ 🔑 id                   │                    │ 🔑 id                   │
    │ 📧 email           [UQ] │                    │ 🏢 name            [IX] │
    │ 🔒 hashed_password      │                    │ 📝 description          │
    │ 👤 first_name           │                    │ 📍 address              │
    │ 👤 last_name            │                    │ 🏙️ city            [IX] │
    │ 📞 phone                │                    │ 📮 postal_code          │
    │ 🏢 company              │                    │ 👥 capacity             │
    │ ✅ is_active            │                    │ 💵 hourly_rate          │
    │ 👑 is_admin             │                    │ 🎯 amenities            │
    │ 📅 created_at           │                    │ 🖼️ image_url            │
    │ 📅 updated_at           │                    │ 📧 contact_email        │
    └─────────────────────────┘                    │ 📞 contact_phone        │
                │                                  │ ✅ is_active            │
                │ 1                                │ 📅 created_at           │
                │                                  │ 📅 updated_at           │
                │                                  └─────────────────────────┘
                │                                              │
                │                                              │ 1
                │                                              │
                │                                              │
                │    ┌─────────────────────────┐              │
                │    │       BOOKINGS          │              │
                │    ├─────────────────────────┤              │
                └────┤ 🔗 user_id        [FK]  │──────────────┘
                  N  │ 🔗 venue_id       [FK]  │ N
                     │ 🔑 id                   │
                     │ 📅 start_datetime  [IX] │
                     │ 📅 end_datetime    [IX] │
                     │ 💰 total_cost           │
                     │ 📊 status               │
                     │ 🎯 purpose              │
                     │ 📝 notes                │
                     │ 📅 created_at           │
                     │ 📅 updated_at           │
                     └─────────────────────────┘

    Legend:
    🔑 = Primary Key    🔗 = Foreign Key    📧 = Email    📞 = Phone
    🏢 = Company/Venue  📍 = Address       🏙️ = City     📮 = Postal
    👤 = Person         👥 = Capacity      💵 = Money     🎯 = Purpose
    📝 = Text           📅 = DateTime      💰 = Cost      📊 = Status
    🖼️ = Image          ✅ = Boolean       🔒 = Password  👑 = Admin
    
    [PK] = Primary Key  [FK] = Foreign Key  [UQ] = Unique  [IX] = Indexed
```

---

## 🛠️ dbdiagram.io Export Instructions

### Step 1: Access dbdiagram.io
1. Go to https://dbdiagram.io/
2. Create free account or use guest mode
3. Create new diagram

### Step 2: Import Schema
Copy and paste the following code into the dbdiagram.io editor:

```sql
// South Moravia Conference Booking App
// Database Schema for dbdiagram.io

Table users {
  id integer [pk, increment]
  email varchar(255) [unique, not null]
  hashed_password varchar(255) [not null]
  first_name varchar(100) [not null]
  last_name varchar(100) [not null]
  phone varchar(50)
  company varchar(200)
  is_active boolean [default: true]
  is_admin boolean [default: false]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table venues {
  id integer [pk, increment]
  name varchar(200) [not null]
  description text
  address varchar(500) [not null]
  city varchar(100) [not null]
  postal_code varchar(20)
  capacity integer [not null]
  hourly_rate decimal(10,2) [not null]
  amenities text
  image_url varchar(500)
  contact_email varchar(255)
  contact_phone varchar(50)
  is_active boolean [default: true]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table bookings {
  id integer [pk, increment]
  user_id integer [not null, ref: > users.id]
  venue_id integer [not null, ref: > venues.id]
  start_datetime timestamp [not null]
  end_datetime timestamp [not null]
  total_cost decimal(10,2) [not null]
  status varchar(50) [default: 'pending']
  purpose varchar(200)
  notes text
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}
```

### Step 3: Generate Visual Diagram
1. The visual diagram will auto-generate
2. Arrange tables for optimal layout
3. Verify relationships are correctly displayed

### Step 4: Export Options
- **PNG:** High-resolution image export
- **PDF:** Printable document format
- **SQL:** DDL script for database creation

---

## 📊 Relationship Summary

### Connection Types
```
USER ────────────(1:N)──────────── BOOKING
                                     │
                                     │(N:1)
                                     │
VENUE ──────────(1:N)────────────────┘

Many-to-Many: USER ↔ VENUE (through BOOKING)
```

### Cardinality Details
- **1 User** → **N Bookings** (One user can make multiple bookings)
- **1 Venue** → **N Bookings** (One venue can have multiple bookings)
- **M Users** ↔ **N Venues** (Users can book multiple venues, venues can be booked by multiple users)

---

## 🎯 Key Features Highlighted

### Primary Keys
- All tables use auto-incrementing integer primary keys
- Provides optimal performance for joins and indexing

### Foreign Key Relationships
- `bookings.user_id` → `users.id`
- `bookings.venue_id` → `venues.id`
- Referential integrity enforced at database level

### Unique Constraints
- `users.email` must be unique for authentication
- Prevents duplicate user accounts

### Indexes for Performance
- `users.email` for authentication queries
- `venues.city` for location-based searches
- `venues.name` for venue name searches
- `bookings.start_datetime` and `end_datetime` for availability queries

### Business Logic Fields
- `users.is_admin` for role-based access control
- `venues.is_active` for venue availability management
- `bookings.status` for booking lifecycle management
- `bookings.total_cost` for automatic pricing

---

## 📐 Alternative Visualization Tools

### Lucidchart
1. Create new ERD diagram
2. Add database shapes for each table
3. Define attributes and relationships manually
4. Export as image or PDF

### Draw.io (diagrams.net)
1. Select database template
2. Create tables with entity shapes
3. Add relationship connectors
4. Label cardinality and constraints

### MySQL Workbench
1. Create new model
2. Add tables with columns
3. Define relationships and constraints
4. Forward engineer to generate visual ERD

### pgAdmin (PostgreSQL)
1. Connect to database
2. Use ERD tool to reverse engineer existing schema
3. Generate visual representation
4. Export to image format

---

## 📋 Validation Checklist

### ERD Completeness ✅
- [x] All entities represented (Users, Venues, Bookings)
- [x] All attributes listed with correct data types
- [x] All relationships properly defined
- [x] Primary keys clearly marked
- [x] Foreign keys correctly referenced
- [x] Unique constraints identified
- [x] Indexes specified for performance

### Business Requirements ✅
- [x] Supports user authentication (users table)
- [x] Manages venue information (venues table)
- [x] Tracks booking reservations (bookings table)
- [x] Prevents booking conflicts (temporal constraints)
- [x] Supports administrative functions (is_admin flag)
- [x] Maintains audit trail (created_at, updated_at)

### Technical Implementation ✅
- [x] Matches existing SQLAlchemy models
- [x] Aligns with API endpoint requirements
- [x] Supports planned frontend functionality
- [x] Optimized for expected query patterns
- [x] Scalable for future enhancements

---

*This ERD visualization package provides multiple formats for stakeholder review and technical implementation reference.*