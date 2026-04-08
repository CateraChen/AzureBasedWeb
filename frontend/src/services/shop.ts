import type { FilterOptions, PagedResult, ProductDetail, ProductFilters, ProductSummary } from '../types';
import api from './apiClient';

export async function fetchProducts(filters: ProductFilters): Promise<PagedResult<ProductSummary>> {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
  );
  const { data } = await api.get('/api/products', { params });
  return data;
}

export async function fetchProductDetail(id: string): Promise<ProductDetail> {
  const { data } = await api.get(`/api/products/${id}`);
  return data;
}

export async function fetchFilters(): Promise<FilterOptions> {
  const { data } = await api.get('/api/products/filters');
  return data;
}
