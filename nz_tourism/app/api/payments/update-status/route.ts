import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const API_BASE_URL = process.env.BACKEND_API_URL?.replace(/\/$/, '') || 'http://localhost:5152';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).accessToken) {
      return NextResponse.json({ error: '用户未登录' }, { status: 401 });
    }

    const body = await req.json();
    
    // 验证请求参数
    if (!body.paymentIntentId || !body.status) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    const response = await fetch(`${API_BASE_URL}/api/payments/update-status`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${(session as any).accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        paymentIntentId: body.paymentIntentId,
        status: body.status
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ 
        error: errorData.error || '更新支付状态失败' 
      }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('更新支付状态失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}