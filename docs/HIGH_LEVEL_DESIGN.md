# ChikitsaVigyan — High Level Design

Date: 2025-11-30

This document provides a concise high-level design for ChikitsaVigyan: pages required (and which exist), the database structure, data files currently available, and recommended next steps (seed scripts, backend scaffold and Prisma schema).

## 1. Current repo snapshot (frontend prototype)

Files and pages already present (checked under `src/pages`):

- `Index.tsx` — Home / Dashboard (implemented)
- `Hospitals.tsx` — Hospitals list (implemented)
- `HospitalDetail.tsx` — Hospital detail page (implemented)
- `BloodDonation.tsx` — Blood donation / donor flows (implemented)
- `Auth.tsx` — Authentication (implemented)
- `Prescriptions.tsx` — Prescriptions list / detail (implemented)
- `NotFound.tsx` — 404 page (implemented)

Components and helpers:
- `src/components/*` — UI building blocks and home sections (Hero, Features, HospitalsSection, etc.)
- `src/lib/mock-data.ts` — Mock data used by the frontend (hospitals, offers, doctors, blood requests, donors, prescriptions). This file is the primary seed-data source for the frontend.

Notes: The current frontend is Vite + React + TypeScript + Tailwind and has a clean component structure. The design below reuses these pages and expands the backend and db to match the product requirements.

## 2. Required pages (per role) — mapping to existing pages

I list pages the product needs grouped by role. Where an existing page matches, it is marked (IMPLEMENTED).

Common pages (public/auth):
- Login / Register (existing: `Auth.tsx`) — IMPLEMENTED
- Landing / Home / Dashboard (existing: `Index.tsx`) — IMPLEMENTED
- NotFound (existing: `NotFound.tsx`) — IMPLEMENTED

Patient pages:
- Patient Dashboard (shows recommendations, offers, appointments summary) — (use `Index.tsx` as start)
- Hospitals list & filters (existing: `Hospitals.tsx`) — IMPLEMENTED
- Hospital detail (existing: `HospitalDetail.tsx`) — IMPLEMENTED
- Appointment request page (to request a doctor) — NEW (can reuse hospital detail flow)
- Prescriptions list (existing: `Prescriptions.tsx`) — IMPLEMENTED
- Prescription detail + Order Medicines — NEW (UI can be added under `Prescriptions.tsx`)
- Medicine Orders list & detail — NEW

Donor pages:
- Donor profile/setup (register blood group, location, availability) — NEW (frontend has BloodDonation flows)
- Nearby requests feed (respond) (existing: `BloodDonation.tsx` can be extended) — PARTIALLY IMPLEMENTED
- Donor response history — NEW

Doctor pages:
- Doctor Dashboard (appointments & patients) — NEW
- Appointment detail & create prescription — NEW (prescription UI exists as data model; integrate with doctor flows)
- Prescriptions written by doctor (list) — NEW

Hospital Admin pages:
- Hospital profile management — NEW (UI to manage hospital fields and offers)
- Doctors management (add/approve doctors) — NEW
- Blood requests management (create/edit/fulfill/cancel) — NEW (frontend `BloodDonation.tsx` contains examples)
- Offers / Packages management — NEW

System Admin pages:
- Admin Dashboard (global stats) — NEW
- Hospitals approval list — NEW
- Users & Roles management — NEW

UX notes:
- Keep mobile-first design. Use large tappable buttons and simple flows for rural users.
- Reuse and extend existing components in `src/components/ui/*` for consistent look-and-feel.

## 3. Database structure (suggested Prisma schema / entities)

Below is the recommended set of entities and important fields. This is intentionally compatible with Prisma and PostgreSQL.

- User
  - id: String @id @default(cuid())
  - name: String?
  - email: String? @unique
  - phone: String? @unique
  - passwordHash: String
  - role: Enum (PATIENT, DONOR, DOCTOR, HOSPITAL_ADMIN, ADMIN)
  - addressLine, city, district, state, pinCode: String?
  - createdAt, updatedAt

- Patient (profile extension)
  - id (FK to User)
  - dateOfBirth, gender
  - caretakerOfId? (optional linking)

- Donor
  - id (FK to User)
  - bloodGroup (A+, A-, B+, ...)
  - availabilityStatus (AVAILABLE/UNAVAILABLE)
  - latitude, longitude (optional decimal)
  - lastDonationDate

- Hospital
  - id, name, description
  - address fields (line, city, district, state, pinCode)
  - contactPhone, email, website
  - latitude, longitude
  - isApproved (bool)
  - createdByUserId

- Specialty
  - id, name, description

- HospitalSpecialty (join)
  - hospitalId, specialtyId

- HospitalOffer
  - id, hospitalId, title, description, price?, validFrom, validTo, isActive

