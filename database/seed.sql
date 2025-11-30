-- Seed data for ChikitsaVigyan (Postgres)
-- Assumes schema from schema.sql has been created

-- Specialties
INSERT INTO specialties (id, name, description) VALUES
('1','General Medicine','Primary healthcare and general consultations'),
('2','Cardiology','Heart and cardiovascular system'),
('3','Pediatrics','Child healthcare'),
('4','Orthopedics','Bone and joint care'),
('5','Gynecology',"Women's health"),
('6','Dermatology','Skin care'),
('7','Ophthalmology','Eye care'),
('8','ENT','Ear, nose, and throat'),
('9','Neurology','Brain and nervous system'),
('10','Dentistry','Dental and oral care')
ON CONFLICT (id) DO NOTHING;

-- Users (admins/hospital creators, doctors, donors, patients)
INSERT INTO users (id, name, email, phone, password_hash, role, created_at)
VALUES
('admin1','Admin One','admin1@example.local','+911111111111',NULL,'HOSPITAL_ADMIN',now()),
('admin2','Admin Two','admin2@example.local','+911111111112',NULL,'HOSPITAL_ADMIN',now()),
('admin3','Admin Three','admin3@example.local','+911111111113',NULL,'HOSPITAL_ADMIN',now()),
('admin4','Admin Four','admin4@example.local','+911111111114',NULL,'HOSPITAL_ADMIN',now()),
('doc1','Dr Rajesh Kumar','doc1@example.local',NULL,NULL,'DOCTOR',now()),
('doc2','Dr Priya Sharma','doc2@example.local',NULL,NULL,'DOCTOR',now()),
('doc3','Dr Sunita Verma','doc3@example.local',NULL,NULL,'DOCTOR',now()),
('donor1','Donor One','donor1@example.local',NULL,NULL,'DONOR',now()),
('donor2','Donor Two','donor2@example.local',NULL,NULL,'DONOR',now()),
('donor3','Donor Three','donor3@example.local',NULL,NULL,'DONOR',now()),
('patient1','Ramesh Kumar','patient1@example.local',NULL,NULL,'PATIENT',now())
ON CONFLICT (id) DO NOTHING;

-- Hospitals
INSERT INTO hospitals (id, name, description, address_line, city, district, state, pin_code, contact_phone, email, is_approved, created_by_user_id, created_at)
VALUES
('1','City General Hospital','A leading multi-specialty hospital serving the community for over 25 years with state-of-the-art facilities.','123 Healthcare Road','Raipur','Raipur','Chhattisgarh','492001','+91 98765 43210','info@citygeneralhospital.com',true,'admin1',now()),
('2','Sanjeevani Health Center','Community health center focused on affordable and accessible healthcare for rural populations.','45 Village Road','Durg','Durg','Chhattisgarh','491001','+91 98765 43211',NULL,true,'admin2',now()),
('3','Ayush Eye Hospital','Specialized eye care hospital with advanced diagnostic and surgical facilities.','78 Vision Plaza','Bilaspur','Bilaspur','Chhattisgarh','495001','+91 98765 43212',NULL,true,'admin3',now()),
('4','Lifeline Cardiac Care','Premier cardiac care center with 24/7 emergency services and experienced cardiologists.','12 Heart Avenue','Raipur','Raipur','Chhattisgarh','492009','+91 98765 43213',NULL,true,'admin4',now())
ON CONFLICT (id) DO NOTHING;

-- Hospital specialties (map by name -> id)
INSERT INTO hospital_specialties (id, hospital_id, specialty_id)
VALUES
('hs1','1','1'), ('hs1b','1','2'), ('hs1c','1','3'), ('hs1d','1','4'),
('hs2','2','1'), ('hs2b','2','5'), ('hs2c','2','3'),
('hs3','3','7'),
('hs4','4','2'), ('hs4b','4','1')
ON CONFLICT (id) DO NOTHING;

