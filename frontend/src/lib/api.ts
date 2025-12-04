const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  id: string;
  diagnosis: string;
  createdAt: string;
  doctorName: string;
  hospitalName: string;
  items: PrescriptionItem[];
  order?: {
    id: string;
    status: string;
    createdAt: string;
    updatedAt?: string;
  } | null;
}

// Auth API
export const authAPI = {
  async register(data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role: string;
    bloodGroup?: string;
    hospitalName?: string;
    city?: string;
  }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return response.json();
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },

  async getCurrentUser(): Promise<{ user: User }> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user');
    }

    return response.json();
  },
};

// Prescriptions API
export const prescriptionsAPI = {
  async getAll(): Promise<{ prescriptions: Prescription[] }> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/prescriptions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch prescriptions');
    }

    return response.json();
  },

  async getById(id: string): Promise<{ prescription: Prescription }> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/prescriptions/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch prescription');
    }

    return response.json();
  },

  async createOrder(prescriptionId: string, deliveryAddress?: string, contactPhone?: string): Promise<{ order: { id: string; status: string; createdAt: string } }> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/prescriptions/${prescriptionId}/order`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deliveryAddress, contactPhone }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create order');
    }

    return response.json();
  },
};

// Blood Requests API
export interface BloodRequest {
  id: string;
  patient_name_or_code: string;
  blood_group_required: string;
  urgency_level: string;
  needed_by: string;
  location_description: string;
  contact_person_name: string;
  contact_phone: string;
  status: string;
  notes: string;
  created_at: string;
  hospital_name: string;
  hospital_id: string;
  responders_count: string;
}

export interface BloodRequestStats {
  activeRequests: number;
  availableDonors: number;
  livesSaved: number;
}

export const bloodRequestsAPI = {
  async getAll(): Promise<{ requests: BloodRequest[] }> {
    const response = await fetch(`${API_BASE_URL}/blood-requests`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch blood requests');
    }

    return response.json();
  },

  async getById(id: string): Promise<{ request: BloodRequest }> {
    const response = await fetch(`${API_BASE_URL}/blood-requests/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch blood request');
    }

    return response.json();
  },

  async respond(requestId: string): Promise<{ message: string; responseId: string }> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    const response = await fetch(`${API_BASE_URL}/blood-requests/${requestId}/respond`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to respond to blood request');
    }

    return response.json();
  },

  async getStats(): Promise<BloodRequestStats> {
    const response = await fetch(`${API_BASE_URL}/blood-requests/stats/summary`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch stats');
    }

    return response.json();
  },
};

// Appointments API
export interface Appointment {
  id: string;
  requested_date_time: string;
  scheduled_date_time?: string;
  status: string;
  notes?: string;
  created_at: string;
  hospital_name: string;
  hospital_id: string;
  doctor_name?: string;
  doctor_id?: string;
}

export const appointmentsAPI = {
  async create(data: {
    hospitalId: string;
    doctorId?: string;
    requestedDateTime: string;
    notes?: string;
  }): Promise<{ appointment: Appointment; message: string }> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create appointment');
    }

    return response.json();
  },

  async getAll(): Promise<{ appointments: Appointment[] }> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/appointments`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch appointments');
    }

    return response.json();
  },

  async getById(id: string): Promise<{ appointment: Appointment }> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch appointment');
    }

    return response.json();
  },
};

