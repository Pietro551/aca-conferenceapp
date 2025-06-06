import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { bookingsAPI } from '../services/api';
import { Booking } from '../types';
import BookingCard from '../components/BookingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const BookingsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: bookings, isLoading, error } = useQuery(
    'bookings',
    bookingsAPI.getBookings,
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );

  const cancelBookingMutation = useMutation(bookingsAPI.cancelBooking, {
    onSuccess: () => {
      queryClient.invalidateQueries('bookings');
      toast.success('Booking cancelled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to cancel booking');
    },
  });

  const handleCancelBooking = (bookingId: number) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBookingMutation.mutate(bookingId);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading your bookings..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-danger-600">
          Error loading bookings. Please try again later.
        </div>
      </div>
    );
  }

  const upcomingBookings = bookings?.filter(booking => 
    new Date(booking.start_time) > new Date() && booking.status !== 'cancelled'
  ) || [];

  const pastBookings = bookings?.filter(booking => 
    new Date(booking.end_time) < new Date() || booking.status === 'cancelled'
  ) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Bookings</h1>
        <p className="text-lg text-gray-600">
          View and manage your conference room bookings.
        </p>
      </div>

      {/* Upcoming Bookings */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Upcoming Bookings ({upcomingBookings.length})
        </h2>

        {upcomingBookings.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={() => handleCancelBooking(booking.id)}
                showActions={true}
              />
            ))}
          </div>
        ) : (
          <div className="card">
            <div className="card-body text-center py-12">
              <div className="text-gray-500 mb-4">No upcoming bookings</div>
              <a
                href="/venues"
                className="btn btn-primary"
              >
                Browse Venues
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Past Bookings */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Past Bookings ({pastBookings.length})
        </h2>

        {pastBookings.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                showActions={false}
              />
            ))}
          </div>
        ) : (
          <div className="card">
            <div className="card-body text-center py-8">
              <div className="text-gray-500">No past bookings</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