- Doctor
  - id (FK User), hospitalId, specialization, registrationNumber, isActive

- BloodRequest
  - id, hospitalId, patientNameOrCode, bloodGroupRequired, urgencyLevel, neededBy (timestamp), locationDescription, contactPersonName, contactPhone, status (ACTIVE/FULFILLED/CANCELLED), createdByUserId, createdAt, updatedAt

- BloodDonorResponse
  - id, bloodRequestId, donorId, status (INTERESTED/CONFIRMED/CANCELLED), respondedAt

- Appointment
  - id, patientId, doctorId, hospitalId, requestedDateTime, scheduledDateTime, status, notes

- Prescription
  - id, patientId, doctorId, hospitalId, appointmentId?, diagnosis, createdAt

- PrescriptionItem
  - id, prescriptionId, medicineName, dosage, frequency, duration, instructions

- MedicineOrder
  - id, patientId, prescriptionId, deliveryAddress (text), contactPhone, status, createdAt, updatedAt

- MedicineOrderItem
  - id, orderId, prescriptionItemId?, medicineName, quantity

- NotificationEvent
  - id, type, payload (JSON), status, createdAt

Notes: data types and relationships should be finalized in `prisma/schema.prisma`. For geographic matching keep both address/district fields and optional lat/long.

## 4. Data files & seed data

- Current seed-like file (frontend): `src/lib/mock-data.ts`
  - Contains arrays for: specialties, mockHospitals, mockOffers, mockDoctors, mockBloodRequests, mockDonors, mockPrescriptions.
  - This file is an ideal starting point for creating SQL seed scripts or Prisma seed JS/TS.

Recommended database seeding approach:
1. Create `prisma/schema.prisma` (models reflecting the DB structure above).
2. Create `prisma/seed.ts` or `database/seed.sql` which inserts data derived from `src/lib/mock-data.ts`.
   - For small demo data, a `database/seed.sql` with INSERT statements is fine.
   - For Prisma-based app, create `prisma/seed.ts` which imports `src/lib/mock-data.ts` (or a converted JSON) and writes records via Prisma client.

Example seed order (SQL / Prisma):
1. Insert specialties
2. Insert users (admins/doctors/donors/patients)
3. Insert hospitals (with createdBy linking to admin)
4. Insert hospital specialties (join table)
5. Insert offers
6. Insert doctors (linked to hospitals)
7. Insert donors
8. Insert blood requests
9. Insert prescriptions + items

Tip: Because `src/lib/mock-data.ts` is TypeScript and includes Date objects, convert to a JSON form (e.g. `scripts/mock-to-seed.json`) or create a small Node script to import the module and generate SQL/Prisma inserts.

## 5. Suggested files and folders to add

- `prisma/schema.prisma` — Prisma models and enums
- `prisma/seed.ts` — Prisma seed script (or `database/seed.sql`)
- `backend/` or use Next.js app router API routes:
  - If you prefer a single Next.js repo, implement backend in `app/api/*` with Prisma and NextAuth.
  - Alternatively create `backend/` with Node/Express or NestJS and a `package.json` + `src/`.

## 6. Next steps (short roadmap)

Phase 1 (MVP):
- Auth + roles + User model + basic RBAC
- Donor model + basic matching by district / availability
- BloodRequest model & donor responses + notification event log
- Seed DB with `mock-data.ts` entries
- Frontend wiring for donor flows and hospital admin flows

Phase 2:
- Hospital & Offers CRUD, Recommendations endpoint (rule-based)
- Doctor & Appointments flows
- Prescription creation and medicine ordering
- Admin pages and approval workflows

Phase 3:
- Notifications (SMS/email via Twilio/SendGrid), geolocation-based matching, ML-based recommendations

## 7. Where existing frontend maps to backend endpoints (suggestion)

- `src/pages/BloodDonation.tsx` → backend: `/api/blood-requests`, `/api/donors`
- `src/pages/Hospitals.tsx` & `components/home/HospitalsSection.tsx` → backend: `/api/hospitals`, `/api/hospitals/:id/offers`, `/api/recommendations/hospitals`
- `src/pages/Prescriptions.tsx` → backend: `/api/prescriptions`, `/api/medicine-orders`

## 8. Final notes

You can use `src/lib/mock-data.ts` as the canonical seed source. I recommend adding `prisma/schema.prisma` and a `prisma/seed.ts` (or `database/seed.sql`) next. If you'd like, I can generate the Prisma schema and a seed script that imports the mock data and writes to the database (Postgres) next — tell me if you prefer Prisma seed script or plain SQL.

---
Generated by assistant to map your existing frontend to the full-stack design and to propose concrete next steps for DB seeding and backend scaffolding.
