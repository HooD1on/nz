import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL?.replace(/\/$/, '') || 'http://localhost:5152';

interface RouteParams {
  params: {
    id: string;
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params; // ✅ 添加 await
    
    const response = await fetch(`${API_BASE_URL}/api/blog/${id}/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return NextResponse.json(
      { success: false, error: '更新浏览量失败' },
      { status: 500 }
    );
  }
}