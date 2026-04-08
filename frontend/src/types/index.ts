// API types matching backend DTOs

export interface ProductSummary {
  id: string;
  name: string;
  wineType: string;
  varietal: string;
  region: string;
  winery: string;
  vintage: number | null;
  volume: string;
  imageUrl: string | null;
  availabilityStatus: 'Available' | 'LowStock' | 'OutOfStock';
  stockCases: number;
  ratingScore: number | null;
  isShippingAvailable: boolean;
  deals: string[];
}

export interface ProductDetail extends ProductSummary {
  recommendations: ProductSummary[];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface FilterOptions {
  wineTypes: string[];
  varietals: string[];
  regions: string[];
  wineries: string[];
  vintages: number[];
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  imageUrl: string | null;
  volume: string;
  quantity: number;
  availabilityStatus: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  imageUrl: string | null;
  volume: string;
  availabilityStatus: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface ProductFilters {
  wineType?: string;
  varietal?: string;
  region?: string;
  winery?: string;
  vintage?: number;
  keyword?: string;
  page: number;
  pageSize: number;
}
