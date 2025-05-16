import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get('email');
    const token = searchParams.get('token');
    
    if (!email || !token) {
      return NextResponse.json(false);
    }
    
    const backendUrl = process.env.BACKEND_API_URL;
    const response = await fetch(
      `${backendUrl}/api/user/validate-reset-token?email=${encodeURIComponent(email)}&token=${token}`
    );
    
    if (!response.ok) {
      return NextResponse.json(false);
    }
    
    const data = await response.json();
    return NextResponse.json(data.valid || false);
  } catch (error) {
    console.error('验证令牌失败:', error);
    return NextResponse.json(false);
  }
}