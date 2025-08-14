import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL?.replace(/\/$/, '') || 'http://localhost:5152';

interface RouteParams {
  params: {
    id: string;
  }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit') || '3';
    
    const response = await fetch(`${API_BASE_URL}/api/blog/${id}/related?limit=${limit}`, {
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
    console.error('Error fetching related posts:', error);
    return NextResponse.json(
      { success: false, error: '获取相关文章失败' },
      { status: 500 }
    );
  }
}