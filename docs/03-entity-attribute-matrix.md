# Entity-Attribute Matrix
## South Moravia Conference Booking App

**Document Version:** 1.0  
**Date:** June 2025  
**Status:** Final

---

## 📊 Entity Overview

The South Moravia Conference Booking App database consists of **3 core entities** that support the complete venue booking workflow. Each entity has been designed to maintain data integrity, support business requirements, and enable efficient querying.

---

## 👤 USER Entity

### Purpose
Manages user accounts, authentication, and profile information for both regular users and administrators.

### Attributes

| Attribute | Data Type | Constraints | Description | Business Rules |
|-----------|-----------|-------------|-------------|----------------|
| **id** | Integer | Primary Key, Auto-increment | Unique user identifier | System-generated, immutable |
| **email** | String(255) | Unique, Not Null, Indexed | User's email address | Must be valid email format, used for login |
| **hashed_password** | String(255) | Not Null | Encrypted user password | Bcrypt hashed, minimum 8 characters |
| **first_name** | String(100) | Not Null | User's first name | Required for profile completion |
| **last_name** | String(100) | Not Null | User's last name | Required for profile completion |
| **phone** | String(50) | Nullable | Contact phone number | Optional, international format supported |
| **company** | String(200) | Nullable | Company/organization name | Optional, useful for business users |
| **is_active** | Boolean | Default: True | Account activation status | Admin can deactivate accounts |
| **is_admin** | Boolean | Default: False | Administrative privileges | Grants access to admin features |
| **created_at** | DateTime | Auto-generated | Account creation timestamp | System-generated, timezone-aware |
| **updated_at** | DateTime | Auto-updated | Last modification timestamp | Automatically updated on changes |

### Key Characteristics
- **Unique Identifier**: email serves as natural unique identifier
- **Security**: Password hashing ensures data protection
- **Flexibility**: Optional fields allow various user types
- **Audit Trail**: Timestamps track account lifecycle

---

## 🏢 VENUE Entity

### Purpose
Stores comprehensive information about conference rooms and meeting venues available for booking across South Moravian cities.

### Attributes

| Attribute | Data Type | Constraints | Description | Business Rules |
|-----------|-----------|-------------|-------------|----------------|
| **id** | Integer | Primary Key, Auto-increment | Unique venue identifier | System-generated, immutable |
| **name** | String(200) | Not Null, Indexed | Venue name/title | Must be descriptive and unique per city |
| **description** | Text | Nullable | Detailed venue description | Rich text describing facilities and features |
| **address** | String(500) | Not Null | Complete street address | Must include street, number, and building info |
| **city** | String(100) | Not Null, Indexed | City location | Must be within South Moravian region |
| **postal_code** | String(20) | Nullable | Postal/ZIP code | Czech postal code format |
| **capacity** | Integer | Not Null | Maximum occupancy | Must be positive integer, minimum 1 person |
| **hourly_rate** | Decimal(10,2) | Not Null | Price per hour in CZK | Must be positive, two decimal places |
| **amenities** | Text | Nullable | Available amenities (JSON) | Structured list of features (WiFi, projector, etc.) |
| **image_url** | String(500) | Nullable | Venue photo URL | Optional image for venue display |
| **contact_email** | String(255) | Nullable | Venue contact email | Direct contact for venue-specific inquiries |
| **contact_phone** | String(50) | Nullable | Venue contact phone | Direct contact number |
| **is_active** | Boolean | Default: True | Venue availability status | Admin can deactivate venues |
| **created_at** | DateTime | Auto-generated | Venue creation timestamp | System-generated, timezone-aware |
| **updated_at** | DateTime | Auto-updated | Last modification timestamp | Automatically updated on changes |

### Key Characteristics
- **Geographic Organization**: City-based indexing for efficient searching
- **Flexible Pricing**: Decimal precision for accurate cost calculation
- **Rich Content**: Support for detailed descriptions and images
- **Contact Information**: Direct venue communication channels

---

## 📅 BOOKING Entity

### Purpose
Manages all venue reservations, linking users with venues and tracking booking lifecycle from creation to completion.

### Attributes

| Attribute | Data Type | Constraints | Description | Business Rules |
|-----------|-----------|-------------|-------------|----------------|
| **id** | Integer | Primary Key, Auto-increment | Unique booking identifier | System-generated, immutable |
| **user_id** | Integer | Foreign Key, Not Null | Reference to User entity | Must exist in users table |
| **venue_id** | Integer | Foreign Key, Not Null | Reference to Venue entity | Must exist in venues table |
| **start_datetime** | DateTime | Not Null, Indexed | Booking start time | Must be in future, timezone-aware |
| **end_datetime** | DateTime | Not Null, Indexed | Booking end time | Must be after start_datetime |
| **total_cost** | Decimal(10,2) | Not Null | Total booking cost in CZK | Calculated: (end - start) × venue.hourly_rate |
| **status** | String(50) | Default: 'pending' | Booking status | Enum: pending, confirmed, cancelled |
| **purpose** | String(200) | Nullable | Meeting/event purpose | Optional description of booking reason |
| **notes** | Text | Nullable | Additional booking notes | Optional user or admin comments |
| **created_at** | DateTime | Auto-generated | Booking creation timestamp | System-generated, timezone-aware |
| **updated_at** | DateTime | Auto-updated | Last modification timestamp | Automatically updated on changes |

### Key Characteristics
- **Temporal Constraints**: Start/end time validation prevents invalid bookings
- **Cost Automation**: Total cost automatically calculated based on duration
- **Status Workflow**: Clear progression from pending to confirmed/cancelled
- **Audit Trail**: Complete lifecycle tracking with timestamps

---

## 🔗 Relationship Summary

### Entity Relationships

| Relationship | Type | Description | Implementation |
|--------------|------|-------------|----------------|
| **User → Booking** | One-to-Many | One user can have multiple bookings | user_id foreign key in Booking |
| **Venue → Booking** | One-to-Many | One venue can have multiple bookings | venue_id foreign key in Booking |
| **User ↔ Venue** | Many-to-Many | Users can book multiple venues, venues can be booked by multiple users | Through Booking junction table |

### Key Constraints
- **Referential Integrity**: All foreign keys enforce valid references
- **Temporal Consistency**: Booking times must be logical and non-overlapping
- **Business Logic**: Cost calculation and status management enforced at application level

---

## 📈 Indexing Strategy

### Performance Optimization

| Entity | Indexed Columns | Purpose |
|--------|----------------|---------|
| **User** | email, id | Fast authentication and user lookup |
| **Venue** | name, city, id | Efficient search and filtering |
| **Booking** | start_datetime, end_datetime, user_id, venue_id | Availability checking and user history |

### Query Optimization
- **Composite Indexes**: Considered for common multi-column queries
- **Partial Indexes**: For active-only records (is_active = true)
- **Foreign Key Indexes**: Automatic indexing for relationship queries

---

## 🔧 Data Validation Rules

### Application-Level Validation
- **Email Format**: RFC 5322 compliant email addresses
- **Password Strength**: Minimum 8 characters with complexity requirements
- **DateTime Validation**: Future bookings only, logical start/end times
- **Capacity Limits**: Positive integers for venue capacity
- **Pricing Validation**: Positive decimal values for hourly rates

### Database-Level Constraints
- **Primary Key Uniqueness**: Enforced by database engine
- **Foreign Key Integrity**: Cascading rules for data consistency
- **NOT NULL Constraints**: Essential fields cannot be empty
- **CHECK Constraints**: Planned for complex business rules

---

*This entity-attribute matrix provides the foundation for the database schema implementation and ensures all business requirements are properly supported.*