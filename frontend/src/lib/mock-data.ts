import { BloodGroup, BloodRequest, Hospital, HospitalOffer, Specialty, Doctor, Donor, Prescription } from '@/types';

export const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const specialties: Specialty[] = [
  { id: '1', name: 'General Medicine', description: 'Primary healthcare and general consultations', icon: 'stethoscope' },
  { id: '2', name: 'Cardiology', description: 'Heart and cardiovascular system', icon: 'heart' },
  { id: '3', name: 'Pediatrics', description: 'Child healthcare', icon: 'baby' },
  { id: '4', name: 'Orthopedics', description: 'Bone and joint care', icon: 'bone' },
  { id: '5', name: 'Gynecology', description: "Women's health", icon: 'female' },
  { id: '6', name: 'Dermatology', description: 'Skin care', icon: 'fingerprint' },
  { id: '7', name: 'Ophthalmology', description: 'Eye care', icon: 'eye' },
  { id: '8', name: 'ENT', description: 'Ear, nose, and throat', icon: 'ear' },
  { id: '9', name: 'Neurology', description: 'Brain and nervous system', icon: 'brain' },
  { id: '10', name: 'Dentistry', description: 'Dental and oral care', icon: 'tooth' },
];

export const mockHospitals: Hospital[] = [
  {
    id: '1',
    name: 'City General Hospital',
    description: 'A leading multi-specialty hospital serving the community for over 25 years with state-of-the-art facilities.',
    address: {
      line: '123 Healthcare Road',
      city: 'Raipur',
      district: 'Raipur',
      state: 'Chhattisgarh',
      pinCode: '492001',
    },
    phone: '+91 98765 43210',
    email: 'info@citygeneralhospital.com',
    specialties: ['General Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics'],
    rating: 4.5,
    reviewCount: 234,
    isApproved: true,
    createdByUserId: 'admin1',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
  },
  {
    id: '2',
    name: 'Sanjeevani Health Center',
    description: 'Community health center focused on affordable and accessible healthcare for rural populations.',
    address: {
      line: '45 Village Road',
      city: 'Durg',
      district: 'Durg',
      state: 'Chhattisgarh',
      pinCode: '491001',
    },
    phone: '+91 98765 43211',
    specialties: ['General Medicine', 'Gynecology', 'Pediatrics'],
    rating: 4.2,
    reviewCount: 156,
    isApproved: true,
    createdByUserId: 'admin2',
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800',
  },
  {
    id: '3',
    name: 'Ayush Eye Hospital',
    description: 'Specialized eye care hospital with advanced diagnostic and surgical facilities.',
    address: {
      line: '78 Vision Plaza',
      city: 'Bilaspur',
      district: 'Bilaspur',
      state: 'Chhattisgarh',
      pinCode: '495001',
    },
    phone: '+91 98765 43212',
    specialties: ['Ophthalmology'],
    rating: 4.8,
    reviewCount: 312,
    isApproved: true,
    createdByUserId: 'admin3',
    imageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800',
  },
  {
    id: '4',
    name: 'Lifeline Cardiac Care',
    description: 'Premier cardiac care center with 24/7 emergency services and experienced cardiologists.',
    address: {
      line: '12 Heart Avenue',
      city: 'Raipur',
      district: 'Raipur',
      state: 'Chhattisgarh',
      pinCode: '492009',
    },
    phone: '+91 98765 43213',
    specialties: ['Cardiology', 'General Medicine'],
    rating: 4.7,
    reviewCount: 189,
    isApproved: true,
    createdByUserId: 'admin4',
    imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800',
  },
];

export const mockOffers: HospitalOffer[] = [
  {
    id: '1',
    hospitalId: '1',
    title: 'Complete Health Checkup Package',
    description: 'Comprehensive health screening including blood tests, ECG, X-ray, and consultation with general physician.',
    originalPrice: 3500,
    discountedPrice: 1999,
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2024-12-31'),
    isActive: true,
  },
  {
    id: '2',
    hospitalId: '1',
    title: 'Heart Care Package',
    description: 'Complete cardiac evaluation including ECG, Echo, TMT, and cardiologist consultation.',
    originalPrice: 5000,
    discountedPrice: 3499,
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2024-12-31'),
    isActive: true,
  },
  {
    id: '3',
    hospitalId: '2',
    title: 'Women\'s Health Camp',
    description: 'Free gynecology consultation and basic checkup for women. Every Saturday.',
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2024-12-31'),
    isActive: true,
  },
  {
    id: '4',
    hospitalId: '3',
    title: 'Free Eye Screening',
    description: 'Free basic eye examination and vision testing. Walk-in on Sundays.',
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2024-12-31'),
    isActive: true,
  },
];

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    userId: 'doc1',
    hospitalId: '1',
    name: 'Dr. Rajesh Kumar',
    specialization: 'General Medicine',
    registrationNumber: 'CG12345',
    isActive: true,
    experience: 15,
    qualification: 'MBBS, MD (Medicine)',
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
  },
  {
    id: '2',
    userId: 'doc2',
    hospitalId: '1',
    name: 'Dr. Priya Sharma',
    specialization: 'Cardiology',
    registrationNumber: 'CG12346',
    isActive: true,
    experience: 12,
    qualification: 'MBBS, DM (Cardiology)',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
  },
  {
    id: '3',
    userId: 'doc3',
    hospitalId: '2',
    name: 'Dr. Sunita Verma',
    specialization: 'Gynecology',
    registrationNumber: 'CG12347',
    isActive: true,
    experience: 20,
    qualification: 'MBBS, MS (OBG)',
    imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
  },
];

