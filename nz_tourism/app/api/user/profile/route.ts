import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  try {
    // 获取NextAuth会话
    const session = await getServerSession(authOptions);
    
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }
    
    // 从后端API获取详细个人资料
    const backendUrl = process.env.BACKEND_API_URL;
    const response = await fetch(`${backendUrl}/api/user/profile`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      },
    });
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('获取用户资料失败:', error);
    return NextResponse.json(
      { error: '无法获取用户资料' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).accessToken) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }
    
    const body = await req.json();
    
    const backendUrl = process.env.BACKEND_API_URL;
    const response = await fetch(`${backendUrl}/api/user/profile`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${(session as any).accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API请求失败: ${response.status}, ${errorText}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('更新用户资料失败:', error instanceof Error ? error.message : '未知错误');
    
    return NextResponse.json(
      { error: `无法更新用户资料: ${error instanceof Error ? error.message : '未知错误'}` },
      { status: 500 }
    );
  }
}