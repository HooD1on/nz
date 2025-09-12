export interface Package {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  includes?: string[];
  maxCapacity?: number;
  leadTime?: number;
}