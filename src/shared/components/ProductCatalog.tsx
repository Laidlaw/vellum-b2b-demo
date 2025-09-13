import { 
  Card, 
  BlockStack, 
  InlineStack, 
  Text, 
  Button, 
  Select,
  Pagination,
  EmptyState,
  Spinner,
  Filters,
  ResourceList,
  ResourceItem,
  Grid
} from '@shopify/polaris';
import { useState, useMemo } from 'react';
import type { Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';

interface ProductCatalogProps {
  products: Product[];
  categories: ProductCategory[];
  isLoading?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onAddToCart: (productId: string) => void;
  onAddToQuote: (productId: string) => void;
  onViewDetails: (productId: string) => void;
}

interface FilterState {
  searchQuery: string;
  category: string;
  brand: string;
  priceRange: string;
  inStockOnly: boolean;
}

const PRICE_RANGES = [
  { label: 'All prices', value: '' },
  { label: 'Under $100', value: '0-100' },
  { label: '$100 - $500', value: '100-500' },
  { label: '$500 - $1,000', value: '500-1000' },
  { label: '$1,000+', value: '1000+' }
];

export function ProductCatalog({
  products,
  categories,
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onAddToCart,
  onAddToQuote,
  onViewDetails
}: ProductCatalogProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: '',
    brand: '',
    priceRange: '',
    inStockOnly: false
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Extract unique brands from products
  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(products.map(p => p.brand))).sort();
    return [
      { label: 'All brands', value: '' },
      ...uniqueBrands.map(brand => ({ label: brand, value: brand }))
    ];
  }, [products]);

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch = 
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.model.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Brand filter
      if (filters.brand && product.brand !== filters.brand) {
        return false;
      }

      // Price range filter
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (max) {
          if (product.basePrice < min || product.basePrice > max) return false;
        } else {
          if (product.basePrice < min) return false;
        }
      }

      // Stock filter
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      return true;
    });
  }, [products, filters]);

  const handleFiltersChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearAllFilters = () => {
    setFilters({
      searchQuery: '',
      category: '',
      brand: '',
      priceRange: '',
      inStockOnly: false
    });
  };

  const appliedFilters = [];
  if (filters.category) {
    const category = categories.find(c => c.id === filters.category);
    appliedFilters.push({
      key: 'category',
      label: `Category: ${category?.name || filters.category}`,
      onRemove: () => handleFiltersChange({ category: '' })
    });
  }
  if (filters.brand) {
    appliedFilters.push({
      key: 'brand',
      label: `Brand: ${filters.brand}`,
      onRemove: () => handleFiltersChange({ brand: '' })
    });
  }
  if (filters.priceRange) {
    const priceLabel = PRICE_RANGES.find(r => r.value === filters.priceRange)?.label || filters.priceRange;
    appliedFilters.push({
      key: 'priceRange',
      label: priceLabel,
      onRemove: () => handleFiltersChange({ priceRange: '' })
    });
  }
  if (filters.inStockOnly) {
    appliedFilters.push({
      key: 'inStockOnly',
      label: 'In stock only',
      onRemove: () => handleFiltersChange({ inStockOnly: false })
    });
  }

  const filtersMarkup = (
    <Filters
      queryValue={filters.searchQuery}
      queryPlaceholder="Search products..."
      filters={[
        {
          key: 'category',
          label: 'Category',
          filter: (
            <Select
              label="Category"
              labelHidden
              options={[
                { label: 'All categories', value: '' },
                ...categories.map(cat => ({ label: cat.name, value: cat.id }))
              ]}
              value={filters.category}
              onChange={(value) => handleFiltersChange({ category: value })}
            />
          )
        },
        {
          key: 'brand',
          label: 'Brand',
          filter: (
            <Select
              label="Brand"
              labelHidden
              options={brands}
              value={filters.brand}
              onChange={(value) => handleFiltersChange({ brand: value })}
            />
          )
        },
        {
          key: 'priceRange',
          label: 'Price range',
          filter: (
            <Select
              label="Price range"
              labelHidden
              options={PRICE_RANGES}
              value={filters.priceRange}
              onChange={(value) => handleFiltersChange({ priceRange: value })}
            />
          )
        },
        {
          key: 'inStockOnly',
          label: 'Availability',
          filter: (
            <InlineStack gap="200">
              <Button
                pressed={filters.inStockOnly}
                onClick={() => handleFiltersChange({ inStockOnly: !filters.inStockOnly })}
                variant="secondary"
              >
                In stock only
              </Button>
            </InlineStack>
          )
        }
      ]}
      appliedFilters={appliedFilters}
      onQueryChange={(value) => handleFiltersChange({ searchQuery: value })}
      onQueryClear={() => handleFiltersChange({ searchQuery: '' })}
      onClearAll={clearAllFilters}
    />
  );

  if (isLoading) {
    return (
      <Card>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '200px' 
        }}>
          <Spinner accessibilityLabel="Loading products" size="large" />
        </div>
      </Card>
    );
  }

  if (filteredProducts.length === 0 && products.length > 0) {
    return (
      <BlockStack gap="400">
        <Card>
          {filtersMarkup}
        </Card>
        <Card>
          <EmptyState
            heading="No products found"
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>Try changing your search terms or clearing some filters.</p>
            <Button onClick={clearAllFilters}>Clear all filters</Button>
          </EmptyState>
        </Card>
      </BlockStack>
    );
  }

  if (products.length === 0) {
    return (
      <Card>
        <EmptyState
          heading="No products available"
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
          <p>Check back later for new products.</p>
        </EmptyState>
      </Card>
    );
  }

  const resultsMarkup = viewMode === 'grid' ? (
    <Grid>
      {filteredProducts.map((product) => (
        <Grid.Cell key={product.id} columnSpan={{ xs: 6, sm: 4, md: 4, lg: 3, xl: 3 }}>
          <ProductCard
            product={product}
            onAddToCart={onAddToCart}
            onAddToQuote={onAddToQuote}
            onViewDetails={onViewDetails}
          />
        </Grid.Cell>
      ))}
    </Grid>
  ) : (
    <ResourceList
      resourceName={{ singular: 'product', plural: 'products' }}
      items={filteredProducts}
      renderItem={(product) => {
        const media = (
          <img
            alt={product.name}
            width="80"
            height="80"
            style={{ objectFit: 'cover', borderRadius: '4px' }}
            src={product.imageUrl}
          />
        );

        return (
          <ResourceItem
            id={product.id}
            media={media}
            accessibilityLabel={`View details for ${product.name}`}
            onClick={() => onViewDetails(product.id)}
          >
            <BlockStack gap="200">
              <InlineStack align="space-between">
                <BlockStack gap="100">
                  <Text as="h3" variant="headingSm">
                    {product.name}
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    {product.brand} • {product.model} • SKU: {product.sku}
                  </Text>
                </BlockStack>
                <BlockStack gap="100" align="end">
                  <Text as="p" variant="headingSm">
                    ${product.basePrice.toFixed(2)}
                  </Text>
                  <Text as="p" variant="bodySm" tone={product.inStock ? "success" : "critical"}>
                    {product.inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}
                  </Text>
                </BlockStack>
              </InlineStack>
              <InlineStack gap="200">
                <Button size="slim" onClick={() => onAddToQuote(product.id)} disabled={!product.inStock}>
                  Add to Quote
                </Button>
                <Button size="slim" variant="primary" onClick={() => onAddToCart(product.id)} disabled={!product.inStock}>
                  Add to Cart
                </Button>
              </InlineStack>
            </BlockStack>
          </ResourceItem>
        );
      }}
    />
  );

  return (
    <BlockStack gap="400">
      <Card>
        {filtersMarkup}
      </Card>

      <Card>
        <BlockStack gap="400">
          <InlineStack align="space-between" blockAlign="center">
            <Text as="p" variant="bodySm" tone="subdued">
              Showing {filteredProducts.length} of {products.length} products
            </Text>
            <InlineStack gap="200">
              <Button
                pressed={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}
                variant="secondary"
                size="slim"
              >
                Grid
              </Button>
              <Button
                pressed={viewMode === 'list'}
                onClick={() => setViewMode('list')}
                variant="secondary"
                size="slim"
              >
                List
              </Button>
            </InlineStack>
          </InlineStack>

          {resultsMarkup}

          {totalPages > 1 && onPageChange && (
            <InlineStack align="center">
              <Pagination
                label={`Page ${currentPage} of ${totalPages}`}
                hasPrevious={currentPage > 1}
                onPrevious={() => onPageChange(currentPage - 1)}
                hasNext={currentPage < totalPages}
                onNext={() => onPageChange(currentPage + 1)}
              />
            </InlineStack>
          )}
        </BlockStack>
      </Card>
    </BlockStack>
  );
}