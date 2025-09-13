import {
  Modal,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Button,
  TextField,
  DataTable,
  Badge,
  FormLayout,
  ButtonGroup,
  Thumbnail
} from '@shopify/polaris';
import { DeleteIcon, EditIcon } from '@shopify/polaris-icons';
import { useState } from 'react';
import type { QuoteItem } from '../types';

interface QuoteBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitQuote: (items: QuoteItem[], notes: string) => void;
  initialItems?: QuoteItem[];
}

interface QuoteBuilderState {
  items: QuoteItem[];
  notes: string;
  quoteName: string;
}

export function QuoteBuilder({
  isOpen,
  onClose,
  onSubmitQuote,
  initialItems = []
}: QuoteBuilderProps) {
  const [state, setState] = useState<QuoteBuilderState>({
    items: initialItems,
    notes: '',
    quoteName: ''
  });
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const calculateItemTotal = (item: QuoteItem) => {
    const baseTotal = item.quantity * item.unitPrice;
    const discount = item.discount || 0;
    return baseTotal * (1 - discount);
  };

  const calculateQuoteTotal = () => {
    return state.items.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    setState(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.productId === itemId 
          ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.unitPrice }
          : item
      )
    }));
  };

  const removeItem = (itemId: string) => {
    setState(prev => ({
      ...prev,
      items: prev.items.filter(item => item.productId !== itemId)
    }));
  };

  const handleEditQuantity = (itemId: string, currentQuantity: number) => {
    setEditingItem(itemId);
    setEditQuantity(currentQuantity.toString());
  };

  const saveEditQuantity = () => {
    if (editingItem && editQuantity) {
      updateItemQuantity(editingItem, parseInt(editQuantity));
      setEditingItem(null);
      setEditQuantity('');
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditQuantity('');
  };

  const handleSubmit = () => {
    onSubmitQuote(state.items, state.notes);
    onClose();
    // Reset state
    setState({
      items: [],
      notes: '',
      quoteName: ''
    });
  };

  const quoteTableRows = state.items.map((item) => {
    const isEditing = editingItem === item.productId;
    
    return [
      // Product info with image
      <InlineStack gap="300" blockAlign="center">
        <Thumbnail
          source={item.product.imageUrl}
          alt={item.product.name}
          size="small"
        />
        <BlockStack gap="100">
          <Text as="span" variant="bodyMd" fontWeight="semibold">
            {item.product.name}
          </Text>
          <Text as="span" variant="bodySm" tone="subdued">
            {item.product.brand} • SKU: {item.product.sku}
          </Text>
        </BlockStack>
      </InlineStack>,
      
      // Quantity with edit functionality
      isEditing ? (
        <InlineStack gap="100">
          <TextField
            value={editQuantity}
            onChange={setEditQuantity}
            type="number"
            min="1"
            autoComplete="off"
            label=""
            labelHidden
          />
          <ButtonGroup>
            <Button size="slim" onClick={saveEditQuantity}>Save</Button>
            <Button size="slim" variant="secondary" onClick={cancelEdit}>Cancel</Button>
          </ButtonGroup>
        </InlineStack>
      ) : (
        <InlineStack gap="100" blockAlign="center">
          <Text as="span">{item.quantity}</Text>
          <Button
            size="slim"
            variant="plain"
            icon={EditIcon}
            onClick={() => handleEditQuantity(item.productId, item.quantity)}
            accessibilityLabel="Edit quantity"
          />
        </InlineStack>
      ),
      
      // Unit price
      formatPrice(item.unitPrice),
      
      // Discount
      item.discount ? (
        <Badge tone="success">{Math.round(item.discount * 100)}% off</Badge>
      ) : (
        '-'
      ),
      
      // Total
      formatPrice(calculateItemTotal(item)),
      
      // Actions
      <Button
        size="slim"
        variant="plain"
        icon={DeleteIcon}
        tone="critical"
        onClick={() => removeItem(item.productId)}
        accessibilityLabel="Remove item"
      />
    ];
  });

  return (
    <Modal
      large
      open={isOpen}
      onClose={onClose}
      title="Request Quote"
      primaryAction={{
        content: 'Submit Quote Request',
        onAction: handleSubmit,
        disabled: state.items.length === 0
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: onClose
        }
      ]}
    >
      <Modal.Section>
        <BlockStack gap="400">
          {/* Quote Summary */}
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">Quote Summary</Text>
              
              <InlineStack align="space-between" blockAlign="baseline">
                <Text as="p" variant="bodyLg">
                  {state.items.length} item{state.items.length !== 1 ? 's' : ''}
                </Text>
                <Text as="p" variant="headingLg">
                  Total: {formatPrice(calculateQuoteTotal())}
                </Text>
              </InlineStack>
            </BlockStack>
          </Card>

          {/* Quote Items Table */}
          {state.items.length > 0 ? (
            <Card>
              <BlockStack gap="300">
                <Text as="h3" variant="headingSm">Items</Text>
                <DataTable
                  columnContentTypes={['text', 'text', 'numeric', 'text', 'numeric', 'text']}
                  headings={['Product', 'Quantity', 'Unit Price', 'Discount', 'Total', 'Actions']}
                  rows={quoteTableRows}
                />
              </BlockStack>
            </Card>
          ) : (
            <Card>
              <BlockStack gap="200" inlineAlign="center">
                <Text as="p" tone="subdued">No items in quote yet.</Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Add products to your quote by clicking "Add to Quote" on product pages.
                </Text>
              </BlockStack>
            </Card>
          )}

          {/* Quote Details Form */}
          <Card>
            <FormLayout>
              <Text as="h3" variant="headingSm">Quote Details</Text>
              
              <TextField
                label="Quote name (optional)"
                value={state.quoteName}
                onChange={(value) => setState(prev => ({ ...prev, quoteName: value }))}
                placeholder="e.g., Q4 Safety Equipment Purchase"
                helpText="Give your quote a memorable name for easy reference"
                autoComplete="off"
              />
              
              <TextField
                label="Additional notes"
                value={state.notes}
                onChange={(value) => setState(prev => ({ ...prev, notes: value }))}
                multiline={4}
                placeholder="Add any special requirements, delivery instructions, or questions..."
                helpText="Include any specific requirements or questions about these products"
                autoComplete="off"
              />
            </FormLayout>
          </Card>

          {/* Quote Information */}
          <Card tone="subdued">
            <BlockStack gap="200">
              <Text as="h3" variant="headingSm">What happens next?</Text>
              <BlockStack gap="100">
                <Text as="p" variant="bodySm">
                  • Your quote request will be reviewed by our sales team
                </Text>
                <Text as="p" variant="bodySm">
                  • You'll receive a detailed quote within 1-2 business days
                </Text>
                <Text as="p" variant="bodySm">
                  • The quote will include final pricing, delivery options, and terms
                </Text>
                <Text as="p" variant="bodySm">
                  • You can track quote status in your "My Quotes" section
                </Text>
              </BlockStack>
            </BlockStack>
          </Card>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}