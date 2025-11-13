import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import api from '../services/api';
import { type Booking } from '../types';
import { formatCurrency, formatTime, formatDate, canCancelBooking } from '../utils';

export const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings');
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: string, departureTime: string) => {
    if (!canCancelBooking(departureTime)) {
      alert('Cannot cancel booking less than 15 minutes before departure');
      return;
    }

    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      fetchBookings();
      alert('Booking cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel booking', error);
      alert('Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-tertiary font-inter">My Bookings</h1>

        <div className="flex gap-4 mb-6">
          {(['all', 'confirmed', 'cancelled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded font-semibold transition ${
                filter === f
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading && <div className="text-center py-8">Loading bookings...</div>}

        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <Card key={booking.id}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Booking Reference</p>
                    <p className="text-xl font-bold text-tertiary">{booking.bookingReference}</p>
                    <div className="mt-3 space-y-1 text-sm">
                      <p><strong>Passenger:</strong> {booking.passengerName}</p>
                      <p><strong>Phone:</strong> {booking.passengerPhone}</p>
                      <p><strong>Booked on:</strong> {formatDate(booking.bookingDate)}</p>
                      <p><strong>Amount Paid:</strong> {formatCurrency(booking.finalAmount)}</p>
                    </div>
                    <div className="mt-3">
                      <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    {booking.status === 'confirmed' && canCancelBooking(booking.departureTime) && (
                      <button
                        onClick={() => handleCancel(booking.id, booking.departureTime)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm font-semibold"
                      >
                        Cancel Booking
                      </button>
                    )}
                    {booking.status === 'confirmed' && !canCancelBooking(booking.departureTime) && (
                      <p className="text-xs text-gray-500">Cannot cancel<br/>within 15 min</p>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            !loading && <div className="text-center py-8 text-gray-500">No bookings found</div>
          )}
        </div>
      </div>
    </div>
  );
};
