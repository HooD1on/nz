import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const backendUrl = process.env.BACKEND_API_URL;
    const response = await fetch(`${backendUrl}/api/user/request-reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    
    // 暂时在开发模式下返回令牌，生产环境不应该这样做
    if (process.env.NODE_ENV === 'development' && data.token) {
      return NextResponse.json({ success: true, data: data.token });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('请求密码重置失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}