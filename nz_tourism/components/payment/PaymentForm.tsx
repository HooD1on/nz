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

  // 🎯 新增：处理支付成功后的状态更新和订单创建
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

      // 2. 创建订单 - 修复类型问题
      const bookingRequestData = {
        paymentIntentId: paymentIntent.id,
        packageId: packageData.id,
        bookingData: {
          customerName: bookingData.customerName,
          email: bookingData.email,
          phone: bookingData.phone,
          travelers: bookingData.travelers,
          // 修复 travelDate 类型转换问题
          travelDate: (() => {
            if (typeof bookingData.travelDate === 'string') {
              return bookingData.travelDate.includes('T') 
                ? bookingData.travelDate 
                : new Date(bookingData.travelDate).toISOString();
            }
            return new Date(bookingData.travelDate as any).toISOString();
          })(),
          specialRequests: bookingData.specialRequests || '',
        },
        totalAmount: packageData.price * bookingData.travelers,
      };

      const createBookingResponse = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingRequestData),
      });

      let createdBooking = null;
      if (createBookingResponse.ok) {
        createdBooking = await createBookingResponse.json();
        console.log('✅ 订单创建成功:', createdBooking);
      } else {
        const errorData = await createBookingResponse.json();
        console.warn('⚠️ 创建订单失败，但支付已成功:', errorData.error);
        // 即使订单创建失败，支付已成功，用户应该知道
        alert(`支付成功！\n支付ID: ${paymentIntent.id}\n\n订单创建时出现问题，请联系客服处理。`);
      }

      // 3. 调用成功回调
      onSuccess(paymentIntent);

      // 4. 跳转到成功页面
      const successUrl = `/booking/success?payment_intent=${paymentIntent.id}`;
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
      router.push(`/booking/success?payment_intent=${paymentIntent.id}`);
    }
  };

  // 🎯 新增：处理支付失败
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
            // 确保发送正确格式的日期
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
            ❌ {errorMessage}
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
        {isProcessing ? (
          <span>🔄 处理中...</span>
        ) : (
          <span>💳 立即支付 ${packageData.price * bookingData.travelers} NZD</span>
        )}
      </button>
      
      {/* 开发环境测试提示 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="test-info">
          <strong>🧪 测试环境</strong><br/>
          测试卡号: <code>4242 4242 4242 4242</code><br/>
          CVV: 任意3位数字 | 过期日期: 任意未来日期
        </div>
      )}

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
          background: #ffeaa7;
          border: 1px solid #d63031;
          color: #d63031;
          padding: 12px;
          border-radius: 6px;
          margin: 16px 0;
          font-size: 14px;
          font-weight: 500;
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
          background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
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
          box-shadow: 0 6px 20px rgba(0, 184, 148, 0.4);
        }
        
        .pay-button:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        .test-info {
          margin-top: 15px;
          padding: 12px;
          background: #e3f2fd;
          border: 1px solid #1976d2;
          border-radius: 6px;
          font-size: 14px;
          color: #1976d2;
        }
        
        .test-info code {
          background: #bbdefb;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'Monaco', 'Consolas', monospace;
        }
      `}</style>
    </form>
  );
}