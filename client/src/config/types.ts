export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  price_type?: "HOURLY" | "FIXED";
  provider: string;
  location: string;
  rating: number;
  location_h3?: string;
  availability_start?: string;
  availability_end?: string;
  created_at?: string;
}

export type ViewType = 'seeker' | 'provider';