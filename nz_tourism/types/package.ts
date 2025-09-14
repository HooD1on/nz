// nz_tourism/types/package.ts
export interface Package {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  duration: string;
  rating: number;
  reviewCount: number;
  includes: string[];
  highlights?: string[];
  itinerary?: ItineraryDay[];
  category?: string;
  location?: string;
  difficulty?: 'Easy' | 'Moderate' | 'Challenging';
  minAge?: number;
  maxGroupSize?: number;
  cancellationPolicy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
  meals?: string[];
  accommodation?: string;
  transportation?: string;
}

export interface PackageSearchParams {
  keyword?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  duration?: string;
  difficulty?: string;
  minRating?: number;
  location?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'price' | 'rating' | 'popularity' | 'duration';
  sortOrder?: 'asc' | 'desc';
}

export interface PackageListResponse {
  success: boolean;
  data?: Package[];
  error?: string;
  total?: number;
  page?: number;
  pageSize?: number;
}

export interface PackageDetailResponse {
  success: boolean;
  data?: Package;
  error?: string;
}

// 套餐难度配置
export const PACKAGE_DIFFICULTY_CONFIG = {
  'Easy': {
    label: '轻松',
    color: '#10b981',
    description: '适合所有年龄段，体力要求低'
  },
  'Moderate': {
    label: '中等',
    color: '#f59e0b',
    description: '需要一定体力，适合大部分游客'
  },
  'Challenging': {
    label: '挑战',
    color: '#ef4444',
    description: '需要良好体力，适合经验丰富的旅行者'
  }
} as const;

// 套餐类别配置
export const PACKAGE_CATEGORIES = [
  { id: 'nature', name: '自然风光', icon: '🏔️' },
  { id: 'culture', name: '文化体验', icon: '🏛️' },
  { id: 'adventure', name: '探险活动', icon: '🧗‍♂️' },
  { id: 'city', name: '城市观光', icon: '🏙️' },
  { id: 'food', name: '美食之旅', icon: '🍽️' },
  { id: 'wildlife', name: '野生动物', icon: '🦌' },
  { id: 'photography', name: '摄影之旅', icon: '📸' },
  { id: 'family', name: '亲子游', icon: '👨‍👩‍👧‍👦' }
] as const;