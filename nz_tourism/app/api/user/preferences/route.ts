import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }
    
    const body = await req.json();
    
    const backendUrl = process.env.BACKEND_API_URL;
    const response = await fetch(`${backendUrl}/api/user/preferences`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error('偏好设置更新失败');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('更新偏好设置失败:', error);
    return NextResponse.json(
      { error: '无法更新偏好设置' },
      { status: 500 }
    );
  }
}