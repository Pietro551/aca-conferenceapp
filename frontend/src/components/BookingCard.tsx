import React from 'react';
import { Booking } from '../types';
import { formatDateTime, formatCurrency, capitalizeFirst } from '../utils';

interface BookingCardProps {
  booking: Booking;
  onCancel?: () => void;
  onConfirm?: () => void;
  showActions?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({ 
  booking, 
  onCancel, 
  onConfirm, 
  showActions = true 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success-50 text-success-700';
      case 'pending':
        return 'bg-warning-50 text-warning-700';
      case 'cancelled':
        return 'bg-danger-50 text-danger-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const isPast = new Date(booking.end_time) < new Date();
  const canCancel = booking.status !== 'cancelled' && !isPast;
  const canConfirm = booking.status === 'pending' && !isPast;

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {booking.venue?.name || `Venue #${booking.venue_id}`}
          </h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
            {capitalizeFirst(booking.status)}
          </span>
        </div>

        {booking.venue && (
          <p className="text-gray-600 text-sm mb-3">
            {booking.venue.city}, {booking.venue.address}
          </p>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDateTime(booking.start_time)} - {formatDateTime(booking.end_time)}
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Total Cost: {formatCurrency(booking.total_cost)}
          </div>

          {booking.user && (
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {booking.user.full_name} ({booking.user.email})
            </div>
          )}
        </div>

        {booking.notes && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Notes:</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {booking.notes}
            </p>
          </div>
        )}

        {isPast && (
          <div className="mb-4 p-2 bg-gray-50 rounded text-sm text-gray-600">
            This booking has ended.
          </div>
        )}

        {showActions && (canCancel || canConfirm) && (
          <div className="flex gap-2">
            {canConfirm && onConfirm && (
              <button
                onClick={onConfirm}
                className="btn btn-success"
              >
                Confirm
              </button>
            )}
            {canCancel && onCancel && (
              <button
                onClick={onCancel}
                className="btn btn-danger"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
