import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { bookingsAPI, venuesAPI } from '../services/api';
import { Venue, BookingRequest } from '../types';
import { formatCurrency, calculateDuration, generateTimeSlots } from '../utils';
import LoadingSpinner from './LoadingSpinner';
import { toast } from 'react-toastify';

interface BookingModalProps {
  venue: Venue;
  onClose: () => void;
  onSuccess: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ venue, onClose, onSuccess }) => {
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<BookingRequest & { date: string; startTime: string; endTime: string }>();

  const watchedValues = watch(['date', 'startTime', 'endTime']);

  const createBookingMutation = useMutation(bookingsAPI.createBooking, {
    onSuccess: () => {
      queryClient.invalidateQueries('bookings');
      toast.success('Booking created successfully!');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create booking');
    },
  });

  // Calculate estimated cost when time changes
  React.useEffect(() => {
    const [date, startTime, endTime] = watchedValues;
    if (date && startTime && endTime) {
      const startDateTime = `${date}T${startTime}:00`;
      const endDateTime = `${date}T${endTime}:00`;
      const duration = calculateDuration(startDateTime, endDateTime);
      if (duration > 0) {
        setEstimatedCost(duration * venue.hourly_rate);
      }
    }
  }, [watchedValues, venue.hourly_rate]);

  const checkAvailability = async (date: string, startTime: string, endTime: string) => {
    if (!date || !startTime || !endTime) return;

    const startDateTime = `${date}T${startTime}:00`;
    const endDateTime = `${date}T${endTime}:00`;

    if (new Date(endDateTime) <= new Date(startDateTime)) {
      setError('endTime', { message: 'End time must be after start time' });
      return;
    }

    setIsCheckingAvailability(true);
    try {
      const available = await venuesAPI.checkAvailability(venue.id, startDateTime, endDateTime);
      if (!available) {
        setError('startTime', { message: 'This time slot is not available' });
      }
    } catch (error) {
      toast.error('Failed to check availability');
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const onSubmit = async (data: BookingRequest & { date: string; startTime: string; endTime: string }) => {
    const startDateTime = `${data.date}T${data.startTime}:00`;
    const endDateTime = `${data.date}T${data.endTime}:00`;

    const bookingData: BookingRequest = {
      venue_id: venue.id,
      start_time: startDateTime,
      end_time: endDateTime,
      notes: data.notes,
    };

    createBookingMutation.mutate(bookingData);
  };

  const timeSlots = generateTimeSlots();
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Book Venue</h2>
              <p className="text-gray-600">{venue.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Venue Info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Location:</span> {venue.city}, {venue.address}
              </div>
              <div>
                <span className="font-medium">Capacity:</span> {venue.capacity} people
              </div>
              <div>
                <span className="font-medium">Hourly Rate:</span> {formatCurrency(venue.hourly_rate)}
              </div>
              <div>
                <span className="font-medium">Contact:</span> {venue.contact_phone}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Date *</label>
                <input
                  {...register('date', {
                    required: 'Date is required',
                    validate: (value) => {
                      const selectedDate = new Date(value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return selectedDate >= today || 'Date cannot be in the past';
                    },
                  })}
                  type="date"
                  min={today}
                  className="form-input"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-danger-600">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Start Time *</label>
                <select
                  {...register('startTime', { required: 'Start time is required' })}
                  className="form-input"
                  onChange={(e) => {
                    const [date, , endTime] = watchedValues;
                    if (date && endTime) {
                      checkAvailability(date, e.target.value, endTime);
                    }
                  }}
                >
                  <option value="">Select time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                {errors.startTime && (
                  <p className="mt-1 text-sm text-danger-600">{errors.startTime.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">End Time *</label>
                <select
                  {...register('endTime', { required: 'End time is required' })}
                  className="form-input"
                  onChange={(e) => {
                    const [date, startTime] = watchedValues;
                    if (date && startTime) {
                      checkAvailability(date, startTime, e.target.value);
                    }
                  }}
                >
                  <option value="">Select time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                {errors.endTime && (
                  <p className="mt-1 text-sm text-danger-600">{errors.endTime.message}</p>
                )}
              </div>
            </div>

            {isCheckingAvailability && (
              <div className="flex items-center text-sm text-blue-600">
                <LoadingSpinner size="sm" text="" />
                <span className="ml-2">Checking availability...</span>
              </div>
            )}

            <div>
              <label className="form-label">Notes (Optional)</label>
              <textarea
                {...register('notes')}
                className="form-input"
                rows={3}
                placeholder="Any special requirements or notes..."
              />
            </div>

            {estimatedCost > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-blue-900">Estimated Cost</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(estimatedCost)}
                </div>
                <div className="text-sm text-blue-700">
                  Duration: {calculateDuration(
                    `${watchedValues[0]}T${watchedValues[1]}:00`,
                    `${watchedValues[0]}T${watchedValues[2]}:00`
                  ).toFixed(1)} hours
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createBookingMutation.isLoading}
                className="btn btn-primary flex-1"
              >
                {createBookingMutation.isLoading ? (
                  <LoadingSpinner size="sm" text="" />
                ) : (
                  'Create Booking'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
