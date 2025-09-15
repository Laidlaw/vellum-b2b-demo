import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, Quote, Address } from '../types';

// B2B Quote Builder State - Cart is the staging area for quotes
interface QuoteBuilderState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  quoteName: string;
  purchaseOrderNumber: string;
  notes: string;
  requestedDeliveryDate?: Date;
  shippingAddress?: Address;
  billingAddress?: Address;
  status: 'draft' | 'submitting' | 'submitted';
  // Additional B2B metadata from wireframes
  salespersonId?: string;
  integrationChannel?: 'salesforce' | 'hubspot' | 'manual';
  approxDeliveryDate?: Date;
}

interface QuoteBuilderActions {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearQuote: () => void;
  getItemQuantity: (productId: string) => number;
  updateQuoteMetadata: (metadata: Partial<Pick<QuoteBuilderState, 'quoteName' | 'purchaseOrderNumber' | 'notes' | 'requestedDeliveryDate' | 'salespersonId' | 'integrationChannel' | 'approxDeliveryDate'>>) => void;
  setAddresses: (shipping?: Address, billing?: Address) => void;
  submitQuote: () => Promise<Quote>;
}

type QuoteBuilderStore = QuoteBuilderState & QuoteBuilderActions;

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => {
    const price = item.discount ? item.product.basePrice * (1 - item.discount) : item.product.basePrice;
    return sum + (price * item.quantity);
  }, 0);

  return { totalItems, totalAmount };
};

export const useCartStore = create<QuoteBuilderStore>()(
  persist(
    (set, get) => ({
      // Quote staging state
      items: [],
      totalItems: 0,
      totalAmount: 0,
      quoteName: '',
      purchaseOrderNumber: '',
      notes: '',
      status: 'draft',

      // B2B quote actions
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

      clearQuote: () =>
        set({
          items: [],
          totalItems: 0,
          totalAmount: 0,
          quoteName: '',
          purchaseOrderNumber: '',
          notes: '',
          status: 'draft',
          requestedDeliveryDate: undefined,
          shippingAddress: undefined,
          billingAddress: undefined,
          salespersonId: undefined,
          integrationChannel: undefined,
          approxDeliveryDate: undefined
        }),

      getItemQuantity: (productId) => {
        const item = get().items.find(item => item.productId === productId);
        return item?.quantity || 0;
      },

      updateQuoteMetadata: (metadata) =>
        set((state) => ({ ...state, ...metadata })),

      setAddresses: (shipping, billing) =>
        set((state) => ({
          ...state,
          shippingAddress: shipping,
          billingAddress: billing
        })),

      submitQuote: async () => {
        set({ status: 'submitting' });

        // Mock API call to submit quote
        const quote: Quote = {
          id: `quote-${Date.now()}`,
          name: get().quoteName || `Quote ${new Date().toLocaleDateString()}`,
          dateCreated: new Date(),
          dateExpired: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          amount: get().totalAmount,
          purchaseOrderNumber: get().purchaseOrderNumber,
          status: 'pending',
          items: get().items.map(item => ({
            productId: item.productId,
            product: item.product,
            quantity: item.quantity,
            unitPrice: item.product.basePrice,
            discount: item.discount,
            totalPrice: item.product.basePrice * item.quantity
          })),
          companyId: 'company-1', // Mock company ID
          salespersonId: get().salespersonId || 'salesperson-1',
          integrationChannel: get().integrationChannel || 'manual',
          approxDeliveryDate: get().approxDeliveryDate,
          shippingAddress: get().shippingAddress!,
          billingAddress: get().billingAddress!,
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        set({ status: 'submitted' });
        return quote;
      },
    }),
    {
      name: 'quote-builder-storage',
    }
  )
);