import {
  Page,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Button,
  Badge,
  Image,
  DataTable,
  TextField,
  Divider,
  Grid,
  Tabs,
  Modal,
  FormLayout,
  List
} from '@shopify/polaris';
import { CartIcon, ContractIcon, HeartIcon } from '@shopify/polaris-icons';
import { useState, useMemo } from 'react';
import type { Product } from '../types';
import Rating from './Rating';
import { formatDate } from '../utils';
import { IMAGE_GENERATORS } from '../../data/mock/constants';

interface ProductDetailsProps {
  product: Product;
  onAddToCart: (productId: string, quantity: number) => void;
  onAddToQuote: (productId: string, quantity: number) => void;
  onBack: () => void;
}

export function ProductDetails({
  product,
  onAddToCart,
  onAddToQuote,
  onBack
}: ProductDetailsProps) {
  const [quantity, setQuantity] = useState('1');
  const [selectedTab, setSelectedTab] = useState(0);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteQuantity, setQuoteQuantity] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');

  const quantityNumber = parseInt(quantity) || 1;
  const maxQuantity = product.inStock ? product.stockQuantity : 0;

  // Get product image URL from imageId
  const getProductImageUrl = (imageId?: string) => {
    if (!imageId) return '/src/assets/products/steel-toe-work-boots-professional-product-photo-white-background-studio-lighting-commercial-photogra.jpg';
    return IMAGE_GENERATORS.local(imageId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDimensions = (product: Product) => {
    const { dimensions } = product;
    return `${dimensions.length} × ${dimensions.width} × ${dimensions.height} ${dimensions.units}, ${dimensions.weight} ${dimensions.weightUnit}`;
  };

  // Calculate applicable volume pricing
  const applicableVolumePrice = useMemo(() => {
    if (!product.volumePricing.length) return null;
    
    // Sort by minimum quantity descending to find the best applicable tier
    const sortedPricing = [...product.volumePricing].sort((a, b) => b.minQuantity - a.minQuantity);
    
    return sortedPricing.find(vp => 
      quantityNumber >= vp.minQuantity && 
      (!vp.maxQuantity || quantityNumber <= vp.maxQuantity)
    );
  }, [product.volumePricing, quantityNumber]);

  const currentPrice = applicableVolumePrice?.pricePerUnit || product.basePrice;
  const totalPrice = currentPrice * quantityNumber;
  const savings = applicableVolumePrice ? 
    (product.basePrice - applicableVolumePrice.pricePerUnit) * quantityNumber : 0;

  const avgRating = product.reviews.length > 0 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0;

  // Volume pricing table data
  const volumePricingRows = product.volumePricing.map(vp => [
    `${vp.minQuantity}${vp.maxQuantity ? ` - ${vp.maxQuantity}` : '+'}`,
    formatPrice(vp.pricePerUnit),
    vp.discountPercentage ? `${vp.discountPercentage}%` : '-',
    formatPrice(vp.pricePerUnit * vp.minQuantity)
  ]);

  // Product specifications
  const specifications = [
    ['Brand', product.brand],
    ['Model', product.model],
    ['SKU', product.sku],
    ['Dimensions', formatDimensions(product)],
    ['Category', product.category],
    ['Stock Status', product.inStock ? `${product.stockQuantity} in stock` : 'Out of stock']
  ];

  const tabs = [
    {
      id: 'description',
      content: 'Description',
      panelID: 'description-panel'
    },
    {
      id: 'specifications',
      content: 'Specifications',
      panelID: 'specifications-panel'
    },
    {
      id: 'volume-pricing',
      content: 'Volume Pricing',
      panelID: 'volume-pricing-panel'
    },
    {
      id: 'reviews',
      content: `Reviews (${product.reviews.length})`,
      panelID: 'reviews-panel'
    }
  ];

  const handleAddToCart = () => {
    onAddToCart(product.id, quantityNumber);
  };

  const handleRequestQuote = () => {
    if (quoteQuantity) {
      onAddToQuote(product.id, parseInt(quoteQuantity) || 1);
      setShowQuoteModal(false);
      setQuoteQuantity('');
      setQuoteNotes('');
    }
  };

  const quoteModal = (
    <Modal
      open={showQuoteModal}
      onClose={() => setShowQuoteModal(false)}
      title="Request Quote"
      primaryAction={{
        content: 'Request Quote',
        onAction: handleRequestQuote,
        disabled: !quoteQuantity
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: () => setShowQuoteModal(false)
        }
      ]}
    >
      <Modal.Section>
        <FormLayout>
          <TextField
            label="Quantity"
            type="number"
            value={quoteQuantity}
            onChange={setQuoteQuantity}
            min="1"
            helpText="Enter the quantity you'd like to quote"
            autoComplete="off"
          />
          <TextField
            label="Additional notes (optional)"
            value={quoteNotes}
            onChange={setQuoteNotes}
            multiline={3}
            helpText="Any specific requirements or questions about this product"
            autoComplete="off"
          />
        </FormLayout>
      </Modal.Section>
    </Modal>
  );

  const tabContent = () => {
    switch (selectedTab) {
      case 0:
        return (
          <Card>
            <Text as="p">{product.description}</Text>
          </Card>
        );
      case 1:
        return (
          <Card>
            <DataTable
              columnContentTypes={['text', 'text']}
              headings={['Specification', 'Value']}
              rows={specifications}
            />
          </Card>
        );
      case 2:
        return (
          <Card>
            {product.volumePricing.length > 0 ? (
              <BlockStack gap="300">
                <Text as="h3" variant="headingSm">Volume Discount Pricing</Text>
                <DataTable
                  columnContentTypes={['text', 'numeric', 'text', 'numeric']}
                  headings={['Quantity', 'Unit Price', 'Discount', 'Total (Min Qty)']}
                  rows={volumePricingRows}
                />
                <Text as="p" variant="bodySm" tone="subdued">
                  Prices automatically adjust based on quantity selected. Contact us for pricing on larger quantities.
                </Text>
              </BlockStack>
            ) : (
              <Text as="p" tone="subdued">No volume pricing available for this product.</Text>
            )}
          </Card>
        );
      case 3:
        return (
          <Card>
            {product.reviews.length > 0 ? (
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h3" variant="headingSm">Customer Reviews</Text>
                  <InlineStack gap="200" blockAlign="center">
                    <Rating value={avgRating} />
                    <Text as="span" variant="bodySm">
                      {avgRating.toFixed(1)} out of 5 ({product.reviews.length} reviews)
                    </Text>
                  </InlineStack>
                </InlineStack>
                
                <BlockStack gap="300">
                  {product.reviews.slice(0, 5).map((review) => (
                    <Card key={review.id}>
                      <BlockStack gap="200">
                        <InlineStack align="space-between" blockAlign="start">
                          <BlockStack gap="100">
                            <InlineStack gap="200" blockAlign="center">
                              <Text as="h4" variant="headingXs">{review.userName}</Text>
                              {review.verified && <Badge tone="success">Verified Purchase</Badge>}
                            </InlineStack>
                            <Rating value={review.rating} />
                          </BlockStack>
                          <Text as="p" variant="bodySm" tone="subdued">
                            {formatDate(review.dateCreated)}
                          </Text>
                        </InlineStack>
                        <Text as="p">{review.comment}</Text>
                      </BlockStack>
                    </Card>
                  ))}
                </BlockStack>
              </BlockStack>
            ) : (
              <Text as="p" tone="subdued">No reviews yet for this product.</Text>
            )}
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Page
        backAction={{
          content: 'Back to Products',
          onAction: onBack
        }}
        title={product.name}
        subtitle={`${product.brand} • ${product.model}`}
      >
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 8, xl: 8 }}>
            <BlockStack gap="500">
              {/* Product Image and Basic Info */}
              <Card>
                <Grid>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <div style={{ position: 'relative' }}>
                      <Image
                        source={getProductImageUrl(product.imageId)}
                        alt={product.name}
                        width="100%"
                        height="400px"
                        style={{
                          objectFit: 'cover',
                          borderRadius: '6px',
                          filter: 'blur(2px) brightness(1.1) saturate(0.9)',
                          opacity: 0.95
                        }}
                      />
                      {!product.inStock && (
                        <div style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px'
                        }}>
                          <Badge tone="critical" size="large">Out of Stock</Badge>
                        </div>
                      )}
                    </div>
                  </Grid.Cell>
                  
                  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <BlockStack gap="400">
                      <BlockStack gap="200">
                        <InlineStack align="space-between" blockAlign="start">
                          <Text as="p" variant="bodySm" tone="subdued">
                            SKU: {product.sku}
                          </Text>
                          <Button variant="plain" icon={HeartIcon} accessibilityLabel="Add to wishlist" />
                        </InlineStack>
                        
                        <Text as="h1" variant="headingLg">
                          {product.name}
                        </Text>
                        
                        <Text as="p" variant="bodyLg" tone="subdued">
                          {product.brand} • {product.model}
                        </Text>

                        {avgRating > 0 && (
                          <InlineStack gap="200" blockAlign="center">
                            <Rating value={avgRating} />
                            <Text as="span" variant="bodySm">
                              {avgRating.toFixed(1)} ({product.reviews.length} reviews)
                            </Text>
                          </InlineStack>
                        )}
                      </BlockStack>

                      <Divider />

                      <BlockStack gap="300">
                        <Text as="p" variant="bodyLg">
                          {product.description}
                        </Text>
                        
                        <InlineStack align="space-between" blockAlign="baseline">
                          <Text as="p" variant="bodySm" tone="subdued">
                            Dimensions: {formatDimensions(product)}
                          </Text>
                          <Text as="p" variant="bodySm" tone={product.inStock ? "success" : "critical"}>
                            {product.inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}
                          </Text>
                        </InlineStack>
                      </BlockStack>
                    </BlockStack>
                  </Grid.Cell>
                </Grid>
              </Card>

              {/* Product Details Tabs */}
              <Card>
                <Tabs
                  tabs={tabs}
                  selected={selectedTab}
                  onSelect={setSelectedTab}
                >
                  {tabContent()}
                </Tabs>
              </Card>
            </BlockStack>
          </Grid.Cell>

          {/* Sidebar - Pricing and Actions */}
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 4, xl: 4 }}>
            <Card>
              <BlockStack gap="400">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">Pricing</Text>
                  
                  <InlineStack align="space-between" blockAlign="baseline">
                    <Text as="p" variant="headingLg">
                      {formatPrice(currentPrice)}
                    </Text>
                    {applicableVolumePrice && (
                      <Badge tone="success">Volume discount applied</Badge>
                    )}
                  </InlineStack>

                  {applicableVolumePrice && savings > 0 && (
                    <Text as="p" variant="bodySm" tone="subdued">
                      Regular price: <s>{formatPrice(product.basePrice)}</s> • Save {formatPrice(savings)}
                    </Text>
                  )}
                </BlockStack>

                <Divider />

                <FormLayout>
                  <TextField
                    label="Quantity"
                    type="number"
                    value={quantity}
                    onChange={setQuantity}
                    min="1"
                    max={maxQuantity.toString()}
                    disabled={!product.inStock}
                    helpText={product.inStock ? `Maximum: ${maxQuantity}` : 'Out of stock'}
                    autoComplete="off"
                  />

                  {quantityNumber > 1 && (
                    <BlockStack gap="100">
                      <InlineStack align="space-between">
                        <Text as="p" variant="bodySm">Subtotal:</Text>
                        <Text as="p" variant="bodySm">{formatPrice(totalPrice)}</Text>
                      </InlineStack>
                      {savings > 0 && (
                        <InlineStack align="space-between">
                          <Text as="p" variant="bodySm" tone="success">You save:</Text>
                          <Text as="p" variant="bodySm" tone="success">{formatPrice(savings)}</Text>
                        </InlineStack>
                      )}
                    </BlockStack>
                  )}
                </FormLayout>

                <BlockStack gap="200">
                  <Button
                    fullWidth
                    variant="primary"
                    size="large"
                    icon={CartIcon}
                    onClick={handleAddToCart}
                    disabled={!product.inStock || quantityNumber > maxQuantity}
                  >
                    Add to Cart
                  </Button>
                  
                  <Button
                    fullWidth
                    variant="secondary"
                    size="large"
                    icon={ContractIcon}
                    onClick={() => setShowQuoteModal(true)}
                  >
                    Request Quote
                  </Button>
                </BlockStack>

                {product.volumePricing.length > 0 && (
                  <BlockStack gap="200">
                    <Text as="h3" variant="headingSm">Volume Discounts Available</Text>
                    <List type="bullet">
                      {product.volumePricing.slice(0, 3).map((vp, index) => (
                        <List.Item key={index}>
                          {vp.minQuantity}+ units: {formatPrice(vp.pricePerUnit)} each
                          {vp.discountPercentage && ` (${vp.discountPercentage}% off)`}
                        </List.Item>
                      ))}
                    </List>
                  </BlockStack>
                )}
              </BlockStack>
            </Card>
          </Grid.Cell>
        </Grid>
      </Page>

      {quoteModal}
    </>
  );
}