# Database Relationship Mapping
## South Moravia Conference Booking App

**Document Version:** 1.0  
**Date:** June 2025  
**Status:** Final

---

## 🎯 Overview

This document defines the relationships between entities in the South Moravia Conference Booking App database, including relationship types, cardinality, primary keys, foreign keys, and referential integrity constraints.

---

## 📊 Entity Relationship Summary

### Core Entities
1. **USER** - System users (customers and administrators)
2. **VENUE** - Conference rooms and meeting spaces
3. **BOOKING** - Reservation records linking users to venues

### Relationship Pattern
The database follows a **many-to-many relationship** pattern between Users and Venues, implemented through the Booking entity as a **junction table** with additional attributes.

---

## 🔗 Detailed Relationship Definitions

### 1. USER → BOOKING Relationship

**Relationship Type:** One-to-Many  
**Cardinality:** 1:N  
**Business Rule:** One user can create multiple bookings

#### Key Mapping
- **Primary Key (USER):** `id` (Integer, Auto-increment)
- **Foreign Key (BOOKING):** `user_id` (Integer, References users.id)

#### Relationship Characteristics
```sql
-- Foreign Key Constraint
CONSTRAINT fk_booking_user 
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
```

#### Business Rules
- **Mandatory Relationship:** Every booking must have a valid user
- **Cascade Updates:** User ID changes propagate to bookings
- **Restrict Deletes:** Cannot delete user with existing bookings
- **Referential Integrity:** user_id must exist in users table

#### Query Examples
```sql
-- Get all bookings for a specific user
SELECT * FROM bookings WHERE user_id = 123;

-- Get user details with booking count
SELECT u.*, COUNT(b.id) as booking_count 
FROM users u 
LEFT JOIN bookings b ON u.id = b.user_id 
GROUP BY u.id;
```

---

### 2. VENUE → BOOKING Relationship

**Relationship Type:** One-to-Many  
**Cardinality:** 1:N  
**Business Rule:** One venue can have multiple bookings

#### Key Mapping
- **Primary Key (VENUE):** `id` (Integer, Auto-increment)
- **Foreign Key (BOOKING):** `venue_id` (Integer, References venues.id)

#### Relationship Characteristics
```sql
-- Foreign Key Constraint
CONSTRAINT fk_booking_venue 
    FOREIGN KEY (venue_id) REFERENCES venues(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
```

#### Business Rules
- **Mandatory Relationship:** Every booking must specify a venue
- **Cascade Updates:** Venue ID changes propagate to bookings
- **Restrict Deletes:** Cannot delete venue with existing bookings
- **Referential Integrity:** venue_id must exist in venues table

#### Query Examples
```sql
-- Get all bookings for a specific venue
SELECT * FROM bookings WHERE venue_id = 456;

-- Check venue availability for a date range
SELECT * FROM bookings 
WHERE venue_id = 456 
AND (start_datetime <= '2025-06-30 10:00:00' 
     AND end_datetime >= '2025-06-30 08:00:00');
```

---

### 3. USER ↔ VENUE Many-to-Many Relationship

**Relationship Type:** Many-to-Many  
**Implementation:** Through BOOKING junction table  
**Business Rule:** Users can book multiple venues; venues can be booked by multiple users

#### Junction Table: BOOKING
The BOOKING entity serves as both a junction table and a business entity with additional attributes.

#### Composite Relationship
```sql
-- Conceptual many-to-many relationship
USER (1) ←→ (N) BOOKING (N) ←→ (1) VENUE

-- With additional booking-specific attributes:
- start_datetime, end_datetime
- total_cost, status
- purpose, notes
- created_at, updated_at
```

#### Business Logic
- **Temporal Constraints:** Bookings have time-based attributes
- **Cost Calculation:** Junction table stores calculated costs
- **Status Management:** Booking lifecycle tracking
- **Conflict Prevention:** No overlapping bookings for same venue

---

## 🗝️ Primary Key Definitions

