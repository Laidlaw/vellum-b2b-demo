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
  Box
} from '@shopify/polaris';
import { DeleteIcon, EditIcon } from '@shopify/polaris-icons';
import { useCart } from '../hooks';
import { formatCurrency, validateQuantity } from '../utils';
import type { CartItem } from '../types';

interface ShoppingCartProps {
  onCheckout?: () => void;
  onContinueShopping?: () => void;
}

export function ShoppingCart({ onCheckout, onContinueShopping }: ShoppingCartProps) {
  const { items, totalAmount, removeItem, updateQuantity, clearCart } = useCart();
  const [editingQuantities, setEditingQuantities] = useState<Record<string, string>>({});

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

  const renderCartItem = (item: CartItem) => {
    const isEditing = productId in editingQuantities;
    const productId = item.productId;
    const totalPrice = (item.discount ?
      item.product.basePrice * (1 - item.discount) :
      item.product.basePrice) * item.quantity;

    return (
      <ResourceItem
        id={productId}
        media={
          <Thumbnail
            source={item.product.imageUrl}
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
                  accessibilityLabel={`Remove ${item.product.name} from cart`}
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
        title="Shopping Cart"
        backAction={{
          content: 'Continue Shopping',
          onAction: onContinueShopping
        }}
      >
        <EmptyState
          heading="Your cart is empty"
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          action={{
            content: 'Continue Shopping',
            onAction: onContinueShopping
          }}
        >
          <Text as="p">Add products to your cart to see them here.</Text>
        </EmptyState>
      </Page>
    );
  }

  return (
    <Page
      title={`Shopping Cart (${items.length} item${items.length === 1 ? '' : 's'})`}
      backAction={{
        content: 'Continue Shopping',
        onAction: onContinueShopping
      }}
      primaryAction={{
        content: 'Proceed to Checkout',
        onAction: onCheckout,
        disabled: items.length === 0
      }}
      secondaryActions={[
        {
          content: 'Clear Cart',
          destructive: true,
          onAction: clearCart,
          disabled: items.length === 0
        }
      ]}
    >
      <BlockStack gap="500">
        <Card>
          <ResourceList
            resourceName={{ singular: 'item', plural: 'items' }}
            items={items}
            renderItem={renderCartItem}
          />
        </Card>

        <Card>
          <BlockStack gap="300">
            <Text variant="headingMd">Order Summary</Text>
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
              <Text variant="bodyMd">Calculated at checkout</Text>
            </InlineStack>

            <InlineStack align="space-between">
              <Text variant="bodyMd">Tax</Text>
              <Text variant="bodyMd">Calculated at checkout</Text>
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
                  onClick={onCheckout}
                  disabled={items.length === 0}
                >
                  Proceed to Checkout
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