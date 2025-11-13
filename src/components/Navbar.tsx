import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold font-inter">
          ✈ ARMS
        </Link>
        <div className="flex gap-6 items-center">
          {auth.token ? (
            <>
              <Link to="/flights" className="hover:text-secondary transition">
                Search Flights
              </Link>
              <Link to="/my-bookings" className="hover:text-secondary transition">
                My Bookings
              </Link>
              <span className="text-sm">Hello, {auth.user?.fullName}</span>
              <button
                onClick={handleLogout}
                className="bg-tertiary px-4 py-2 rounded hover:bg-secondary transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="bg-tertiary px-6 py-2 rounded hover:bg-secondary transition"
            >
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