### USER Entity
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    -- other columns...
);
```
- **Type:** Integer, Auto-increment
- **Characteristics:** Surrogate key, system-generated
- **Uniqueness:** Guaranteed unique by database engine

### VENUE Entity
```sql
CREATE TABLE venues (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    -- other columns...
);
```
- **Type:** Integer, Auto-increment
- **Characteristics:** Surrogate key, system-generated
- **Uniqueness:** Guaranteed unique by database engine

### BOOKING Entity
```sql
CREATE TABLE bookings (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    -- other columns...
);
```
- **Type:** Integer, Auto-increment
- **Characteristics:** Surrogate key, system-generated
- **Uniqueness:** Guaranteed unique by database engine

---

## 🔐 Foreign Key Constraints

### BOOKING Entity Foreign Keys

#### 1. User Reference
```sql
ALTER TABLE bookings 
ADD CONSTRAINT fk_booking_user 
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE RESTRICT
ON UPDATE CASCADE;
```

#### 2. Venue Reference
```sql
ALTER TABLE bookings 
ADD CONSTRAINT fk_booking_venue 
FOREIGN KEY (venue_id) REFERENCES venues(id)
ON DELETE RESTRICT
ON UPDATE CASCADE;
```

### Constraint Behavior
- **ON DELETE RESTRICT:** Prevents deletion of referenced records
- **ON UPDATE CASCADE:** Propagates primary key changes
- **NOT NULL:** Foreign keys cannot be null (mandatory relationships)

---

## 🔄 Referential Integrity Rules

### Data Consistency Rules

#### 1. Insertion Rules
- **New Booking:** Must reference existing user_id and venue_id
- **Validation:** Foreign key constraints prevent invalid references
- **Business Logic:** Application validates booking conflicts

#### 2. Update Rules
- **User Updates:** Changes to user.id cascade to booking.user_id
- **Venue Updates:** Changes to venue.id cascade to booking.venue_id
- **Booking Updates:** Must maintain valid foreign key references

#### 3. Deletion Rules
- **User Deletion:** Blocked if user has existing bookings
- **Venue Deletion:** Blocked if venue has existing bookings
- **Booking Deletion:** Always allowed (no dependent records)

### Orphan Prevention
- **No Orphaned Bookings:** Every booking must have valid user and venue
- **Referential Integrity:** Database enforces relationship validity
- **Application Logic:** Additional business rule validation

---

## 📈 Indexing for Relationships

### Foreign Key Indexes
```sql
-- Automatic indexes for foreign keys
CREATE INDEX idx_booking_user_id ON bookings(user_id);
CREATE INDEX idx_booking_venue_id ON bookings(venue_id);

-- Composite indexes for common queries
CREATE INDEX idx_booking_venue_datetime ON bookings(venue_id, start_datetime, end_datetime);
CREATE INDEX idx_booking_user_status ON bookings(user_id, status);
```

### Performance Optimization
- **JOIN Operations:** Optimized through proper indexing
- **Availability Queries:** Efficient venue availability checking
- **User History:** Fast user booking history retrieval

---

## 🔍 Relationship Validation Rules

### Business Logic Constraints

#### 1. Temporal Relationships
```sql
-- Booking time validation (application level)
CHECK (end_datetime > start_datetime)
CHECK (start_datetime >= CURRENT_TIMESTAMP)
```

#### 2. Booking Conflicts
```sql
-- Prevent overlapping bookings (application level)
-- No two bookings for same venue with overlapping times
```

#### 3. User Permissions
- **Admin Users:** Can manage all bookings and venues
- **Regular Users:** Can only manage their own bookings
- **Active Users:** Only active users can create bookings

### Data Integrity Checks
- **User Existence:** Validate user_id exists and is active
- **Venue Existence:** Validate venue_id exists and is active
- **Time Logic:** Start time must be before end time
- **Future Bookings:** Bookings must be for future dates

---

## 📋 SQL Relationship Implementation

### Table Creation with Relationships
```sql
-- Create users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email VARCHAR(255) UNIQUE NOT NULL,
    -- other user columns...
);

-- Create venues table
CREATE TABLE venues (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(200) NOT NULL,
    -- other venue columns...
);

-- Create bookings table with foreign keys
CREATE TABLE bookings (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER NOT NULL,
    venue_id INTEGER NOT NULL,
    start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    -- other booking columns...
    
    CONSTRAINT fk_booking_user 
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_booking_venue 
        FOREIGN KEY (venue_id) REFERENCES venues(id)
);
```

---

## 🎯 Relationship Query Patterns

### Common Query Scenarios

#### 1. User Booking History
```sql
SELECT u.first_name, u.last_name, v.name as venue_name, 
       b.start_datetime, b.end_datetime, b.total_cost
FROM users u
JOIN bookings b ON u.id = b.user_id
JOIN venues v ON b.venue_id = v.id
WHERE u.id = ?
ORDER BY b.start_datetime DESC;
```

#### 2. Venue Availability Check
```sql
SELECT COUNT(*) as conflicts
FROM bookings
WHERE venue_id = ?
AND status != 'cancelled'
AND (
    (start_datetime <= ? AND end_datetime > ?) OR
    (start_datetime < ? AND end_datetime >= ?)
);
```

#### 3. Admin Booking Overview
```sql
SELECT u.company, v.name as venue_name, v.city,
       b.start_datetime, b.status, b.total_cost
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN venues v ON b.venue_id = v.id
WHERE b.status = 'pending'
ORDER BY b.created_at ASC;
```

---

*This relationship mapping ensures data integrity, optimal performance, and supports all business requirements for the venue booking system.*