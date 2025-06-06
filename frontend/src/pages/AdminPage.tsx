import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { bookingsAPI, venuesAPI, usersAPI } from '../services/api';
import { Booking, Venue, User } from '../types';
import BookingCard from '../components/BookingCard';
import VenueCard from '../components/VenueCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'venues' | 'users'>('bookings');
  const queryClient = useQueryClient();

  // Queries
  const { data: allBookings, isLoading: bookingsLoading } = useQuery(
    'admin-bookings',
    bookingsAPI.getAllBookings,
    { enabled: activeTab === 'bookings' }
  );

  const { data: venues, isLoading: venuesLoading } = useQuery(
    'admin-venues',
    () => venuesAPI.getVenues(),
    { enabled: activeTab === 'venues' }
  );

  const { data: users, isLoading: usersLoading } = useQuery(
    'admin-users',
    usersAPI.getUsers,
    { enabled: activeTab === 'users' }
  );

  // Mutations
  const confirmBookingMutation = useMutation(bookingsAPI.confirmBooking, {
    onSuccess: () => {
      queryClient.invalidateQueries('admin-bookings');
      toast.success('Booking confirmed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to confirm booking');
    },
  });

  const cancelBookingMutation = useMutation(bookingsAPI.cancelBooking, {
    onSuccess: () => {
      queryClient.invalidateQueries('admin-bookings');
      toast.success('Booking cancelled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to cancel booking');
    },
  });

  const deactivateUserMutation = useMutation(usersAPI.deactivateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('admin-users');
      toast.success('User deactivated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to deactivate user');
    },
  });

  const handleConfirmBooking = (bookingId: number) => {
    confirmBookingMutation.mutate(bookingId);
  };

  const handleCancelBooking = (bookingId: number) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBookingMutation.mutate(bookingId);
    }
  };

  const handleDeactivateUser = (userId: number) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      deactivateUserMutation.mutate(userId);
    }
  };

  const tabs = [
    { id: 'bookings', label: 'Bookings', count: allBookings?.length || 0 },
    { id: 'venues', label: 'Venues', count: venues?.length || 0 },
    { id: 'users', label: 'Users', count: users?.length || 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        <p className="text-lg text-gray-600">
          Manage bookings, venues, and users across the platform.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'bookings' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">All Bookings</h2>
          </div>

          {bookingsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading bookings..." />
            </div>
          ) : allBookings && allBookings.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onConfirm={() => handleConfirmBooking(booking.id)}
                  onCancel={() => handleCancelBooking(booking.id)}
                  showActions={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No bookings found.
            </div>
          )}
        </div>
      )}

      {activeTab === 'venues' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">All Venues</h2>
            <button className="btn btn-primary">Add New Venue</button>
          </div>

          {venuesLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading venues..." />
            </div>
          ) : venues && venues.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  onEdit={() => {
                    // TODO: Implement venue editing
                    toast.info('Venue editing coming soon');
                  }}
                  showActions={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No venues found.
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">All Users</h2>
          </div>

          {usersLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading users..." />
            </div>
          ) : users && users.length > 0 ? (
            <div className="grid gap-4">
              {users.map((user) => (
                <div key={user.id} className="card">
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.full_name}
                        </h3>
                        <p className="text-gray-600">{user.email}</p>
                        {user.company_name && (
                          <p className="text-sm text-gray-500">{user.company_name}</p>
                        )}
                        {user.phone_number && (
                          <p className="text-sm text-gray-500">{user.phone_number}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.is_admin 
                            ? 'bg-purple-50 text-purple-700' 
                            : 'bg-blue-50 text-blue-700'
                        }`}>
                          {user.is_admin ? 'Admin' : 'User'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.is_active 
                            ? 'bg-success-50 text-success-700' 
                            : 'bg-danger-50 text-danger-700'
                        }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                        {user.is_active && !user.is_admin && (
                          <button
                            onClick={() => handleDeactivateUser(user.id)}
                            className="btn btn-danger text-xs"
                          >
                            Deactivate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No users found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
