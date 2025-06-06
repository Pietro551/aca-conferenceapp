import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { venuesAPI } from '../services/api';
import { Venue, VenueFilters } from '../types';
import VenueCard from '../components/VenueCard';
import LoadingSpinner from '../components/LoadingSpinner';
import BookingModal from '../components/BookingModal';

const VenuesPage: React.FC = () => {
  const [filters, setFilters] = useState<VenueFilters>({});
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const { data: venues, isLoading, error, refetch } = useQuery(
    ['venues', filters],
    () => venuesAPI.getVenues(filters),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const handleFilterChange = (newFilters: Partial<VenueFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleBookVenue = (venue: Venue) => {
    setSelectedVenue(venue);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    setSelectedVenue(null);
    refetch();
  };

  const cities = ['Brno', 'Olomouc', 'Zlín', 'Jihlava', 'Břeclav'];

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-danger-600">
          Error loading venues. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Conference Venues in South Moravia
        </h1>
        <p className="text-lg text-gray-600">
          Discover and book premium conference rooms and venues across South Moravian cities.
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="card-body">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="form-label">City</label>
              <select
                value={filters.city || ''}
                onChange={(e) => handleFilterChange({ city: e.target.value || undefined })}
                className="form-input"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Min Capacity</label>
              <input
                type="number"
                value={filters.min_capacity || ''}
                onChange={(e) => handleFilterChange({ 
                  min_capacity: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                className="form-input"
                placeholder="e.g. 10"
              />
            </div>

            <div>
              <label className="form-label">Max Capacity</label>
              <input
                type="number"
                value={filters.max_capacity || ''}
                onChange={(e) => handleFilterChange({ 
                  max_capacity: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                className="form-input"
                placeholder="e.g. 100"
              />
            </div>

            <div>
              <label className="form-label">Max Price/Hour</label>
              <input
                type="number"
                value={filters.max_price || ''}
                onChange={(e) => handleFilterChange({ 
                  max_price: e.target.value ? parseFloat(e.target.value) : undefined 
                })}
                className="form-input"
                placeholder="e.g. 100"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setFilters({})}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading venues..." />
        </div>
      ) : venues && venues.length > 0 ? (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Found {venues.length} venue{venues.length !== 1 ? 's' : ''}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                onBook={() => handleBookVenue(venue)}
                showActions={true}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No venues found matching your criteria.</div>
          <button
            onClick={() => setFilters({})}
            className="btn btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedVenue && (
        <BookingModal
          venue={selectedVenue}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default VenuesPage;
