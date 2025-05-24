import { mapToGuid } from '../data/utils/destinationMapping';

interface AddToWishlistData {
  destinationId: string;
  destinationTitle: string;
  destinationImage?: string;
  destinationLocation?: string;
  destinationPrice?: number;
  destinationRating?: number;
  notes?: string;
}

class WishlistService {
  private baseUrl = '/api/wishlist';

  async addToWishlist(data: AddToWishlistData): Promise<{ success: boolean; error?: string }> {
    try {
      // 确保使用GUID格式的ID进行API调用
      const apiData = {
        ...data,
        destinationId: mapToGuid(data.destinationId)
      };

      console.log('添加收藏，映射后的数据:', apiData);

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || '添加收藏失败' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: '网络错误，请稍后重试' };
    }
  }

  async removeFromWishlist(destinationId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // 确保使用GUID格式的ID进行API调用
      const apiId = mapToGuid(destinationId);
      console.log('移除收藏，映射后的ID:', apiId);

      const response = await fetch(`${this.baseUrl}/${apiId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || '移除收藏失败' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: '网络错误，请稍后重试' };
    }
  }

  async checkWishlistStatus(destinationId: string): Promise<{ isInWishlist: boolean }> {
    try {
      // 确保使用GUID格式的ID进行API调用
      const apiId = mapToGuid(destinationId);
      console.log('检查收藏状态，映射后的ID:', apiId);

      const response = await fetch(`${this.baseUrl}/check/${apiId}`);
      
      if (!response.ok) {
        return { isInWishlist: false };
      }

      return await response.json();
    } catch (error) {
      return { isInWishlist: false };
    }
  }

  async getWishlist(page = 1, pageSize = 20) {
    try {
      const response = await fetch(`${this.baseUrl}?page=${page}&pageSize=${pageSize}`);
      
      if (!response.ok) {
        throw new Error('获取收藏列表失败');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

export const wishlistService = new WishlistService();