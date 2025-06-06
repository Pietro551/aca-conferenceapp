// API Response Types
export interface User {
  id: number;
  email: string;
  full_name: string;
  company_name?: string;
  phone_number?: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Venue {
  id: number;
  name: string;
  description: string;
  city: string;
  address: string;
  capacity: number;
  hourly_rate: number;
  amenities: string[];
  contact_email: string;
  contact_phone: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  venue_id: number;
  user_id: number;
  start_time: string;
  end_time: string;
  total_cost: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  venue?: Venue;
  user?: User;
}

// Auth Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  company_name?: string;
  phone_number?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Form Types
export interface VenueFilters {
  city?: string;
  min_capacity?: number;
  max_capacity?: number;
  min_price?: number;
  max_price?: number;
  amenities?: string[];
}

export interface BookingRequest {
  venue_id: number;
  start_time: string;
  end_time: string;
  notes?: string;
}

export interface VenueCreateRequest {
  name: string;
  description: string;
  city: string;
  address: string;
  capacity: number;
  hourly_rate: number;
  amenities: string[];
  contact_email: string;
  contact_phone: string;
}

// API Error Response
export interface ApiError {
  detail: string;
}

// Context Types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// Component Props
export interface VenueCardProps {
  venue: Venue;
  onBook?: () => void;
  onEdit?: () => void;
  showActions?: boolean;
}

export interface BookingCardProps {
  booking: Booking;
  onCancel?: () => void;
  onConfirm?: () => void;
  showActions?: boolean;
}
