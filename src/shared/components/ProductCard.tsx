import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Button,
  Badge,
  Image,
  ButtonGroup,
  Tooltip
} from '@shopify/polaris';
import { CartIcon, ContractIcon } from '@shopify/polaris-icons';
import type { Product } from '../types';
import { IMAGE_GENERATORS, PRODUCT_IMAGES } from '../../data/mock/constants';

interface ProductCardProps {
  product: Product;
  onAddToQuote: (productId: string) => void; // Unified action for B2B workflow
  onViewDetails: (productId: string) => void;
  showVolumeDiscounts?: boolean;
}

export function ProductCard({
  product,
  onAddToQuote,
  onViewDetails,
  showVolumeDiscounts = true
}: ProductCardProps) {
  const hasVolumeDiscounts = product.volumePricing.length > 0;
  const lowestVolumePrice = hasVolumeDiscounts
    ? Math.min(...product.volumePricing.map(vp => vp.pricePerUnit))
    : null;
  const maxDiscount = hasVolumeDiscounts
    ? Math.max(...product.volumePricing.map(vp => vp.discountPercentage || 0))
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0;

  // Get product image URL from imageId
  const getProductImageUrl = (imageId?: string) => {
    if (!imageId) return '/products/cordless-drill.jpg';
    return IMAGE_GENERATORS.local(imageId);
  };

  return (
    <Card>
      <BlockStack gap="300">
        {/* Product Image */}
        <div style={{ position: 'relative' }}>
          <Image
            source={getProductImageUrl(product.imageId)}
            alt={product.name}
            width="100%"
            height="200px"
            style={{
              objectFit: 'cover',
              borderRadius: '6px',
              //filter: 'blur(3px) brightness(1.3) saturate(0.04)',
              //opacity: 0.95
            }}
          />
          {!product.inStock && (
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px'
            }}>
              <Badge tone="critical">Out of Stock</Badge>
            </div>
          )}
          {hasVolumeDiscounts && maxDiscount > 0 && (
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '8px'
            }}>
              <Badge tone="success">Up to {maxDiscount}% off</Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <BlockStack gap="200">
          {/* Brand and Model */}
          <InlineStack align="space-between" blockAlign="start">
            <Text as="p" variant="bodySm" tone="subdued">
              {product.brand} • {product.model}
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              SKU: {product.sku}
            </Text>
          </InlineStack>

          {/* Product Name */}
          <Text as="h3" variant="headingSm" truncate>
            {product.name}
          </Text>

          {/* Rating and Stock */}
          <InlineStack align="space-between" blockAlign="center">
            <InlineStack gap="200" blockAlign="center">
              {avgRating > 0 && (
                <InlineStack gap="100" blockAlign="center">
                  <Text as="span" variant="bodySm">
                    ★ {avgRating.toFixed(1)}
                  </Text>
                  <Text as="span" variant="bodySm" tone="subdued">
                    ({product.reviews.length})
                  </Text>
                </InlineStack>
              )}
            </InlineStack>
            <Text as="p" variant="bodySm" tone={product.inStock ? "success" : "critical"}>
              {product.inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}
            </Text>
          </InlineStack>

          {/* Pricing */}
          <BlockStack gap="100">
            <InlineStack align="space-between" blockAlign="baseline">
              <Text as="p" variant="headingMd">
                {formatPrice(product.basePrice)}
              </Text>
              {lowestVolumePrice && lowestVolumePrice < product.basePrice && (
                <Tooltip content="Volume discount pricing available">
                  <Text as="p" variant="bodySm" tone="subdued">
                    from {formatPrice(lowestVolumePrice)}
                  </Text>
                </Tooltip>
              )}
            </InlineStack>
            
            {showVolumeDiscounts && hasVolumeDiscounts && (
              <Text as="p" variant="bodySm" tone="subdued">
                Volume discounts available
              </Text>
            )}
          </BlockStack>

          {/* Description Preview */}
          <Text as="p" variant="bodySm" tone="subdued">
            {product.description.length > 80 
              ? `${product.description.substring(0, 80)}...` 
              : product.description
            }
          </Text>
        </BlockStack>

        {/* Action Buttons */}
        <InlineStack gap="200">
          <ButtonGroup>
            <Button
              onClick={() => onViewDetails(product.id)}
              variant="secondary"
              fullWidth
            >
              View Details
            </Button>
            <Button
              onClick={() => onAddToQuote(product.id)}
              icon={ContractIcon}
              variant="primary"
              disabled={!product.inStock}
            >
              Add to Quote
            </Button>
          </ButtonGroup>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}