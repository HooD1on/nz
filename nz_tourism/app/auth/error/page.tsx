'use client'

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Authentication Error</h2>
        <p>There was an error during authentication: {error}</p>
        <p>Please try again or contact support if the problem persists.</p>
        <Link href="/auth" className="auth-button">
          Back to Login
        </Link>
      </div>
    </div>
  );
}