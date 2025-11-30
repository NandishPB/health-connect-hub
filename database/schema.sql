-- PostgreSQL schema for ChikitsaVigyan
-- Run this first to create types and tables

-- Enums
CREATE TYPE role_enum AS ENUM ('PATIENT','DONOR','DOCTOR','HOSPITAL_ADMIN','ADMIN');
CREATE TYPE blood_group_enum AS ENUM ('A+','A-','B+','B-','AB+','AB-','O+','O-');
CREATE TYPE availability_enum AS ENUM ('AVAILABLE','UNAVAILABLE');
CREATE TYPE urgency_enum AS ENUM ('LOW','MEDIUM','HIGH','CRITICAL');
CREATE TYPE blood_response_status_enum AS ENUM ('INTERESTED','CONFIRMED','CANCELLED');
CREATE TYPE appointment_status_enum AS ENUM ('REQUESTED','CONFIRMED','COMPLETED','CANCELLED');
CREATE TYPE order_status_enum AS ENUM ('PENDING','ACCEPTED','PACKED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED');
CREATE TYPE notification_status_enum AS ENUM ('PENDING','SENT','FAILED');

-- Users
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  password_hash TEXT,
  role role_enum NOT NULL DEFAULT 'PATIENT',
  address_line TEXT,
  city TEXT,
  district TEXT,
  state TEXT,
  pin_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Patients (optional extra data linked to users)
CREATE TABLE patients (
  id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  date_of_birth DATE,
  gender TEXT,
  caretaker_of TEXT
);

-- Donors
CREATE TABLE donors (
  id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  blood_group blood_group_enum,
  availability availability_enum DEFAULT 'AVAILABLE',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  last_donation_date DATE
);

-- Hospitals
CREATE TABLE hospitals (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  address_line TEXT,
  city TEXT,
  district TEXT,
  state TEXT,
  pin_code TEXT,
  contact_phone TEXT,
  email TEXT,
  website TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_approved BOOLEAN DEFAULT FALSE,
  created_by_user_id TEXT REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Specialties
CREATE TABLE specialties (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

-- Join table hospital_specialties
CREATE TABLE hospital_specialties (
  id TEXT PRIMARY KEY,
  hospital_id TEXT REFERENCES hospitals(id) ON DELETE CASCADE,
  specialty_id TEXT REFERENCES specialties(id) ON DELETE CASCADE
);

-- Offers / Packages
CREATE TABLE hospital_offers (
  id TEXT PRIMARY KEY,
  hospital_id TEXT REFERENCES hospitals(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  price NUMERIC,
  valid_from TIMESTAMPTZ,
  valid_to TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

-- Doctors
CREATE TABLE doctors (
  id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  hospital_id TEXT REFERENCES hospitals(id) ON DELETE SET NULL,
  name TEXT,
  specialization TEXT,
  registration_number TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  experience INTEGER,
  qualification TEXT
);

-- Blood Requests
CREATE TABLE blood_requests (
  id TEXT PRIMARY KEY,
  hospital_id TEXT REFERENCES hospitals(id) ON DELETE SET NULL,
  patient_name_or_code TEXT,
  blood_group_required blood_group_enum,
  urgency_level urgency_enum DEFAULT 'LOW',
  needed_by TIMESTAMPTZ,
  location_description TEXT,
  contact_person_name TEXT,
  contact_phone TEXT,
  status TEXT DEFAULT 'ACTIVE',
  notes TEXT,
  created_by_user_id TEXT REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Blood Donor Responses
CREATE TABLE blood_donor_responses (
  id TEXT PRIMARY KEY,
  blood_request_id TEXT REFERENCES blood_requests(id) ON DELETE CASCADE,
  donor_id TEXT REFERENCES donors(id) ON DELETE CASCADE,
  status blood_response_status_enum DEFAULT 'INTERESTED',
  responded_at TIMESTAMPTZ DEFAULT now()
);

-- Appointments
CREATE TABLE appointments (
  id TEXT PRIMARY KEY,
  patient_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  doctor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  hospital_id TEXT REFERENCES hospitals(id) ON DELETE SET NULL,
  requested_date_time TIMESTAMPTZ,
  scheduled_date_time TIMESTAMPTZ,
  status appointment_status_enum DEFAULT 'REQUESTED',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Prescriptions
CREATE TABLE prescriptions (
  id TEXT PRIMARY KEY,
  patient_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  doctor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  hospital_id TEXT REFERENCES hospitals(id) ON DELETE SET NULL,
  appointment_id TEXT REFERENCES appointments(id) ON DELETE SET NULL,
  diagnosis TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE prescription_items (
  id TEXT PRIMARY KEY,
  prescription_id TEXT REFERENCES prescriptions(id) ON DELETE CASCADE,
  medicine_name TEXT,
  dosage TEXT,
  frequency TEXT,
  duration TEXT,
  instructions TEXT
);

-- Medicine Orders
CREATE TABLE medicine_orders (
  id TEXT PRIMARY KEY,
  patient_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  prescription_id TEXT REFERENCES prescriptions(id) ON DELETE SET NULL,
  delivery_address TEXT,
  contact_phone TEXT,
  status order_status_enum DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE medicine_order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES medicine_orders(id) ON DELETE CASCADE,
  prescription_item_id TEXT REFERENCES prescription_items(id),
  medicine_name TEXT,
  quantity INTEGER DEFAULT 1
);

-- Notification events
CREATE TABLE notification_events (
  id TEXT PRIMARY KEY,
  type TEXT,
  payload JSONB,
  status notification_status_enum DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_hospitals_district ON hospitals(district);
CREATE INDEX idx_donors_bloodgroup ON donors(blood_group);
CREATE INDEX idx_blood_requests_status ON blood_requests(status);
