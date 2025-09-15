import { useApi, usePaginatedApi, useApiMutation } from './useApi';
import { useQuoteStore } from '../stores/quoteStore';
import type { Quote, Product } from '../types';

export function useQuotes(
  companyId?: string,
  status?: string,
  page = 1,
  limit = 10
) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (companyId) queryParams.set('companyId', companyId);
  if (status) queryParams.set('status', status);

  return usePaginatedApi<Quote>(
    ['quotes', { companyId, status, page, limit }],
    () => fetch(`/api/quotes?${queryParams}`)
  );
}

export function useQuote(quoteId: string, enabled = true) {
  return useApi<Quote>(
    ['quote', quoteId],
    () => fetch(`/api/quotes/${quoteId}`),
    { enabled: enabled && !!quoteId }
  );
}

export function useQuoteBuilder() {
  const store = useQuoteStore();

  const submitQuoteMutation = useApiMutation<Quote, Partial<Quote>>(
    (quoteData) => fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...quoteData,
        items: store.pendingItems,
        amount: store.getQuoteTotal(),
      }),
    }),
    {
      onSuccess: () => {
        // Quote submission handled in store
      },
      invalidateQueries: [['quotes']],
    }
  );

  return {
    // Store state
    pendingItems: store.pendingItems,
    submittedQuotes: store.submittedQuotes,
    isBuilderOpen: store.isBuilderOpen,

    // Store actions
    addToQuote: (product: Product, quantity = 1) => {
      store.addToQuote(product, quantity);
    },
    removeFromQuote: store.removeFromQuote,
    updateQuoteQuantity: store.updateQuoteQuantity,
    clearPendingQuote: store.clearPendingQuote,
    openQuoteBuilder: store.openQuoteBuilder,
    closeQuoteBuilder: store.closeQuoteBuilder,
    getQuoteTotal: store.getQuoteTotal,

    // API actions
    submitQuote: async (quoteData: Partial<Quote>) => {
      try {
        await store.submitQuote(quoteData);
        submitQuoteMutation.mutate(quoteData);
      } catch (error) {
        console.error('Failed to submit quote:', error);
        throw error;
      }
    },

    // Mutation state
    isSubmitting: submitQuoteMutation.isPending,
    submitError: submitQuoteMutation.error?.message,
  };
}