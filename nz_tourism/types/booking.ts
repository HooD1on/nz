export interface BookingFormData {
  customerName: string;
  email: string;
  phone: string;
  travelers: number;
  travelDate: string; // ISO string format
  specialRequests?: string;
}

export interface CreateBookingRequest {
  paymentIntentId: string;
  packageId: string;
  bookingData: BookingFormData;
  totalAmount: number;
}

export interface Booking {
  id: string;
  bookingReference: string;
  userId: string;
  paymentId: string;
  packageId: string;
  customerName: string;
  email: string;
  phone: string;
  travelers: number;
  travelDate: string;
  totalAmount: number;
  status: BookingStatus;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export enum BookingStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Canceled = 'Canceled',
  Completed = 'Completed',
  Refunded = 'Refunded'
}

export interface CreateBookingResponse {
  success: boolean;
  booking?: Booking;
  error?: string;
}


