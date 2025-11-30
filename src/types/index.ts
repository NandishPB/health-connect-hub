// User roles
export type UserRole = 'patient' | 'donor' | 'doctor' | 'hospital_admin' | 'admin';

// Blood groups
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

// Urgency levels
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

// Blood request status
export type BloodRequestStatus = 'active' | 'fulfilled' | 'cancelled';

// Donor availability
export type DonorAvailability = 'available' | 'unavailable';

// Appointment status
export type AppointmentStatus = 'requested' | 'confirmed' | 'completed' | 'cancelled';

// Order status
export type OrderStatus = 'pending' | 'accepted' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';

// User
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address?: Address;
  createdAt: Date;
  updatedAt: Date;
}

// Address
export interface Address {
  line: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
  latitude?: number;
  longitude?: number;
}

// Patient
export interface Patient extends User {
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  caretakerOfPatientId?: string;
}

// Donor
export interface Donor {
  id: string;
  userId: string;
  bloodGroup: BloodGroup;
  availability: DonorAvailability;
  location: Address;
  latitude?: number;
  longitude?: number;
  lastDonationDate?: Date;
}

// Hospital
export interface Hospital {
  id: string;
  name: string;
  description?: string;
  address: Address;
  phone: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  specialties: string[];
  rating?: number;
  reviewCount?: number;
  isApproved: boolean;
  createdByUserId: string;
  imageUrl?: string;
}

// Specialty
export interface Specialty {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

// Hospital Offer
export interface HospitalOffer {
  id: string;
  hospitalId: string;
  title: string;
  description: string;
  originalPrice?: number;
  discountedPrice?: number;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
  imageUrl?: string;
}

// Doctor
export interface Doctor {
  id: string;
  userId: string;
  hospitalId: string;
  name: string;
  specialization: string;
  registrationNumber: string;
  isActive: boolean;
  imageUrl?: string;
  experience?: number;
  qualification?: string;
}

// Blood Request
export interface BloodRequest {
  id: string;
  hospitalId: string;
  hospitalName: string;
  patientNameOrCode: string;
  bloodGroupRequired: BloodGroup;
  urgencyLevel: UrgencyLevel;
  neededBy: Date;
  locationDescription: string;
  contactPersonName: string;
  contactPhone: string;
  status: BloodRequestStatus;
  notes?: string;
  createdByUserId: string;
  createdAt: Date;
  updatedAt: Date;
  respondersCount?: number;
}

// Blood Donor Response
export interface BloodDonorResponse {
  id: string;
  bloodRequestId: string;
  donorId: string;
  donorName: string;
  donorPhone: string;
  status: 'interested' | 'confirmed' | 'cancelled';
  respondedAt: Date;
}

// Appointment
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  hospitalId: string;
  hospitalName: string;
  requestedDateTime: Date;
  scheduledDateTime?: Date;
  status: AppointmentStatus;
  notes?: string;
}

// Prescription
export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  hospitalId: string;
  hospitalName: string;
  appointmentId?: string;
  diagnosis: string;
  items: PrescriptionItem[];
  createdAt: Date;
}

// Prescription Item
export interface PrescriptionItem {
  id: string;
  prescriptionId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

// Medicine Order
export interface MedicineOrder {
  id: string;
  patientId: string;
  prescriptionId: string;
  deliveryAddress: Address;
  contactPhone: string;
  status: OrderStatus;
  items: MedicineOrderItem[];
  totalAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Medicine Order Item
export interface MedicineOrderItem {
  id: string;
  orderId: string;
  prescriptionItemId: string;
  medicineName: string;
  quantity: number;
  price?: number;
}

// Notification Event (for future)
export interface NotificationEvent {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  status: 'pending' | 'sent' | 'failed';
  createdAt: Date;
}
