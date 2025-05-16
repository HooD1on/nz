// app/login-test/page.tsx
'use client'

import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect } from "react"

export default function LoginTest() {
  const { data: session, status } = useSession()
  
  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);
  }, [session, status]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Login Test Page</h1>
      
      <div style={{ margin: '1rem 0' }}>
        <h2>Session Status: {status}</h2>
        {session && (
          <div>
            <h3>Logged in as: {session?.user?.email}</h3>
            <pre>{JSON.stringify(session, null, 2)}</pre>
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          onClick={() => signIn('google')} 
          style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
        >
          Sign in with Google
        </button>
        
        {session && (
          <button 
            onClick={() => signOut()} 
            style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  )
}