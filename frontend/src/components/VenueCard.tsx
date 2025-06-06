import React from 'react';
import { Venue } from '../types';
import { formatCurrency } from '../utils';

interface VenueCardProps {
  venue: Venue;
  onBook?: () => void;
  onEdit?: () => void;
  showActions?: boolean;
}

const VenueCard: React.FC<VenueCardProps> = ({ 
  venue, 
  onBook, 
  onEdit, 
  showActions = true 
}) => {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="card-body">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{venue.name}</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            venue.is_available 
              ? 'bg-success-50 text-success-700' 
              : 'bg-danger-50 text-danger-700'
          }`}>
            {venue.is_available ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {venue.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {venue.city}, {venue.address}
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            Capacity: {venue.capacity} people
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            {formatCurrency(venue.hourly_rate)}/hour
          </div>
        </div>

        {venue.amenities && venue.amenities.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Amenities:</h4>
            <div className="flex flex-wrap gap-1">
              {venue.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                >
                  {amenity}
                </span>
              ))}
              {venue.amenities.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                  +{venue.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {showActions && (
          <div className="flex gap-2">
            {onBook && venue.is_available && (
              <button
                onClick={onBook}
                className="btn btn-primary flex-1"
              >
                Book Now
              </button>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="btn btn-secondary"
              >
                Edit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueCard;
