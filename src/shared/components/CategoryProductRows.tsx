import { Card, BlockStack, InlineStack, Text, Button, Badge, Scrollable } from '@shopify/polaris';
import { Link } from 'react-router-dom';
import type { Product, ProductCategory } from '../types';

interface CategoryProductRowsProps {
  products: Product[];
  categories: ProductCategory[];
  onAddToCart?: (productId: string) => void;
  onAddToQuote?: (productId: string) => void;
  onViewDetails?: (productId: string) => void;
  isLoading?: boolean;
}

export function CategoryProductRows({
  products,
  categories,
  onAddToCart,
  onAddToQuote,
  onViewDetails,
  isLoading = false
}: CategoryProductRowsProps) {
  if (isLoading) {
    return (
      <BlockStack gap="500">
        <Text as="p">Loading product categories...</Text>
      </BlockStack>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getVolumeDiscount = (product: Product) => {
    if (product.volumePricing && product.volumePricing.length > 0) {
      const maxDiscount = Math.max(...product.volumePricing.map(vp => vp.discountPercentage || 0));
      return maxDiscount > 0 ? maxDiscount : null;
    }
    return null;
  };

  // Filter and group products by key categories
  const keyCategories = ['Safety Equipment', 'Power Tools', 'Storage'];
  
  const getCategoryProducts = (categoryName: string) => {
    return products
      .filter(p => p.category === categoryName && p.inStock)
      .slice(0, 6); // Show up to 6 products per category
  };

  const CategoryRow = ({ categoryName }: { categoryName: string }) => {
    const categoryProducts = getCategoryProducts(categoryName);
    const category = categories.find(c => c.name === categoryName);

    if (categoryProducts.length === 0) {
      return null;
    }

    return (
      <Card>
        <BlockStack gap="400">
          {/* Category Header */}
          <InlineStack align="space-between" blockAlign="center">
            <BlockStack gap="100">
              <Text as="h3" variant="headingLg">{categoryName}</Text>
              <Text as="p" tone="subdued">
                {category?.description || `Professional ${categoryName.toLowerCase()} for industrial use`}
              </Text>
            </BlockStack>
            <Link to={`/storefront/products?category=${encodeURIComponent(categoryName)}`}>
              <Button variant="plain">View All {categoryName}</Button>
            </Link>
          </InlineStack>

          {/* Horizontal Scrollable Product Row */}
          <Scrollable horizontal>
            <div style={{ 
              display: 'flex', 
              gap: '16px',
              paddingBottom: '8px',
              minWidth: 'max-content'
            }}>
              {categoryProducts.map((product) => {
                const volumeDiscount = getVolumeDiscount(product);
                
                return (
                  <div
                    key={product.id}
                    style={{
                      minWidth: '280px',
                      maxWidth: '280px',
                      flexShrink: 0
                    }}
                  >
                    <Card>
                      <BlockStack gap="300">
                        {/* Product Image */}
                        <div style={{ 
                          position: 'relative',
                          width: '100%',
                          height: '160px',
                          background: '#f6f6f7',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://via.placeholder.com/280x160/cccccc/666666?text=${encodeURIComponent(product.name)}`;
                            }}
                          />
                          {volumeDiscount && (
                            <div style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px'
                            }}>
                              <Badge tone="attention" size="small">-{volumeDiscount}%</Badge>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <BlockStack gap="200">
                          <BlockStack gap="100">
                            <Text as="p" tone="subdued" variant="bodyXs">
                              {product.brand} • {product.sku}
                            </Text>
                            <Text 
                              as="h4" 
                              variant="bodyMd" 
                              fontWeight="semibold"
                              truncate
                            >
                              {product.name}
                            </Text>
                          </BlockStack>

                          <InlineStack align="space-between" blockAlign="center">
                            <BlockStack gap="50">
                              <Text as="p" variant="bodyLg" fontWeight="semibold">
                                {formatPrice(product.basePrice)}
                              </Text>
                              {volumeDiscount && (
                                <Text as="p" variant="bodyXs" tone="subdued">
                                  Bulk pricing
                                </Text>
                              )}
                            </BlockStack>
                            <Badge tone="success" size="small">Stock: {product.stockQuantity}</Badge>
                          </InlineStack>
                        </BlockStack>

                        {/* Action Buttons */}
                        <InlineStack gap="200">
                          <Button
                            variant="primary"
                            size="medium"
                            onClick={() => onAddToCart?.(product.id)}
                          >
                            Add to Cart
                          </Button>
                          <Button
                            variant="secondary"
                            size="medium"
                            onClick={() => onAddToQuote?.(product.id)}
                          >
                            Quote
                          </Button>
                          <Button
                            variant="plain"
                            size="medium"
                            onClick={() => onViewDetails?.(product.id)}
                          >
                            View
                          </Button>
                        </InlineStack>
                      </BlockStack>
                    </Card>
                  </div>
                );
              })}
            </div>
          </Scrollable>
        </BlockStack>
      </Card>
    );
  };

  return (
    <BlockStack gap="500">
      {keyCategories.map((categoryName) => (
        <CategoryRow key={categoryName} categoryName={categoryName} />
      ))}
      
      {/* Additional categories section */}
      {categories.length > keyCategories.length && (
        <Card tone="subdued">
          <BlockStack gap="300">
            <Text as="h3" variant="headingMd">More Categories</Text>
            <InlineStack gap="200" wrap>
              {categories
                .filter(cat => !keyCategories.includes(cat.name))
                .slice(0, 8) // Show up to 8 additional categories
                .map((category) => (
                  <Link 
                    key={category.id} 
                    to={`/storefront/products?category=${encodeURIComponent(category.name)}`}
                  >
                    <Button variant="plain" size="medium">
                      {category.name}
                    </Button>
                  </Link>
                ))
              }
            </InlineStack>
          </BlockStack>
        </Card>
      )}
    </BlockStack>
  );
}