import axios, { AxiosResponse } from 'axios';
import {
  User,
  Venue,
  Booking,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  VenueFilters,
  BookingRequest,
  VenueCreateRequest,
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  register: async (data: RegisterData): Promise<User> => {
    const response: AxiosResponse<User> = await api.post('/auth/register', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response: AxiosResponse<User> = await api.get('/users/me');
    return response.data;
  },
};

// Venues API
export const venuesAPI = {
  getVenues: async (filters?: VenueFilters): Promise<Venue[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    
    const response: AxiosResponse<Venue[]> = await api.get(`/venues?${params}`);
    return response.data;
  },

  getVenue: async (id: number): Promise<Venue> => {
    const response: AxiosResponse<Venue> = await api.get(`/venues/${id}`);
    return response.data;
  },

  createVenue: async (data: VenueCreateRequest): Promise<Venue> => {
    const response: AxiosResponse<Venue> = await api.post('/venues', data);
    return response.data;
  },

  updateVenue: async (id: number, data: Partial<VenueCreateRequest>): Promise<Venue> => {
    const response: AxiosResponse<Venue> = await api.put(`/venues/${id}`, data);
    return response.data;
  },

  deleteVenue: async (id: number): Promise<void> => {
    await api.delete(`/venues/${id}`);
  },

  checkAvailability: async (venueId: number, startTime: string, endTime: string): Promise<boolean> => {
    const response: AxiosResponse<{ available: boolean }> = await api.get(
      `/venues/${venueId}/availability?start_time=${encodeURIComponent(startTime)}&end_time=${encodeURIComponent(endTime)}`
    );
    return response.data.available;
  },
};

// Bookings API
export const bookingsAPI = {
  getBookings: async (): Promise<Booking[]> => {
    const response: AxiosResponse<Booking[]> = await api.get('/bookings');
    return response.data;
  },

  getBooking: async (id: number): Promise<Booking> => {
    const response: AxiosResponse<Booking> = await api.get(`/bookings/${id}`);
    return response.data;
  },

  createBooking: async (data: BookingRequest): Promise<Booking> => {
    const response: AxiosResponse<Booking> = await api.post('/bookings', data);
    return response.data;
  },

  updateBooking: async (id: number, data: Partial<BookingRequest>): Promise<Booking> => {
    const response: AxiosResponse<Booking> = await api.put(`/bookings/${id}`, data);
    return response.data;
  },

  cancelBooking: async (id: number): Promise<Booking> => {
    const response: AxiosResponse<Booking> = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  },

  confirmBooking: async (id: number): Promise<Booking> => {
    const response: AxiosResponse<Booking> = await api.put(`/bookings/${id}/confirm`);
    return response.data;
  },

  getAllBookings: async (): Promise<Booking[]> => {
    const response: AxiosResponse<Booking[]> = await api.get('/bookings/all');
    return response.data;
  },
};

// Users API (Admin)
export const usersAPI = {
  getUsers: async (): Promise<User[]> => {
    const response: AxiosResponse<User[]> = await api.get('/users');
    return response.data;
  },

  getUser: async (id: number): Promise<User> => {
    const response: AxiosResponse<User> = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: number, data: Partial<User>): Promise<User> => {
    const response: AxiosResponse<User> = await api.put(`/users/${id}`, data);
    return response.data;
  },

  deactivateUser: async (id: number): Promise<User> => {
    const response: AxiosResponse<User> = await api.put(`/users/${id}/deactivate`);
    return response.data;
  },
};
