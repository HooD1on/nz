import { BookingFormData } from './booking';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
}

export interface Payment {
  id: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  packageId: string;
  paidAt?: string;
  createdAt: string;
}

export enum PaymentStatus {
  Pending = 'Pending',
  Succeeded = 'Succeeded',
  Failed = 'Failed',
  Canceled = 'Canceled',
  Refunded = 'Refunded'
}

export interface CreatePaymentIntentRequest {
  packageId: string;
  amount: number;
  currency: string;
  bookingData: BookingFormData;
}


export interface UpdatePaymentStatusRequest {
  paymentIntentId: string;
  status: 'succeeded' | 'failed' | 'canceled';
}

export interface PaymentStatusResponse {
  paymentIntentId: string;
  status: string;
  amount: number;
  currency: string;
  paidAt?: string;
  failureReason?: string;
}

export interface StripePaymentIntentResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
  created: number;
}
