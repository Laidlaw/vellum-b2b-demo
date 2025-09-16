import { useState } from 'react';
import {
  Page,
  Card,
  ResourceList,
  ResourceItem,
  Text,
  Button,
  InlineStack,
  BlockStack,
  Thumbnail,
  ButtonGroup,
  TextField,
  EmptyState,
  Divider,
  Box,
  FormLayout
} from '@shopify/polaris';
import { DeleteIcon, EditIcon, ContractIcon } from '@shopify/polaris-icons';
import { useCart } from '../hooks';
import { formatCurrency, validateQuantity } from '../utils';
import type { CartItem } from '../types';

interface QuoteBuilderProps {
  onSubmitQuote?: () => void;
  onContinueShopping?: () => void;
}

export function QuoteBuilder({ onSubmitQuote, onContinueShopping }: QuoteBuilderProps) {
  const {
    items,
    totalAmount,
    removeItem,
    updateQuantity,
    clearQuote,
    quoteName,
    purchaseOrderNumber,
    notes,
    updateQuoteMetadata,
    submitQuote
  } = useCart();
  const [editingQuantities, setEditingQuantities] = useState<Record<string, string>>({});

  const handleSubmitQuote = async () => {
    if (onSubmitQuote) {
      await onSubmitQuote();
    } else {
      await submitQuote();
    }
  };

  const handleQuantityEdit = (productId: string, currentQuantity: number) => {
    setEditingQuantities(prev => ({
      ...prev,
      [productId]: currentQuantity.toString()
    }));
  };

  const handleQuantityUpdate = (productId: string) => {
    const newQuantityStr = editingQuantities[productId];
    const validation = validateQuantity(newQuantityStr);

    if (validation.isValid) {
      const newQuantity = parseInt(newQuantityStr, 10);
      updateQuantity(productId, newQuantity);
      setEditingQuantities(prev => {
        const { [productId]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleQuantityCancel = (productId: string) => {
    setEditingQuantities(prev => {
      const { [productId]: removed, ...rest } = prev;
      return rest;
    });
  };

  const renderQuoteItem = (item: CartItem) => {
    const productId = item.productId;
    const isEditing = productId in editingQuantities;
    const totalPrice = (item.discount ?
      item.product.basePrice * (1 - item.discount) :
      item.product.basePrice) * item.quantity;

    return (
      <ResourceItem
        id={productId}
        media={
          <Thumbnail
            source={item.product.imageId}
            alt={item.product.name}
            size="medium"
          />
        }
      >
        <BlockStack gap="200">
          <InlineStack align="space-between">
            <BlockStack gap="100">
              <Text variant="bodyMd" fontWeight="semibold">
                {item.product.name}
              </Text>
              <Text variant="bodySm" tone="subdued">
                {item.product.brand} • SKU: {item.product.sku}
              </Text>
              <Text variant="bodySm">
                {formatCurrency(item.product.basePrice)} each
                {item.discount && (
                  <Text as="span" tone="critical">
                    {' '}({Math.round(item.discount * 100)}% off)
                  </Text>
                )}
              </Text>
            </BlockStack>

            <BlockStack gap="200" align="end">
              <Text variant="headingMd">
                {formatCurrency(totalPrice)}
              </Text>

              <InlineStack gap="200" align="center">
                {isEditing ? (
                  <InlineStack gap="100">
                    <TextField
                      label=""
                      labelHidden
                      type="number"
                      value={editingQuantities[productId]}
                      onChange={(value) => setEditingQuantities(prev => ({
                        ...prev,
                        [productId]: value
                      }))}
                      autoComplete="off"
                      min="1"
                      max="10000"
                      style={{ width: '80px' }}
                    />
                    <ButtonGroup>
                      <Button
                        size="micro"
                        onClick={() => handleQuantityUpdate(productId)}
                      >
                        Save
                      </Button>
                      <Button
                        size="micro"
                        variant="plain"
                        onClick={() => handleQuantityCancel(productId)}
                      >
                        Cancel
                      </Button>
                    </ButtonGroup>
                  </InlineStack>
                ) : (
                  <InlineStack gap="100" align="center">
                    <Text variant="bodyMd">Qty: {item.quantity}</Text>
                    <Button
                      icon={EditIcon}
                      variant="plain"
                      size="micro"
                      onClick={() => handleQuantityEdit(productId, item.quantity)}
                      accessibilityLabel={`Edit quantity for ${item.product.name}`}
                    />
                  </InlineStack>
                )}

                <Button
                  icon={DeleteIcon}
                  variant="plain"
                  tone="critical"
                  size="micro"
                  onClick={() => removeItem(productId)}
                  accessibilityLabel={`Remove ${item.product.name} from quote`}
                />
              </InlineStack>
            </BlockStack>
          </InlineStack>
        </BlockStack>
      </ResourceItem>
    );
  };

  if (items.length === 0) {
    return (
      <Page
        title="Quote Builder"
        backAction={{
          content: 'Continue Shopping',
          onAction: onContinueShopping
        }}
      >
        <EmptyState
          heading="Your quote is empty"
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          action={{
            content: 'Continue Shopping',
            onAction: onContinueShopping
          }}
        >
          <Text as="p">Add products to your quote to see them here.</Text>
        </EmptyState>
      </Page>
    );
  }

  return (
    <Page
      title={`Quote Builder (${items.length} item${items.length === 1 ? '' : 's'})`}
      backAction={{
        content: 'Continue Shopping',
        onAction: onContinueShopping
      }}
      primaryAction={{
        content: 'Submit for Approval',
        onAction: handleSubmitQuote,
        disabled: items.length === 0,
        icon: ContractIcon
      }}
      secondaryActions={[
        {
          content: 'Clear Quote',
          destructive: true,
          onAction: clearQuote,
          disabled: items.length === 0
        }
      ]}
    >
      <BlockStack gap="500">
        <Card>
          <ResourceList
            resourceName={{ singular: 'item', plural: 'items' }}
            items={items}
            renderItem={renderQuoteItem}
          />
        </Card>

        {/* Quote Metadata Form */}
        <Card>
          <BlockStack gap="300">
            <Text variant="headingMd">Quote Details</Text>
            <FormLayout>
              <TextField
                label="Quote Name"
                value={quoteName}
                onChange={(value) => updateQuoteMetadata({ quoteName: value })}
                placeholder="Enter a name for this quote"
              />
              <TextField
                label="Purchase Order Number"
                value={purchaseOrderNumber}
                onChange={(value) => updateQuoteMetadata({ purchaseOrderNumber: value })}
                placeholder="Optional PO number"
              />
              <TextField
                label="Notes"
                value={notes}
                onChange={(value) => updateQuoteMetadata({ notes: value })}
                multiline={3}
                placeholder="Any special requirements or notes..."
              />
            </FormLayout>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="300">
            <Text variant="headingMd">Quote Summary</Text>
            <Divider />

            <InlineStack align="space-between">
              <Text variant="bodyMd">
                Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)
              </Text>
              <Text variant="bodyMd" fontWeight="semibold">
                {formatCurrency(totalAmount)}
              </Text>
            </InlineStack>

            <InlineStack align="space-between">
              <Text variant="bodyMd">Shipping</Text>
              <Text variant="bodyMd">To be calculated</Text>
            </InlineStack>

            <InlineStack align="space-between">
              <Text variant="bodyMd">Tax</Text>
              <Text variant="bodyMd">To be calculated</Text>
            </InlineStack>

            <Divider />

            <InlineStack align="space-between">
              <Text variant="headingMd">Estimated Total</Text>
              <Text variant="headingMd">
                {formatCurrency(totalAmount)}
              </Text>
            </InlineStack>

            <Box paddingBlockStart="400">
              <InlineStack gap="200">
                <Button
                  variant="primary"
                  size="large"
                  icon={ContractIcon}
                  onClick={handleSubmitQuote}
                  disabled={items.length === 0}
                >
                  Submit for Approval
                </Button>
                <Button
                  size="large"
                  onClick={onContinueShopping}
                >
                  Continue Shopping
                </Button>
              </InlineStack>
            </Box>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}