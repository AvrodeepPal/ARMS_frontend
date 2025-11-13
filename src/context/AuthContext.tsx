import { createContext, useState, useCallback, type ReactNode, useContext } from 'react';
import type { User, Flight, AuthState, BookingState } from '../types';
import api from '../services/api';

interface AuthContextType {
  auth: AuthState;
  booking: BookingState;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: any) => Promise<User>;
  logout: () => void;
  selectFlight: (flight: Flight) => void;
  setBookingId: (id: string) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token'),
  });

  const [booking, setBooking] = useState<BookingState>({
    selectedFlight: null,
    bookingId: null,
  });

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setAuth({ user: data.user, token: data.token });
    return data.user;
  }, []);

  const register = useCallback(async (userData: any) => {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setAuth({ user: data.user, token: data.token });
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ user: null, token: null });
    setBooking({ selectedFlight: null, bookingId: null });
  }, []);

  const selectFlight = useCallback((flight: Flight) => {
    setBooking(prev => ({ ...prev, selectedFlight: flight }));
  }, []);

  const setBookingId = useCallback((id: string) => {
    setBooking(prev => ({ ...prev, bookingId: id }));
  }, []);

  return (
    <AuthContext.Provider value={{ auth, booking, login, register, logout, selectFlight, setBookingId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
