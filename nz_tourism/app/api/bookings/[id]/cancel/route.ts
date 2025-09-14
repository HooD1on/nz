// nz_tourism/app/api/bookings/[id]/cancel/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

const API_BASE_URL = process.env.BACKEND_API_URL?.replace(/\/$/, '') || 'http://localhost:5152';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).accessToken) {
      return NextResponse.json({ error: '用户未登录' }, { status: 401 });
    }

    const bookingId = params.id;
    
    const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${(session as any).accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reason: '用户主动取消'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ 
        error: errorData.error || '取消预订失败' 
      }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      message: '预订已成功取消',
      data
    });
  } catch (error) {
    console.error('取消预订失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}