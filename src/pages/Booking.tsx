import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatCurrency, formatTime, formatDate, generateBookingRef } from '../utils';
import { STATIC_FEE } from '../constants';

export const Booking = () => {
  const { auth, booking, setBookingId } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const [passengerDetails, setPassengerDetails] = useState({
    fullName: auth.user?.fullName || '',
    email: auth.user?.email || '',
    phone: auth.user?.phone || '',
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const flight = booking.selectedFlight;
  if (!flight) {
    navigate('/flights');
    return null;
  }

  const totalAmount = flight.baseFare + STATIC_FEE;

  const handleProceedToPayment = () => {
    if (!passengerDetails.fullName || !passengerDetails.email || !passengerDetails.phone) {
      alert('Please fill all passenger details');
      return;
    }
    setStep('payment');
  };

  const handlePayment = async () => {
    if (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv) {
      alert('Please fill all payment details');
      return;
    }

    setLoading(true);
    try {
      // Simulate payment delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create booking
      const bookingData = {
        flightId: flight.id,
        passengerName: passengerDetails.fullName,
        passengerPhone: passengerDetails.phone,
        totalFare: flight.baseFare,
        fees: STATIC_FEE,
        finalAmount: totalAmount,
      };

      const { data } = await api.post('/bookings', bookingData);
      const ref = data.bookingReference || generateBookingRef();
      setBookingRef(ref);
      setBookingId(data.id);
      setStep('success');
    } catch (error) {
      console.error('Payment failed', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {step === 'form' && (
          <>
            <Card className="mb-6">
              <h2 className="text-2xl font-bold mb-4 text-tertiary font-inter">Booking Summary</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Flight:</strong> {flight.flightNumber}</p>
                <p><strong>Route:</strong> {flight.source} → {flight.destination}</p>
                <p><strong>Date:</strong> {formatDate(flight.departureTime)}</p>
                <p><strong>Time:</strong> {formatTime(flight.departureTime)}</p>
                <p><strong>Aircraft:</strong> {flight.aircraft}</p>
                <hr className="my-3" />
                <p><strong>Fare:</strong> {formatCurrency(flight.baseFare)}</p>
                <p><strong>Fees (Static):</strong> {formatCurrency(STATIC_FEE)}</p>
                <p className="text-lg font-bold text-primary"><strong>Total:</strong> {formatCurrency(totalAmount)}</p>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold mb-4 text-tertiary font-inter">Passenger Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={passengerDetails.fullName}
                    onChange={(e) => setPassengerDetails({ ...passengerDetails, fullName: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={passengerDetails.email}
                    onChange={(e) => setPassengerDetails({ ...passengerDetails, email: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={passengerDetails.phone}
                    onChange={(e) => setPassengerDetails({ ...passengerDetails, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <button
                  onClick={handleProceedToPayment}
                  className="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-secondary transition"
                >
                  Proceed to Payment →
                </button>
              </div>
            </Card>
          </>
        )}

        {step === 'payment' && (
          <Card>
            <h2 className="text-2xl font-bold mb-4 text-tertiary font-inter">Payment (Mock)</h2>
            <div className="mb-6 p-4 bg-gray-100 rounded">
              <p className="font-semibold">Order Summary</p>
              <p>Flight: {flight.flightNumber}</p>
              <p>Route: {flight.source} → {flight.destination}</p>
              <p>Passenger: {passengerDetails.fullName}</p>
              <p className="text-lg font-bold mt-2">Total: {formatCurrency(totalAmount)}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="4111 1111 1111 1111"
                  value={paymentDetails.cardNumber}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">Use: 4111 1111 1111 1111</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={paymentDetails.expiry}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={paymentDetails.cvv}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('form')}
                  className="flex-1 border border-gray-300 text-gray-600 py-3 rounded font-semibold hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1 bg-primary text-white py-3 rounded font-semibold hover:bg-secondary transition disabled:opacity-50"
                >
                  {loading ? 'Processing...' : `Pay ${formatCurrency(totalAmount)}`}
                </button>
              </div>
            </div>
          </Card>
        )}

        {step === 'success' && (
          <Card className="text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-3xl font-bold mb-4 text-green-600 font-inter">Booking Confirmed!</h2>
            <p className="text-xl mb-6 text-tertiary">Booking Reference: <strong>{bookingRef}</strong></p>
            <div className="text-left max-w-md mx-auto mb-8 p-6 bg-gray-50 rounded">
              <h3 className="font-bold mb-3 text-tertiary">Booking Details</h3>
              <p className="text-sm mb-2"><strong>Flight:</strong> {flight.flightNumber}</p>
              <p className="text-sm mb-2"><strong>Route:</strong> {flight.source} → {flight.destination}</p>
              <p className="text-sm mb-2"><strong>Date:</strong> {formatDate(flight.departureTime)}</p>
              <p className="text-sm mb-2"><strong>Time:</strong> {formatTime(flight.departureTime)}</p>
              <p className="text-sm mb-2"><strong>Passenger:</strong> {passengerDetails.fullName}</p>
              <p className="text-sm mb-2"><strong>Email:</strong> {passengerDetails.email}</p>
              <p className="text-sm mb-2"><strong>Phone:</strong> {passengerDetails.phone}</p>
              <hr className="my-3" />
              <p className="text-sm font-bold"><strong>Total Paid:</strong> {formatCurrency(totalAmount)}</p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate('/my-bookings')}
                className="bg-primary text-white px-8 py-3 rounded font-semibold hover:bg-secondary transition"
              >
                View My Bookings →
              </button>
              <button
                onClick={() => navigate('/flights')}
                className="border border-primary text-primary px-8 py-3 rounded font-semibold hover:bg-gray-50 transition"
              >
                Search More Flights
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
