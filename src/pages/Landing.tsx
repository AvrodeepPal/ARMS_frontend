import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-tertiary mb-6 font-inter">
            Welcome to ARMS
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Airline Reservation Management System - Book your flights with ease
          </p>
          <button
            onClick={() => navigate('/flights')}
            className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-secondary transition"
          >
            Search Flights Now →
          </button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2 font-inter">Easy Search</h3>
            <p className="text-gray-600">Find flights quickly by source, destination, and date</p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-bold mb-2 font-inter">Secure Payment</h3>
            <p className="text-gray-600">Safe and secure payment processing</p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold mb-2 font-inter">Instant Booking</h3>
            <p className="text-gray-600">Get confirmation instantly</p>
          </div>
        </div>
      </div>
    </div>
  );
};
