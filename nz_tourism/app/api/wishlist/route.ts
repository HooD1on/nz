import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const API_BASE_URL = process.env.BACKEND_API_URL?.replace(/\/$/, '') || 'http://localhost:5152';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session as any).accessToken) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '20';

    const response = await fetch(
      `${API_BASE_URL}/api/wishlist?page=${page}&pageSize=${pageSize}`,
      {
        headers: {
          'Authorization': `Bearer ${(session as any).accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`后端API返回错误: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('获取收藏列表失败:', error);
    return NextResponse.json({ error: '获取收藏列表失败' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session as any).accessToken) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    const body = await req.json();
    const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${(session as any).accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || '添加收藏失败' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('添加收藏失败:', error);
    return NextResponse.json({ error: '添加收藏失败' }, { status: 500 });
  }
}