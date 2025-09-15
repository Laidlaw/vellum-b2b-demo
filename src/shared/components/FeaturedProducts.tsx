import { Card, BlockStack, InlineStack, Text, Button, Badge, Grid } from '@shopify/polaris';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { IMAGE_GENERATORS } from '../../data/mock/constants';

interface FeaturedProductsProps {
  products: Product[];
  onAddToQuote?: (productId: string) => void;
  onViewDetails?: (productId: string) => void;
  isLoading?: boolean;
}

export function FeaturedProducts({
  products,
  onAddToQuote,
  onViewDetails,
  isLoading = false
}: FeaturedProductsProps) {
  // Get high-value featured products (top 6 by price)
  const featuredProducts = products
    .filter(p => p.inStock && p.basePrice >= 100) // High-value items
    .sort((a, b) => b.basePrice - a.basePrice)
    .slice(0, 6);

  if (isLoading) {
    return (
      <Card>
        <BlockStack gap="400">
          <Text as="h2" variant="headingLg">Featured Products</Text>
          <Text as="p">Loading featured products...</Text>
        </BlockStack>
      </Card>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <Card>
        <BlockStack gap="400">
          <Text as="h2" variant="headingLg">Featured Products</Text>
          <Text as="p">No featured products available at this time.</Text>
        </BlockStack>
      </Card>
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

  // Get product image URL from imageId
  const getProductImageUrl = (imageId?: string) => {
    if (!imageId) return '/products/steel-toe-work-boots-professional-product-photo-white-background-studio-lighting-commercial-photogra.jpg';
    return IMAGE_GENERATORS.local(imageId);
  };

  return (
    <Card>
      <BlockStack gap="500">
        <BlockStack gap="200">
          <InlineStack align="space-between">
            <Text as="h2" variant="headingLg">Featured Products</Text>
            <Link to="/storefront/products">
              <Button variant="plain">View All Products</Button>
            </Link>
          </InlineStack>
          <Text as="p" tone="subdued">
            Professional-grade equipment trusted by industry leaders
          </Text>
        </BlockStack>

        <Grid>
          {featuredProducts.map((product) => {
            const volumeDiscount = getVolumeDiscount(product);
            
            return (
              <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }} key={product.id}>
                <Card>
                  <BlockStack gap="300">
                    {/* Product Image */}
                    <div style={{ 
                      position: 'relative',
                      width: '100%',
                      height: '200px',
                      background: '#f6f6f7',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={getProductImageUrl(product.imageId)}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          //filter: 'blur(2px) brightness(1.1) saturate(0.9)',
                          //opacity: 0.95
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/products/steel-toe-work-boots-professional-product-photo-white-background-studio-lighting-commercial-photogra.jpg';
                        }}
                      />
                      {volumeDiscount && (
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px'
                        }}>
                          <Badge tone="attention">Save up to {volumeDiscount}%</Badge>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <BlockStack gap="200">
                      <BlockStack gap="100">
                        <Text as="p" tone="subdued" variant="bodyXs">
                          {product.brand} • SKU: {product.sku}
                        </Text>
                        <Text as="h3" variant="bodyMd" fontWeight="semibold">
                          {product.name}
                        </Text>
                      </BlockStack>

                      <InlineStack align="space-between" blockAlign="center">
                        <BlockStack gap="100">
                          <Text as="p" variant="headingMd">
                            {formatPrice(product.basePrice)}
                          </Text>
                          {volumeDiscount && (
                            <Text as="p" variant="bodyXs" tone="subdued">
                              Volume pricing available
                            </Text>
                          )}
                        </BlockStack>
                        <Badge tone="success">In Stock</Badge>
                      </InlineStack>
                    </BlockStack>

                    {/* Action Buttons */}
                    <InlineStack gap="200">
                      <Button
                        variant="primary"
                        size="medium"
                        onClick={() => onAddToQuote?.(product.id)}
                      >
                        Add to Quote
                      </Button>
                      <Button
                        variant="plain"
                        size="medium"
                        onClick={() => onViewDetails?.(product.id)}
                      >
                        Details
                      </Button>
                    </InlineStack>
                  </BlockStack>
                </Card>
              </Grid.Cell>
            );
          })}
        </Grid>

        {/* Bottom CTA */}
        <Card tone="subdued">
          <InlineStack align="center" gap="300">
            <Text as="p" variant="bodyMd">
              Need custom pricing for large orders?
            </Text>
            <Button variant="primary">Contact Sales Team</Button>
          </InlineStack>
        </Card>
      </BlockStack>
    </Card>
  );
}