export const mockBloodRequests: BloodRequest[] = [
  {
    id: '1',
    hospitalId: '1',
    hospitalName: 'City General Hospital',
    patientNameOrCode: 'Patient #2341',
    bloodGroupRequired: 'O-',
    urgencyLevel: 'critical',
    neededBy: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    locationDescription: 'City General Hospital, Emergency Ward',
    contactPersonName: 'Nurse Rekha',
    contactPhone: '+91 98765 43210',
    status: 'active',
    notes: 'Accident case. Requires 3 units urgently.',
    createdByUserId: 'admin1',
    createdAt: new Date(),
    updatedAt: new Date(),
    respondersCount: 2,
  },
  {
    id: '2',
    hospitalId: '2',
    hospitalName: 'Sanjeevani Health Center',
    patientNameOrCode: 'Patient #1205',
    bloodGroupRequired: 'B+',
    urgencyLevel: 'medium',
    neededBy: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    locationDescription: 'Sanjeevani Health Center, Blood Bank',
    contactPersonName: 'Dr. Sharma',
    contactPhone: '+91 98765 43211',
    status: 'active',
    notes: 'Scheduled surgery. Need 2 units.',
    createdByUserId: 'admin2',
    createdAt: new Date(),
    updatedAt: new Date(),
    respondersCount: 5,
  },
  {
    id: '3',
    hospitalId: '4',
    hospitalName: 'Lifeline Cardiac Care',
    patientNameOrCode: 'Patient #0089',
    bloodGroupRequired: 'A+',
    urgencyLevel: 'high',
    neededBy: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
    locationDescription: 'Lifeline Cardiac Care, ICU',
    contactPersonName: 'Sister Mary',
    contactPhone: '+91 98765 43213',
    status: 'active',
    notes: 'Post-operative care. 1 unit needed.',
    createdByUserId: 'admin4',
    createdAt: new Date(),
    updatedAt: new Date(),
    respondersCount: 3,
  },
];

export const mockDonors: Donor[] = [
  {
    id: '1',
    userId: 'donor1',
    bloodGroup: 'O+',
    availability: 'available',
    location: {
      line: '45 Green Street',
      city: 'Raipur',
      district: 'Raipur',
      state: 'Chhattisgarh',
      pinCode: '492001',
    },
    lastDonationDate: new Date('2024-06-15'),
  },
  {
    id: '2',
    userId: 'donor2',
    bloodGroup: 'A+',
    availability: 'available',
    location: {
      line: '78 Station Road',
      city: 'Durg',
      district: 'Durg',
      state: 'Chhattisgarh',
      pinCode: '491001',
    },
  },
  {
    id: '3',
    userId: 'donor3',
    bloodGroup: 'B-',
    availability: 'unavailable',
    location: {
      line: '12 Market Area',
      city: 'Bilaspur',
      district: 'Bilaspur',
      state: 'Chhattisgarh',
      pinCode: '495001',
    },
  },
];

export const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    patientId: 'patient1',
    patientName: 'Ramesh Kumar',
    doctorId: 'doc1',
    doctorName: 'Dr. Rajesh Kumar',
    hospitalId: '1',
    hospitalName: 'City General Hospital',
    diagnosis: 'Viral Fever with throat infection',
    items: [
      {
        id: '1',
        prescriptionId: '1',
        medicineName: 'Paracetamol 500mg',
        dosage: '1 tablet',
        frequency: 'Three times a day',
        duration: '5 days',
        instructions: 'After meals',
      },
      {
        id: '2',
        prescriptionId: '1',
        medicineName: 'Azithromycin 500mg',
        dosage: '1 tablet',
        frequency: 'Once a day',
        duration: '3 days',
        instructions: 'Empty stomach',
      },
    ],
    createdAt: new Date('2024-11-25'),
  },
];

export const getBloodGroupVariant = (bloodGroup: BloodGroup) => {
  const variants: Record<BloodGroup, string> = {
    'A+': 'blood-a-pos',
    'A-': 'blood-a-neg',
    'B+': 'blood-b-pos',
    'B-': 'blood-b-neg',
    'AB+': 'blood-ab-pos',
    'AB-': 'blood-ab-neg',
    'O+': 'blood-o-pos',
    'O-': 'blood-o-neg',
  };
  return variants[bloodGroup] as any;
};

export const getUrgencyVariant = (urgency: string) => {
  const variants: Record<string, string> = {
    low: 'secondary',
    medium: 'warning',
    high: 'destructive',
    critical: 'critical',
  };
  return variants[urgency] || 'secondary';
};
