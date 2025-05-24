import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

const API_BASE_URL = process.env.BACKEND_API_URL?.replace(/\/$/, '') || 'http://localhost:5152';

interface RouteParams {
  params: {
    destinationId: string;
  }
}

export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).accessToken) {
      return NextResponse.json({ isInWishlist: false });
    }

    const destinationId = params.destinationId;

    const response = await fetch(`${API_BASE_URL}/api/wishlist/check/${destinationId}`, {
      headers: {
        'Authorization': `Bearer ${(session as any).accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return NextResponse.json({ isInWishlist: false });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('检查收藏状态失败:', error);
    return NextResponse.json({ isInWishlist: false });
  }
}