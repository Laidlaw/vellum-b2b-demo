import { useState, useCallback } from 'react';
import {
  ResourceList,
  ResourceItem,
  Card,
  Text,
  Badge,
  Button,
  ButtonGroup,
  InlineStack,
  BlockStack,
  Filters,
  ChoiceList,
  Modal
} from '@shopify/polaris';
import { useQuery } from '@tanstack/react-query';
import type { Quote, PaginatedResponse } from '../../../shared/types';

interface QuotesTableProps {
  companyId?: string;
}

interface QuoteFilters {
  status: string[];
  queryValue: string;
}

function QuoteStatusBadge({ status }: { status: Quote['status'] }) {
  const statusConfig = {
    draft: { tone: 'info' as const, label: 'Draft' },
    pending: { tone: 'attention' as const, label: 'Pending Approval' },
    approved: { tone: 'success' as const, label: 'Approved' },
    expired: { tone: 'critical' as const, label: 'Expired' },
    rejected: { tone: 'critical' as const, label: 'Rejected' }
  };

  const config = statusConfig[status];
  return <Badge tone={config.tone}>{config.label}</Badge>;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
}

export default function QuotesTable({ companyId }: QuotesTableProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [filters, setFilters] = useState<QuoteFilters>({
    status: [],
    queryValue: ''
  });

  // Fetch quotes data
  const { data: quotesResponse, isLoading, refetch } = useQuery<PaginatedResponse<Quote>>({
    queryKey: ['quotes', companyId, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (companyId) params.append('companyId', companyId);
      if (filters.status.length) params.append('status', filters.status.join(','));
      if (filters.queryValue) params.append('search', filters.queryValue);
      
      const response = await fetch(`/api/quotes?${params.toString()}`);
      return response.json();
    }
  });

  const quotes = quotesResponse?.data || [];

  const handleSelectionChange = useCallback((selection: string[]) => {
    setSelectedItems(selection);
  }, []);

  const handleQuoteClick = useCallback((quote: Quote) => {
    setSelectedQuote(quote);
  }, []);

  const handleApproveQuotes = useCallback(async () => {
    for (const quoteId of selectedItems) {
      await fetch(`/api/quotes/${quoteId}/approve`, { method: 'POST' });
    }
    setSelectedItems([]);
    refetch();
  }, [selectedItems, refetch]);

  const handleFilterChange = useCallback((filters: QuoteFilters) => {
    setFilters(filters);
  }, []);

  const filterControl = (
    <Filters
      queryValue={filters.queryValue}
      onQueryChange={(value) => handleFilterChange({ ...filters, queryValue: value })}
      onQueryClear={() => handleFilterChange({ ...filters, queryValue: '' })}
      onClearAll={() => handleFilterChange({ status: [], queryValue: '' })}
      filters={[
        {
          key: 'status',
          label: 'Status',
          filter: (
            <ChoiceList
              title="Quote Status"
              titleHidden
              choices={[
                { label: 'Draft', value: 'draft' },
                { label: 'Pending Approval', value: 'pending' },
                { label: 'Approved', value: 'approved' },
                { label: 'Expired', value: 'expired' },
                { label: 'Rejected', value: 'rejected' }
              ]}
              selected={filters.status}
              onChange={(value) => handleFilterChange({ ...filters, status: value })}
              allowMultiple
            />
          )
        }
      ]}
    />
  );

  const bulkActions = selectedItems.length > 0 ? [
    {
      content: `Approve ${selectedItems.length} quote${selectedItems.length === 1 ? '' : 's'}`,
      onAction: handleApproveQuotes
    },
    {
      content: 'Export selected',
      onAction: () => console.log('Export', selectedItems)
    }
  ] : undefined;

  const promotedBulkActions = selectedItems.length > 0 ? [
    {
      content: 'Approve selected',
      onAction: handleApproveQuotes
    }
  ] : undefined;

  const renderQuoteItem = (quote: Quote) => {
    const {
      id,
      name,
      dateCreated,
      timeUntilExpiration,
      status,
      amount,
      purchaseOrderNumber,
      approxDeliveryDate,
      orderRef
    } = quote;

    return (
      <ResourceItem
        id={id}
        onClick={() => handleQuoteClick(quote)}
        accessibilityLabel={`View quote ${name}`}
      >
        <InlineStack align="space-between" blockAlign="center">
          <BlockStack gap="100">
            <InlineStack gap="200" blockAlign="center">
              <Text as="h3" variant="bodyMd" fontWeight="semibold">
                {name}
              </Text>
              <QuoteStatusBadge status={status} />
            </InlineStack>
            
            <InlineStack gap="400">
              <Text as="p" variant="bodySm" tone="subdued">
                Quote Date: {formatDate(dateCreated)}
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                Expires: {timeUntilExpiration}
              </Text>
              {purchaseOrderNumber && (
                <Text as="p" variant="bodySm" tone="subdued">
                  PO: {purchaseOrderNumber}
                </Text>
              )}
            </InlineStack>
            
            <InlineStack gap="400">
              <Text as="p" variant="bodySm" tone="subdued">
                Order Ref: {orderRef}
              </Text>
              {approxDeliveryDate && (
                <Text as="p" variant="bodySm" tone="subdued">
                  Delivery: {formatDate(approxDeliveryDate)}
                </Text>
              )}
            </InlineStack>
          </BlockStack>
          
          <BlockStack gap="100" align="end">
            <Text as="p" variant="headingMd" fontWeight="semibold">
              {formatCurrency(amount)}
            </Text>
            <ButtonGroup>
              <Button 
                size="micro" 
                onClick={() => handleQuoteClick(quote)}
              >
                View Details
              </Button>
              {status === 'pending' && (
                <Button 
                  size="micro" 
                  variant="primary"
                  onClick={async () => {
                    await fetch(`/api/quotes/${id}/approve`, { method: 'POST' });
                    refetch();
                  }}
                >
                  Approve
                </Button>
              )}
            </ButtonGroup>
          </BlockStack>
        </InlineStack>
      </ResourceItem>
    );
  };

  return (
    <>
      <Card>
        <ResourceList
          resourceName={{ singular: 'quote', plural: 'quotes' }}
          items={quotes}
          renderItem={renderQuoteItem}
          selectedItems={selectedItems}
          onSelectionChange={handleSelectionChange}
          selectable
          bulkActions={bulkActions}
          promotedBulkActions={promotedBulkActions}
          filterControl={filterControl}
          loading={isLoading}
          emptyState={
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Text as="p" variant="bodyMd">
                No quotes found. Try adjusting your filters.
              </Text>
            </div>
          }
        />
      </Card>

      {selectedQuote && (
        <Modal
          open={!!selectedQuote}
          onClose={() => setSelectedQuote(null)}
          title={selectedQuote.name}
          size="large"
        >
          <Modal.Section>
            <BlockStack gap="400">
              <InlineStack gap="400">
                <div>
                  <Text as="dt" variant="bodyMd" fontWeight="semibold">Status</Text>
                  <QuoteStatusBadge status={selectedQuote.status} />
                </div>
                <div>
                  <Text as="dt" variant="bodyMd" fontWeight="semibold">Amount</Text>
                  <Text as="dd" variant="bodyMd">{formatCurrency(selectedQuote.amount)}</Text>
                </div>
                <div>
                  <Text as="dt" variant="bodyMd" fontWeight="semibold">Order Reference</Text>
                  <Text as="dd" variant="bodyMd">{selectedQuote.orderRef}</Text>
                </div>
              </InlineStack>

              <BlockStack gap="200">
                <Text as="h3" variant="headingMd">Shipping Address</Text>
                <Text as="p" variant="bodyMd">
                  {selectedQuote.shippingAddress.company}<br />
                  {selectedQuote.shippingAddress.firstName} {selectedQuote.shippingAddress.lastName}<br />
                  {selectedQuote.shippingAddress.address1}<br />
                  {selectedQuote.shippingAddress.address2 && (
                    <>{selectedQuote.shippingAddress.address2}<br /></>
                  )}
                  {selectedQuote.shippingAddress.city}, {selectedQuote.shippingAddress.state} {selectedQuote.shippingAddress.zipCode}
                </Text>
              </BlockStack>

              <BlockStack gap="200">
                <Text as="h3" variant="headingMd">Quote Items</Text>
                {selectedQuote.items.map((item, index) => (
                  <InlineStack key={index} align="space-between">
                    <BlockStack gap="100">
                      <Text as="p" variant="bodyMd" fontWeight="semibold">
                        {item.product.name}
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        SKU: {item.product.sku} • Qty: {item.quantity}
                      </Text>
                    </BlockStack>
                    <Text as="p" variant="bodyMd">
                      {formatCurrency(item.totalPrice)}
                    </Text>
                  </InlineStack>
                ))}
              </BlockStack>
            </BlockStack>
          </Modal.Section>
          
          <Modal.Section>
            <InlineStack gap="200">
              {selectedQuote.status === 'pending' && (
                <Button 
                  variant="primary"
                  onClick={async () => {
                    await fetch(`/api/quotes/${selectedQuote.id}/approve`, { method: 'POST' });
                    setSelectedQuote(null);
                    refetch();
                  }}
                >
                  Approve Quote
                </Button>
              )}
              <Button onClick={() => setSelectedQuote(null)}>
                Close
              </Button>
            </InlineStack>
          </Modal.Section>
        </Modal>
      )}
    </>
  );
}