'use client';

import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { BookingFormData } from '../../types/booking';
import { Package } from '../../types/package';

interface PaymentFormProps {
  packageData: Package;
  bookingData: BookingFormData;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

export default function PaymentForm({ 
  packageData, 
  bookingData, 
  onSuccess, 
  onError 
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // 1. 创建支付意图
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: packageData.id,
          amount: packageData.price * bookingData.travelers,
          currency: 'nzd',
          bookingData
        }),
      });

      const { clientSecret, error } = await response.json();

      if (error) {
        onError(error);
        setErrorMessage(error);
        return;
      }

      // 2. 确认支付
      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement!,
            billing_details: {
              name: bookingData.customerName,
              email: bookingData.email,
              phone: bookingData.phone,
            },
          },
        }
      );

      if (stripeError) {
        setErrorMessage(stripeError.message || '支付失败');
        onError(stripeError.message || '支付失败');
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (err: any) {
      const errorMsg = err.message || '支付处理失败';
      setErrorMessage(errorMsg);
      onError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-section">
        <h3>支付信息</h3>
        
        <div className="card-element-container">
          <label htmlFor="card-element">
            信用卡或借记卡
          </label>
          <CardElement
            id="card-element"
            options={CARD_ELEMENT_OPTIONS}
          />
        </div>

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        <div className="payment-summary">
          <div className="summary-row">
            <span>套餐费用</span>
            <span>${packageData.price} NZD</span>
          </div>
          <div className="summary-row">
            <span>人数</span>
            <span>{bookingData.travelers}人</span>
          </div>
          <div className="summary-row total">
            <span>总计</span>
            <span>${packageData.price * bookingData.travelers} NZD</span>
          </div>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="pay-button"
      >
        {isProcessing ? '处理中...' : `支付 $${packageData.price * bookingData.travelers} NZD`}
      </button>

      <style jsx>{`
        .payment-form {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .form-section h3 {
          margin: 0 0 20px 0;
          font-size: 20px;
          font-weight: 600;
          color: #333;
        }
        
        .card-element-container {
          margin-bottom: 20px;
        }
        
        .card-element-container label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }
        
        .error-message {
          background: #fee;
          border: 1px solid #fcc;
          color: #c33;
          padding: 12px;
          border-radius: 6px;
          margin: 16px 0;
          font-size: 14px;
        }
        
        .payment-summary {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 16px;
          margin: 20px 0;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }
        
        .summary-row.total {
          border-top: 1px solid #ddd;
          padding-top: 8px;
          margin-top: 12px;
          font-weight: 600;
          font-size: 16px;
          color: #333;
        }
        
        .pay-button {
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 16px 0;
        }
        
        .pay-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        
        .pay-button:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
      `}</style>
    </form>
  );
}