export const COLORS = {
  primary: '#8B6F47',
  secondary: '#D4A574',
  tertiary: '#5D4E37',
  white: '#FFFFFF',
  textPrimary: '#1F1F1F',
  textSecondary: '#666666',
  border: '#E5E5E5',
  error: '#DC2626',
  success: '#16A34A',
};

export const STATIC_FEE = 200;

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/auth/me',
  LOGOUT: '/auth/logout',
  FLIGHTS_SEARCH: '/flights',
  FLIGHT_DETAIL: (id: string) => `/flights/${id}`,
  CREATE_BOOKING: '/bookings',
  GET_BOOKING: (id: string) => `/bookings/${id}`,
  MY_BOOKINGS: '/bookings',
  CANCEL_BOOKING: (id: string) => `/bookings/${id}/cancel`,
  PROCESS_PAYMENT: '/payments/process',
};
