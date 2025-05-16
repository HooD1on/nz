'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import '../style/auth.css'
import { signIn } from 'next-auth/react'

interface ForgotPasswordFormProps {
  submitError: string;
  setSubmitError: (error: string) => void;
}

export default function ForgotPasswordForm({ submitError, setSubmitError }: ForgotPasswordFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await fetch('/api/user/request-reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccessMessage('If this email exists in our system, you will receive password reset instructions.');
        
        // In production, we would send a reset link via email
        // But in development, we can directly use the returned token
        if (data.data) {
          // Development mode: Add token to URL
          setTimeout(() => {
            router.push(`/auth?mode=reset&email=${encodeURIComponent(email)}&token=${data.data}`);
          }, 2000);
        }
      } else {
        setSubmitError(data.error || 'Error sending reset request. Please try again later.');
      }
    } catch (error) {
      setSubmitError('Error sending reset request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="auth-form-container active">
      <h2>Forgot Password</h2>
      <p className="auth-subtitle">Enter your email address and we'll send you a link to reset your password</p>
      
      {submitError && (
        <div className="status-message error">{submitError}</div>
      )}
      
      {successMessage && (
        <div className="status-message success">{successMessage}</div>
      )}
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>
        
        <button
          type="submit"
          className="auth-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Send Reset Link'}
        </button>
      </form>
      
      <div className="auth-footer-link">
        <Link href="/auth">Back to Login</Link>
      </div>
    </div>
  );
}