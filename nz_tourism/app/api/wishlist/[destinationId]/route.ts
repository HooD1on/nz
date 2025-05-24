import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const API_BASE_URL = process.env.BACKEND_API_URL?.replace(/\/$/, '') || 'http://localhost:5152';

// 目的地ID映射
const destinationGuidMap: {[key: string]: string} = {
  'queenstown': 'f8a7b3c1-d2e4-4f5a-9b8c-7d6e5f4a3b2c',
  'auckland': 'a1b2c3d4-e5f6-4a5b-8c9d-7e6f5a4b3c2',
  'rotorua': 'b2c3d4e5-f6a7-5b8c-9d0e-1f2a3b4c5d6',
  'milford-sound': 'c3d4e5f6-a7b8-6c9d-0e1f-2a3b4c5d6e7',
  'hobbiton': 'd4e5f6a7-b8c9-7d0e-1f2a-3b4c5d6e7f8'
};

function mapToGuid(destinationId: string): string {
  const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (guidRegex.test(destinationId)) {
    return destinationId;
  }
  
  const guid = destinationGuidMap[destinationId];
  if (guid) {
    console.log(`目的地ID映射: "${destinationId}" -> "${guid}"`);
    return guid;
  }
  
  console.warn(`未找到目的地ID映射: ${destinationId}`);
  return destinationId;
}

interface RouteParams {
  params: {
    destinationId: string;
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    console.log('删除收藏请求 - 原始参数:', params);
    
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).accessToken) {
      console.log('未授权访问 - 用户未登录');
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    const originalDestinationId = params.destinationId;
    const mappedDestinationId = mapToGuid(originalDestinationId);
    
    console.log('删除收藏请求详情:', {
      原始ID: originalDestinationId,
      映射后ID: mappedDestinationId,
      用户: (session as any).user?.email
    });

    const deleteUrl = `${API_BASE_URL}/api/wishlist/${mappedDestinationId}`;
    console.log('发送删除请求到:', deleteUrl);

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${(session as any).accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('后端API响应状态:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('删除收藏失败 - 后端响应:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: `删除失败: ${response.status} ${response.statusText}` };
      }
      
      return NextResponse.json(
        { error: errorData.error || '移除收藏失败' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('删除收藏成功:', data);
    
    return NextResponse.json({ 
      success: true,
      message: '成功移除收藏',
      data 
    });
  } catch (error) {
    console.error('删除收藏过程中出错:', error);
    return NextResponse.json(
      { 
        error: '移除收藏失败', 
        details: error instanceof Error ? error.message : '未知错误' 
      }, 
      { status: 500 }
    );
  }
}