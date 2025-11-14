import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { type Flight } from '../types';
import { formatCurrency, formatTime, getFlightDuration } from '../utils';

export const Flights = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    source: '',
    destination: '',
    date: '',
  });
  const { selectFlight } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchParams.source || !searchParams.destination || !searchParams.date) {
      alert('Please fill all search fields');
      return;
    }
    setLoading(true);
    try {
      // Use the correct endpoint route for inconsistent API
      const { data } = await api.get('/flights', { params: searchParams });
      setFlights(data);
    } catch (error) {
      console.error('Failed to fetch flights', error);
      alert('Failed to fetch flights');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFlight = (flight: Flight) => {
    selectFlight(flight);
    navigate('/booking');
  };

  // Helper functions to avoid NaN and invalid dates
  const safeFormatDate = (dateStr?: string) => {
    if (!dateStr) return 'Date N/A';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'Date N/A' : d.toLocaleDateString();
  };

  const safeFormatTime = (timeStr?: string) => {
    // Some APIs may provide time as "09:30" or as "2025-11-15T09:30:00"
    if (!timeStr) return 'Time N/A';
    if (timeStr.includes('T')) return timeStr.split('T')[1]?.slice(0, 5) || timeStr;
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeStr)) return timeStr.slice(0, 5);
    return timeStr;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-tertiary font-inter">Search Flights</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">From</label>
              <input
                type="text"
                value={searchParams.source}
                onChange={(e) => setSearchParams({ ...searchParams, source: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="e.g. Delhi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">To</label>
              <input
                type="text"
                value={searchParams.destination}
                onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="e.g. Mumbai"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={searchParams.date}
                onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-primary text-white px-6 py-2 rounded hover:bg-secondary transition disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </Card>

        {loading && <div className="text-center py-8">Loading flights...</div>}

        <div className="space-y-4">
          {flights.length > 0 ? (
            flights.map((flight) => (
              <Card key={flight.flightId || flight.id} className="hover:shadow-md transition">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-tertiary font-inter">
                      {flight.flightNumber || 'Flight'}
                    </h3>
                    <p className="text-gray-600">
                      {flight.source} → {flight.destination}
                    </p>
                    <p className="text-sm text-gray-500">
                      {safeFormatTime(flight.departureTime || flight.time)} - {safeFormatTime(flight.arrivalTime)}
                      {' '}
                      ({getFlightDuration(flight.departureTime, flight.arrivalTime)})
                    </p>
                    <p className="text-sm text-gray-500">
                      {flight.aircraft || 'Aircraft'} | {flight.availableSeats || 'N/A'} seats available
                    </p>
                    <p className="text-sm text-gray-500">
                      {safeFormatDate(flight.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(flight.baseFare) || '₹N/A'}
                    </p>
                    <button
                      onClick={() => handleSelectFlight(flight)}
                      className="mt-2 bg-primary text-white px-6 py-2 rounded hover:bg-secondary transition"
                    >
                      Select →
                    </button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            !loading && <div className="text-center py-8 text-gray-500">No flights found. Try searching!</div>
          )}
        </div>
      </div>
    </div>
  );
};
