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
  const [auth, setAuth] = useState<AuthState>(() => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
      const token = localStorage.getItem('token');
      return { user, token };
    } catch (error) {
      console.error('Error parsing stored auth:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return { user: null, token: null };
    }
  });

  const [booking, setBooking] = useState<BookingState>({
    selectedFlight: null,
    bookingId: null,
  });

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { 
        username,
        password 
      });
      
      console.log('Raw response:', response);
      console.log('Response data:', response.data);
      console.log('Data type:', typeof response.data);
      
      let data = response.data;
      
      // If response is a string, try to parse it
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          console.error('Could not parse response as JSON:', data);
          throw new Error('Invalid server response');
        }
      }
      
      let userData;
      let token;
      
      // Handle array response [{user}]
      if (Array.isArray(data)) {
        if (data.length === 0) {
          throw new Error('Login failed: Invalid credentials');
        }
        userData = data[0];
        // Generate temp token since backend doesn't return JWT
        token = 'Bearer ' + btoa(username + ':' + Date.now());
        console.warn('⚠️ Backend not returning JWT token! Using temporary token.');
      } 
      // Handle object response {token, user}
      else if (data && typeof data === 'object') {
        if (data.token && data.user) {
          userData = data.user;
          token = data.token;
        } else {
          // Single user object returned
          userData = data;
          token = 'Bearer ' + btoa(username + ':' + Date.now());
          console.warn('⚠️ Backend not returning JWT token! Using temporary token.');
        }
      } else {
        throw new Error('Invalid login response format');
      }
      
      // Remove password from stored data
      const { password: _, ...userWithoutPassword } = userData;
      
      console.log('Storing user:', userWithoutPassword);
      console.log('Storing token:', token);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setAuth({ user: userWithoutPassword, token });
      
      return userWithoutPassword;
    } catch (error: any) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }, []);

  const register = useCallback(async (userData: any) => {
    try {
      const payload = {
        username: userData.username || userData.fullName,
        password: userData.password,
        name: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        dob: userData.dob,
        address: userData.address || '',
        role: 'ROLE_USER'
      };
      
      const { data } = await api.post('/auth/register', payload);
      
      // Handle same response format as login
      let token;
      let user;
      
      if (Array.isArray(data)) {
        if (data.length === 0) {
          throw new Error('Registration failed');
        }
        user = data[0];
        token = 'Bearer ' + btoa(payload.username + ':' + Date.now());
      } else if (data.token && data.user) {
        token = data.token;
        user = data.user;
      } else {
        user = data;
        token = 'Bearer ' + btoa(payload.username + ':' + Date.now());
      }
      
      const { password: _, ...userWithoutPassword } = user;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setAuth({ user: userWithoutPassword, token });
      
      return userWithoutPassword;
    } catch (error: any) {
      console.error('Register error:', error.response?.data || error.message);
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
