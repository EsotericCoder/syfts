export interface Deal {
  id: string;
  name: string;
  slug?: string;
  brand: string;
  category: string;
  originalPrice: number;
  dealPrice: number;
  discount: number;
  store: string;
  link: string;
  image: string;
  hot: boolean;
  postedAt: string;
}

export const CATEGORIES = [
  "All",
  "Daily Trainer",
  "Racing",
  "Trail",
  "Stability",
  "Recovery",
] as const;

export interface Product {
  id: number;
  name: string;
  slug: string;
  brandId: number;
  brandName: string;
  sportId: number;
  category: string;
  description: string | null;
  imageUrl: string | null;
  specs: Record<string, string>;
  previousVersionSlug: string | null;
  createdAt: string;
}

export interface DealRow {
  id: number;
  productId: number;
  storeId: number;
  storeName: string;
  storeDomain: string | null;
  currentPrice: number;
  originalPrice: number;
  discountPct: number;
  affiliateUrl: string;
  isActive: boolean;
  updatedAt: string;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
}

export interface Alert {
  id: number;
  email: string;
  productId: number;
  priceThreshold: number;
  isActive: boolean;
  triggeredAt: string | null;
  createdAt: string;
}

export interface TriggeredAlert {
  alertId: number;
  email: string;
  productName: string;
  currentPrice: number;
  priceThreshold: number;
}
