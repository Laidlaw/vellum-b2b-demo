import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuoteItem, Product, Quote } from '../types';

interface QuoteState {
  pendingItems: QuoteItem[];
  submittedQuotes: Quote[];
  isBuilderOpen: boolean;
}

interface QuoteActions {
  addToQuote: (product: Product, quantity?: number) => void;
  removeFromQuote: (productId: string) => void;
  updateQuoteQuantity: (productId: string, quantity: number) => void;
  clearPendingQuote: () => void;
  openQuoteBuilder: () => void;
  closeQuoteBuilder: () => void;
  submitQuote: (quoteData: Partial<Quote>) => Promise<void>;
  getQuoteTotal: () => number;
}

type QuoteStore = QuoteState & QuoteActions;

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set, get) => ({
      pendingItems: [],
      submittedQuotes: [],
      isBuilderOpen: false,

      addToQuote: (product, quantity = 1) =>
        set((state) => {
          const existingItem = state.pendingItems.find(item => item.productId === product.id);

          let newItems: QuoteItem[];
          if (existingItem) {
            newItems = state.pendingItems.map(item =>
              item.productId === product.id
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                    totalPrice: item.unitPrice * (item.quantity + quantity)
                  }
                : item
            );
          } else {
            newItems = [
              ...state.pendingItems,
              {
                productId: product.id,
                product,
                quantity,
                unitPrice: product.basePrice,
                totalPrice: product.basePrice * quantity,
              }
            ];
          }

          return { pendingItems: newItems };
        }),

      removeFromQuote: (productId) =>
        set((state) => ({
          pendingItems: state.pendingItems.filter(item => item.productId !== productId)
        })),

      updateQuoteQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { pendingItems: state.pendingItems.filter(item => item.productId !== productId) };
          }

          const newItems = state.pendingItems.map(item =>
            item.productId === productId
              ? {
                  ...item,
                  quantity,
                  totalPrice: item.unitPrice * quantity
                }
              : item
          );

          return { pendingItems: newItems };
        }),

      clearPendingQuote: () =>
        set({ pendingItems: [] }),

      openQuoteBuilder: () =>
        set({ isBuilderOpen: true }),

      closeQuoteBuilder: () =>
        set({ isBuilderOpen: false }),

      submitQuote: async (quoteData) => {
        const state = get();
        const total = state.getQuoteTotal();

        // Create a mock quote (in real app, this would be an API call)
        const newQuote: Quote = {
          id: `quote-${Date.now()}`,
          name: quoteData.name || `Quote ${new Date().toLocaleDateString()}`,
          dateCreated: new Date(),
          dateExpired: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          amount: total,
          status: 'pending',
          items: state.pendingItems,
          companyId: 'company-1', // Mock company
          salespersonId: 'sales-1', // Mock salesperson
          shippingAddress: {
            id: 'addr-1',
            type: 'shipping',
            firstName: 'John',
            lastName: 'Smith',
            address1: '123 Business St',
            city: 'Business City',
            state: 'BC',
            zipCode: '12345',
            country: 'USA'
          },
          billingAddress: {
            id: 'addr-2',
            type: 'billing',
            firstName: 'John',
            lastName: 'Smith',
            address1: '123 Business St',
            city: 'Business City',
            state: 'BC',
            zipCode: '12345',
            country: 'USA'
          }
        };

        set((state) => ({
          submittedQuotes: [...state.submittedQuotes, newQuote],
          pendingItems: [],
          isBuilderOpen: false,
        }));
      },

      getQuoteTotal: () => {
        const state = get();
        return state.pendingItems.reduce((sum, item) => sum + item.totalPrice, 0);
      },
    }),
    {
      name: 'quote-storage',
      partialize: (state) => ({
        submittedQuotes: state.submittedQuotes,
      }),
    }
  )
);