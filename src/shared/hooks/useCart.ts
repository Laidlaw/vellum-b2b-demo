import { useApiMutation } from './useApi';
import { useCartStore } from '../stores/cartStore';
import type { Product } from '../types';

export function useCart() {
  const store = useCartStore();

  const addToCartMutation = useApiMutation<{ message: string }, { productId: string; quantity: number }>(
    (variables) => fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(variables),
    }),
    {
      onSuccess: () => {
        // Cart is already updated in Zustand store
      },
      onError: (error) => {
        console.error('Failed to add item to cart:', error);
      }
    }
  );

  return {
    // Store state
    items: store.items,
    totalItems: store.totalItems,
    totalAmount: store.totalAmount,

    // Store actions
    addItem: (product: Product, quantity = 1) => {
      store.addItem(product, quantity);
      addToCartMutation.mutate({ productId: product.id, quantity });
    },
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    getItemQuantity: store.getItemQuantity,

    // Mutation state
    isAdding: addToCartMutation.isPending,
    addError: addToCartMutation.error?.message,
  };
}