import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

interface CartActions {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
}

type CartStore = CartState & CartActions;

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => {
    const price = item.discount ? item.product.basePrice * (1 - item.discount) : item.product.basePrice;
    return sum + (price * item.quantity);
  }, 0);

  return { totalItems, totalAmount };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalAmount: 0,

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existingItem = state.items.find(item => item.productId === product.id);

          let newItems: CartItem[];
          if (existingItem) {
            newItems = state.items.map(item =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            newItems = [
              ...state.items,
              {
                productId: product.id,
                product,
                quantity,
              }
            ];
          }

          const { totalItems, totalAmount } = calculateTotals(newItems);
          return { items: newItems, totalItems, totalAmount };
        }),

      removeItem: (productId) =>
        set((state) => {
          const newItems = state.items.filter(item => item.productId !== productId);
          const { totalItems, totalAmount } = calculateTotals(newItems);
          return { items: newItems, totalItems, totalAmount };
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return get().removeItem(productId) as any;
          }

          const newItems = state.items.map(item =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          );

          const { totalItems, totalAmount } = calculateTotals(newItems);
          return { items: newItems, totalItems, totalAmount };
        }),

      clearCart: () =>
        set({ items: [], totalItems: 0, totalAmount: 0 }),

      getItemQuantity: (productId) => {
        const item = get().items.find(item => item.productId === productId);
        return item?.quantity || 0;
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);