// nz_tourism/types/booking.ts
export interface BookingFormData {
  customerName: string;
  email: string;
  phone: string;
  travelers: number;
  travelDate: string;
  specialRequests: string;
}

export interface Booking {
  id: string;
  bookingReference: string;
  packageId: string;
  packageTitle?: string;
  packageImage?: string;
  packageDuration?: string;
  customerName: string;
  email: string;
  phone?: string;
  travelers: number;
  travelDate: string;
  totalAmount: number;
  currency: string;
  status: BookingStatus;
  specialRequests?: string;
  createdAt: string;
  updatedAt?: string;
  confirmedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export type BookingStatus = 'Confirmed' | 'Cancelled' | 'Pending' | 'Completed';

export interface CreateBookingRequest {
  paymentIntentId: string;
  packageId: string;
  bookingData: BookingFormData;
  totalAmount: number;
}

export interface BookingResponse {
  success: boolean;
  data?: Booking;
  error?: string;
}

export interface BookingListResponse {
  success: boolean;
  data?: Booking[];
  error?: string;
  total?: number;
  page?: number;
  pageSize?: number;
}

// 预订状态配置
export const BOOKING_STATUS_CONFIG = {
  'Confirmed': {
    label: '已确认',
    color: 'confirmed',
    bgColor: '#d1fae5',
    textColor: '#065f46'
  },
  'Pending': {
    label: '待确认',
    color: 'pending',
    bgColor: '#fef3c7',
    textColor: '#92400e'
  },
  'Cancelled': {
    label: '已取消',
    color: 'cancelled',
    bgColor: '#fee2e2',
    textColor: '#991b1b'
  },
  'Completed': {
    label: '已完成',
    color: 'completed',
    bgColor: '#e0e7ff',
    textColor: '#3730a3'
  }
} as const;