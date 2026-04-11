export interface Deal {
  id: string;
  name: string;
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
