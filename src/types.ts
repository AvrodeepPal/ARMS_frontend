export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  dob: string;
  passportId: string;
  role: 'user' | 'admin';
}

export interface Flight {
  id: string;
  flightNumber: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  aircraft: string;
  availableSeats: number;
  totalSeats: number;
  baseFare: number;
}

export interface Booking {
  id: string;
  userId: string;
  flightId: string;
  bookingReference: string;
  passengerName: string;
  passengerPhone: string;
  totalFare: number;
  fees: number;
  finalAmount: number;
  status: 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'completed';
  bookingDate: string;
  departureTime: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

export interface BookingState {
  selectedFlight: Flight | null;
  bookingId: string | null;
}
