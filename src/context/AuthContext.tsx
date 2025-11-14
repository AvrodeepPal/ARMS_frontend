import { createContext, useState, useCallback, type ReactNode, useContext } from 'react';
import type { User, Flight, AuthState, BookingState } from '../types';
import api from '../services/api';

interface AuthContextType {
  auth: AuthState;
  booking: BookingState;
  login: (username: string, password: string) => Promise<User>;
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

  const login = useCallback(async (username: string, password: string) => {
    try {
      const { data } = await api.post('/auth/login', { 
        username,  // CHANGED from 'email' to 'username'
        password 
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setAuth({ user: data.user, token: data.token });
      return data.user;
    } catch (error: any) {
      console.error('Login error:', error.response?.data);
      throw error;
    }
  }, []);

  const register = useCallback(async (userData: any) => {
    try {
      const payload = {
        username: userData.fullName,  // CHANGED: Use fullName as username if backend doesn't have separate field
        password: userData.password,
        email: userData.email,
        fullName: userData.fullName,
        phone: userData.phone,
        dob: userData.dob,
        passportId: userData.passportId,
      };
      
      const { data } = await api.post('/auth/register', payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setAuth({ user: data.user, token: data.token });
      return data.user;
    } catch (error: any) {
      console.error('Register error:', error.response?.data);
      throw error;
    }
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
