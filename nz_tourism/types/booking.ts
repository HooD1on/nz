export interface BookingFormData {
  customerName: string;
  email: string;
  phone: string;
  travelDate: string;
  travelers: number;
  specialRequests?: string;
}

export interface Booking {
  id: string;
  packageId: string;
  packageTitle: string;
  status: BookingStatus;
  totalAmount: number;
  currency: string;
  customerName: string;
  email: string;
  phone: string;
  travelDate: string;
  travelers: number;
  specialRequests?: string;
  bookingReference: string;
  createdAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  payment: {
    id: string;
    status: string;
    paidAt?: string;
  };
}

export enum BookingStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded'
}

export interface BookingListResponse {
  items: Booking[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateBookingRequest {
  packageId: string;
  bookingData: BookingFormData;
  paymentIntentId: string;
  status: string;
}