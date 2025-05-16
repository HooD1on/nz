import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const backendUrl = process.env.BACKEND_API_URL;
    const response = await fetch(`${backendUrl}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.error || '登录失败' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Google登录处理失败:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}