-- Offers
INSERT INTO hospital_offers (id, hospital_id, title, description, price, valid_from, valid_to, is_active)
VALUES
('offer1','1','Complete Health Checkup Package','Comprehensive health screening including blood tests, ECG, X-ray, and consultation with general physician.',3500, '2024-01-01'::timestamptz, '2024-12-31'::timestamptz, true),
('offer2','1','Heart Care Package','Complete cardiac evaluation including ECG, Echo, TMT, and cardiologist consultation.',5000, '2024-01-01'::timestamptz, '2024-12-31'::timestamptz, true),
('offer3','2','Women''s Health Camp','Free gynecology consultation and basic checkup for women. Every Saturday.', NULL, '2024-01-01'::timestamptz, '2024-12-31'::timestamptz, true),
('offer4','3','Free Eye Screening','Free basic eye examination and vision testing. Walk-in on Sundays.', NULL, '2024-01-01'::timestamptz, '2024-12-31'::timestamptz, true)
ON CONFLICT (id) DO NOTHING;

-- Doctors
INSERT INTO doctors (id, hospital_id, name, specialization, registration_number, is_active, experience, qualification)
VALUES
('doc1','1','Dr. Rajesh Kumar','General Medicine','CG12345',true,15,'MBBS, MD (Medicine)'),
('doc2','1','Dr. Priya Sharma','Cardiology','CG12346',true,12,'MBBS, DM (Cardiology)'),
('doc3','2','Dr. Sunita Verma','Gynecology','CG12347',true,20,'MBBS, MS (OBG)')
ON CONFLICT (id) DO NOTHING;

-- Donors
INSERT INTO donors (id, blood_group, availability, last_donation_date)
VALUES
('donor1','O+','AVAILABLE','2024-06-15'),
('donor2','A+','AVAILABLE',NULL),
('donor3','B-','UNAVAILABLE',NULL)
ON CONFLICT (id) DO NOTHING;

-- Blood Requests
INSERT INTO blood_requests (id, hospital_id, patient_name_or_code, blood_group_required, urgency_level, needed_by, location_description, contact_person_name, contact_phone, status, notes, created_by_user_id, created_at, updated_at)
VALUES
('br1','1','Patient #2341','O-','CRITICAL', now() + interval '4 hours','City General Hospital, Emergency Ward','Nurse Rekha','+91 98765 43210','ACTIVE','Accident case. Requires 3 units urgently.','admin1',now(),now()),
('br2','2','Patient #1205','B+','MEDIUM', now() + interval '24 hours','Sanjeevani Health Center, Blood Bank','Dr. Sharma','+91 98765 43211','ACTIVE','Scheduled surgery. Need 2 units.','admin2',now(),now()),
('br3','4','Patient #0089','A+','HIGH', now() + interval '8 hours','Lifeline Cardiac Care, ICU','Sister Mary','+91 98765 43213','ACTIVE','Post-operative care. 1 unit needed.','admin4',now(),now())
ON CONFLICT (id) DO NOTHING;

-- Prescriptions and items
INSERT INTO prescriptions (id, patient_id, patient_id, doctor_id, doctor_id, hospital_id, diagnosis, created_at)
VALUES ('pres1','patient1','patient1','doc1','doc1','1','Viral Fever with throat infection','2024-11-25'::timestamptz)
ON CONFLICT (id) DO NOTHING;

INSERT INTO prescription_items (id, prescription_id, medicine_name, dosage, frequency, duration, instructions)
VALUES
('pi1','pres1','Paracetamol 500mg','1 tablet','Three times a day','5 days','After meals'),
('pi2','pres1','Azithromycin 500mg','1 tablet','Once a day','3 days','Empty stomach')
ON CONFLICT (id) DO NOTHING;

-- Example notification events (logged, not sent)
INSERT INTO notification_events (id, type, payload, status)
VALUES
('n1','BLOOD_REQUEST_CREATED', jsonb_build_object('blood_request_id','br1'), 'PENDING'),
('n2','BLOOD_REQUEST_CREATED', jsonb_build_object('blood_request_id','br2'), 'PENDING')
ON CONFLICT (id) DO NOTHING;
