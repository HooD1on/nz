'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 处理支付成功后的状态更新和订单创建
  const handlePaymentSuccess = async (paymentIntent: any): Promise<void> => {
    try {
      console.log('🎉 支付成功，开始更新状态和创建订单:', paymentIntent.id);

      // 1. 更新支付状态
      const updateStatusResponse = await fetch('/api/payments/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          status: 'succeeded',
        }),
      });

      if (!updateStatusResponse.ok) {
        const errorData = await updateStatusResponse.json();
        throw new Error(errorData.error || '更新支付状态失败');
      }

      console.log('✅ 支付状态更新成功');

      // 2. 创建订单
      const bookingRequestData = {
        paymentIntentId: paymentIntent.id,
        packageId: packageData.id,
        bookingData: {
          customerName: bookingData.customerName,
          email: bookingData.email,
          phone: bookingData.phone,
          travelers: bookingData.travelers,
          travelDate: typeof bookingData.travelDate === 'string'
            ? bookingData.travelDate.includes('T')
              ? bookingData.travelDate
              : new Date(bookingData.travelDate).toISOString()
            : new Date(bookingData.travelDate).toISOString(),
          specialRequests: bookingData.specialRequests || '',
        }
      };

      const bookingResponse = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingRequestData),
      });

      let createdBooking = null;
      if (bookingResponse.ok) {
        createdBooking = await bookingResponse.json();
        console.log('✅ 订单创建成功:', createdBooking.id);
      } else {
        console.warn('⚠️ 订单创建失败，但支付已成功');
      }

      // 3. 调用成功回调
      onSuccess(paymentIntent);

      // 4. 跳转到成功页面
      const successUrl = `/bookings/success?payment_intent=${paymentIntent.id}`;
      if (createdBooking?.id) {
        router.push(`${successUrl}&booking_id=${createdBooking.id}`);
      } else {
        router.push(successUrl);
      }

    } catch (error: any) {
      console.error('❌ 处理支付成功事件失败:', error);
      
      // 即使后续处理失败，支付已成功，应该告知用户
      alert(`支付已成功完成！\n支付ID: ${paymentIntent.id}\n\n如有问题请联系客服。`);
      
      // 仍然调用成功回调和跳转
      onSuccess(paymentIntent);
      router.push(`/bookings/success?payment_intent=${paymentIntent.id}`);
    }
  };

  // 处理支付失败
  const handlePaymentFailure = async (paymentIntent: any, error: any): Promise<void> => {
    try {
      console.log('❌ 支付失败，更新状态:', paymentIntent?.id);

      if (paymentIntent?.id) {
        await fetch('/api/payments/update-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            status: 'failed',
          }),
        });
      }

      const errorMsg = error?.message || '支付失败';
      setErrorMessage(errorMsg);
      onError(errorMsg);
    } catch (updateError) {
      console.error('更新失败状态时出错:', updateError);
      const errorMsg = error?.message || '支付失败';
      setErrorMessage(errorMsg);
      onError(errorMsg);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      console.log('🚀 开始创建支付意图');

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
          bookingData: {
            customerName: bookingData.customerName,
            email: bookingData.email,
            phone: bookingData.phone,
            travelers: bookingData.travelers,
            travelDate: typeof bookingData.travelDate === 'string'
              ? bookingData.travelDate.includes('T')
                ? bookingData.travelDate
                : new Date(bookingData.travelDate).toISOString()
              : new Date(bookingData.travelDate).toISOString(),
            specialRequests: bookingData.specialRequests || '',
          }
        }),
      });

      const responseData = await response.json();

      if (!response.ok || responseData.error) {
        throw new Error(responseData.error || '创建支付意图失败');
      }

      const { clientSecret } = responseData;
      console.log('✅ 支付意图创建成功');

      // 2. 确认支付
      console.log('🔄 开始确认支付');
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
        console.error('❌ Stripe 支付错误:', stripeError);
        await handlePaymentFailure(paymentIntent, stripeError);
      } else if (paymentIntent.status === 'succeeded') {
        console.log('🎉 支付确认成功，开始后续处理');
        await handlePaymentSuccess(paymentIntent);
      } else if (paymentIntent.status === 'requires_action') {
        console.log('🔐 需要额外验证 (如3D Secure)');
        setErrorMessage('支付需要额外验证，请按照提示完成');
      } else {
        console.log('⏳ 支付状态:', paymentIntent.status);
        setErrorMessage(`支付状态异常: ${paymentIntent.status}，请重试或联系客服`);
      }

    } catch (err: any) {
      console.error('💥 支付处理失败:', err);
      const errorMsg = err.message || '支付处理失败';
      setErrorMessage(errorMsg);
      onError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-form-container">
      <h3>支付信息</h3>
      
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="card-element-container">
          <label htmlFor="card-element">
            信用卡或借记卡 *
          </label>
          <div className="card-element-wrapper">
            <CardElement
              id="card-element"
              options={CARD_ELEMENT_OPTIONS}
            />
          </div>
        </div>

        {errorMessage && (
          <div className="error-message">
            ❌ {errorMessage}
          </div>
        )}

        <div className="payment-summary">
          <h4>费用明细</h4>
          <div className="summary-row">
            <span>套餐费用</span>
            <span>${packageData.price} NZD</span>
          </div>
          <div className="summary-row">
            <span>出行人数</span>
            <span>{bookingData.travelers}人</span>
          </div>
          <div className="summary-row total">
            <span>应付总额</span>
            <span>${packageData.price * bookingData.travelers} NZD</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="pay-button"
        >
          {isProcessing ? '处理中...' : `支付 $${packageData.price * bookingData.travelers} NZD`}
        </button>

        <div className="test-info">
          <h5>测试卡号信息：</h5>
          <p>卡号: <code>4242 4242 4242 4242</code></p>
          <p>到期日期: 任意未来日期 | CVC: 任意3位数字</p>
          <p>邮编: 任意5位数字</p>
        </div>
      </form>

      <style jsx>{`
        .payment-form-container {
          max-width: 100%;
        }
        
        .payment-form-container h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 20px;
        }
        
        .payment-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .card-element-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .card-element-container label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }
        
        .card-element-wrapper {
          padding: 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          transition: all 0.2s;
        }
        
        .card-element-wrapper:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .error-message {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 0.875rem;
        }
        
        .payment-summary {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
        }
        
        .payment-summary h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 16px;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .summary-row.total {
          border-top: 1px solid #e5e7eb;
          padding-top: 12px;
          margin-top: 12px;
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
        }
        
        .pay-button {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 16px 24px;
          border-radius: 8px;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        
        .pay-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }
        
        .pay-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        .test-info {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          padding: 16px;
          font-size: 0.875rem;
        }
        
        .test-info h5 {
          color: #1e40af;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .test-info p {
          color: #1d4ed8;
          margin: 4px 0;
        }
        
        .test-info code {
          background: #dbeafe;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Monaco', 'Consolas', monospace;
          font-weight: 600;
        }
        
        @media (max-width: 768px) {
          .payment-summary {
            padding: 16px;
          }
          
          .pay-button {
            padding: 14px 20px;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}