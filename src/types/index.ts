export type Platform = 'Amazon' | 'Flipkart' | 'Meesho';

export interface PlatformCommission {
  platform: Platform;
  commission: number; // platform commission percentage
  extraCommission: number; // extra commission percentage
  price: number; // platform-specific price
  link: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  imageUrl: string;
  platforms: PlatformCommission[];
}

export type QuickFilter = 'highest' | 'above10';

export type ViewMode = 'all' | Platform;
