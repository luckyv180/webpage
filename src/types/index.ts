export type Platform = 'Amazon' | 'Flipkart' | 'Meesho';

export type Brand = 'HUL' | 'P&G' | "L'Oréal";

export interface PlatformCommission {
  platform: Platform;
  commission: number; // percentage
  price: number; // platform-specific price
  link: string;
}

export interface Product {
  id: string;
  name: string;
  brand: Brand;
  category: string;
  description: string;
  imageUrl: string;
  lastUpdated: string; // ISO date string
  platforms: PlatformCommission[];
  trending?: boolean;
}

export type QuickFilter = 'highest' | 'recent' | 'above10' | 'trending';

export type ViewMode = 'all' | Platform;
