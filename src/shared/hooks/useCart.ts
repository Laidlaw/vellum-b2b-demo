import { useApiMutation } from './useApi';
import { useCartStore } from '../stores/cartStore';
import type { Product, Address } from '../types';

// B2B Quote Builder Hook - Cart is the staging area for quotes
export function useCart() {
  const store = useCartStore();

  const addToQuoteMutation = useApiMutation<{ message: string }, { productId: string; quantity: number }>(
    (variables) => fetch('/api/quote/add-item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(variables),
    }),
    {
      onSuccess: () => {
        // Quote staging is already updated in Zustand store
      },
      onError: (error) => {
        console.error('Failed to add item to quote:', error);
      }
    }
  );

  return {
    // Quote staging state
    items: store.items,
    totalItems: store.totalItems,
    totalAmount: store.totalAmount,
    quoteName: store.quoteName,
    purchaseOrderNumber: store.purchaseOrderNumber,
    notes: store.notes,
    status: store.status,
    requestedDeliveryDate: store.requestedDeliveryDate,
    shippingAddress: store.shippingAddress,
    billingAddress: store.billingAddress,
    salespersonId: store.salespersonId,
    integrationChannel: store.integrationChannel,
    approxDeliveryDate: store.approxDeliveryDate,

    // Quote staging actions
    addItem: (product: Product, quantity = 1) => {
      store.addItem(product, quantity);
      addToQuoteMutation.mutate({ productId: product.id, quantity });
    },
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearQuote: store.clearQuote,
    getItemQuantity: store.getItemQuantity,
    updateQuoteMetadata: store.updateQuoteMetadata,
    setAddresses: store.setAddresses,
    submitQuote: store.submitQuote,

    // Mutation state
    isAdding: addToQuoteMutation.isPending,
    addError: addToQuoteMutation.error?.message,
  };
}