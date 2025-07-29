export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  affiliateUrl: string;
  category: string;
  isFeatured?: boolean;
  isTimeLimited?: boolean;
  discount?: string;
  clicks?: number;
  createdAt: Date;
}

export interface ProductForm {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  affiliateUrl: string;
  category: string;
  isFeatured: boolean;
  isTimeLimited: boolean;
  discount: string;
}

export const CATEGORIES = [
  'Tech',
  'Fashion', 
  'Gadgets',
  'Deals',
  'Home',
  'Beauty',
  'Sports',
  'Books',
  'Other'
] as const;

export type Category = typeof CATEGORIES[number];