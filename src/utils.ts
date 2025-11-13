export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  });
};

export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const canCancelBooking = (departureTime: string): boolean => {
  const now = new Date();
  const departure = new Date(departureTime);
  const diffMinutes = (departure.getTime() - now.getTime()) / (1000 * 60);
  return diffMinutes > 15;
};

export const generateBookingRef = (): string => {
  return `ARMS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

export const getFlightDuration = (start: string, end: string): string => {
  const diff = (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60);
  const hours = Math.floor(diff / 60);
  const mins = Math.floor(diff % 60);
  return `${hours}h ${mins}m`;
};
