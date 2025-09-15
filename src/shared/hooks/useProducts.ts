import { useApi, usePaginatedApi } from './useApi';
import type { Product, ProductCategory } from '../types';

export function useProducts(
  page = 1,
  limit = 12,
  category?: string
) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (category) {
    queryParams.set('category', category);
  }

  return usePaginatedApi<Product>(
    ['products', { page, limit, category }],
    () => fetch(`/api/products?${queryParams}`)
  );
}

export function useProduct(productId: string, enabled = true) {
  return useApi<Product>(
    ['product', productId],
    () => fetch(`/api/products/${productId}`),
    { enabled: enabled && !!productId }
  );
}

export function useCategories() {
  return useApi<ProductCategory[]>(
    ['categories'],
    () => fetch('/api/categories')
  );
}

export function useSearchProducts(searchTerm: string, enabled = true) {
  return useProducts(1, 20, undefined);
}