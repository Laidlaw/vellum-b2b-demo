import { useState, useCallback } from 'react';
import {
  ResourceList,
  ResourceItem,
  Card,
  Text,
  Badge,
  Button,
  InlineStack,
  BlockStack,
  Filters,
  ChoiceList,
  Modal,
  Box,
  Divider
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
    pending: { tone: 'attention' as const, label: 'Pending' },
    approved: { tone: 'success' as const, label: 'Approved' },
    expired: { tone: 'critical' as const, label: 'Expired' },
    rejected: { tone: 'critical' as const, label: 'Rejected' }
  };

  const config = statusConfig[status];
  return <Badge tone={config.tone} size="small">{config.label}</Badge>;
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
      queryPlaceholder="Search quotes..."
      onQueryChange={(value) => handleFilterChange({ ...filters, queryValue: value })}
      onQueryClear={() => handleFilterChange({ ...filters, queryValue: '' })}
      onClearAll={() => handleFilterChange({ status: [], queryValue: '' })}
      filters={[
        {
          key: 'status',
          label: 'Status',
          filter: (
            <ChoiceList
              title="Filter by status"
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
          ),
          shortcut: true
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

    const isExpiringSoon = status === 'pending' && timeUntilExpiration.includes('day') && 
      parseInt(timeUntilExpiration) <= 7;

    return (
      <ResourceItem
        id={id}
        onClick={() => handleQuoteClick(quote)}
        accessibilityLabel={`View quote ${name}`}
      >
        <Box padding="400">
          <InlineStack align="space-between" blockAlign="start">
            {/* Left section - Quote details */}
            <BlockStack gap="300">
              <InlineStack gap="300" blockAlign="center">
                <Text as="h3" variant="headingSm" fontWeight="semibold">
                  {name}
                </Text>
                <QuoteStatusBadge status={status} />
                {isExpiringSoon && (
                  <Badge tone="attention">Expires Soon</Badge>
                )}
              </InlineStack>
              
              <BlockStack gap="200">
                <InlineStack gap="400">
                  <Box>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Quote Date:
                    </Text>
                    <Text as="p" variant="bodySm" fontWeight="medium">
                      {formatDate(dateCreated)}
                    </Text>
                  </Box>
                  <Box>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Expires:
                    </Text>
                    <Text as="p" variant="bodySm" fontWeight="medium" tone={isExpiringSoon ? 'critical' : undefined}>
                      {timeUntilExpiration}
                    </Text>
                  </Box>
                  <Box>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Order Ref:
                    </Text>
                    <Text as="p" variant="bodySm" fontWeight="medium">
                      {orderRef}
                    </Text>
                  </Box>
                </InlineStack>
                
                <InlineStack gap="400">
                  {purchaseOrderNumber && (
                    <Box>
                      <Text as="p" variant="bodySm" tone="subdued">
                        PO:
                      </Text>
                      <Text as="p" variant="bodySm" fontWeight="medium">
                        {purchaseOrderNumber}
                      </Text>
                    </Box>
                  )}
                  {approxDeliveryDate && (
                    <Box>
                      <Text as="p" variant="bodySm" tone="subdued">
                        Delivery:
                      </Text>
                      <Text as="p" variant="bodySm" fontWeight="medium">
                        {formatDate(approxDeliveryDate)}
                      </Text>
                    </Box>
                  )}
                </InlineStack>
              </BlockStack>
            </BlockStack>
            
            {/* Right section - Amount and actions */}
            <BlockStack gap="300" align="end">
              <Text as="p" variant="headingLg" fontWeight="bold">
                {formatCurrency(amount)}
              </Text>
              <InlineStack gap="200">
                <Button 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuoteClick(quote);
                  }}
                >
                  View Details
                </Button>
                {status === 'pending' && (
                  <Button 
                    size="small" 
                    variant="primary"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await fetch(`/api/quotes/${id}/approve`, { method: 'POST' });
                      refetch();
                    }}
                  >
                    Approve
                  </Button>
                )}
              </InlineStack>
            </BlockStack>
          </InlineStack>
        </Box>
      </ResourceItem>
    );
  };

  return (
    <div>
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
            <Box padding="800" textAlign="center">
              <BlockStack gap="300">
                <Text as="p" variant="bodyMd" tone="subdued">
                  No quotes found
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Try adjusting your filters or search terms.
                </Text>
              </BlockStack>
            </Box>
          }
        />
      </Card>

      {selectedQuote && (
        <Modal
          open={!!selectedQuote}
          onClose={() => setSelectedQuote(null)}
          title={selectedQuote.name}
          size="large"
          primaryAction={selectedQuote.status === 'pending' ? {
            content: 'Approve Quote',
            onAction: async () => {
              await fetch(`/api/quotes/${selectedQuote.id}/approve`, { method: 'POST' });
              setSelectedQuote(null);
              refetch();
            }
          } : undefined}
          secondaryActions={[
            {
              content: 'Close',
              onAction: () => setSelectedQuote(null)
            }
          ]}
        >
          <Modal.Section>
            {/* Quote Overview */}
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="start">
                  <BlockStack gap="300">
                    <Text as="h2" variant="headingMd">
                      Quote Overview
                    </Text>
                    <InlineStack gap="400">
                      <Box>
                        <Text as="p" variant="bodySm" tone="subdued">
                          Status
                        </Text>
                        <QuoteStatusBadge status={selectedQuote.status} />
                      </Box>
                      <Box>
                        <Text as="p" variant="bodySm" tone="subdued">
                          Quote Date
                        </Text>
                        <Text as="p" variant="bodyMd" fontWeight="medium">
                          {formatDate(selectedQuote.dateCreated)}
                        </Text>
                      </Box>
                      <Box>
                        <Text as="p" variant="bodySm" tone="subdued">
                          Expires
                        </Text>
                        <Text as="p" variant="bodyMd" fontWeight="medium">
                          {selectedQuote.timeUntilExpiration}
                        </Text>
                      </Box>
                    </InlineStack>
                  </BlockStack>
                  <Box>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Total Amount
                    </Text>
                    <Text as="p" variant="headingLg" fontWeight="bold">
                      {formatCurrency(selectedQuote.amount)}
                    </Text>
                  </Box>
                </InlineStack>
              </BlockStack>
            </Card>
          </Modal.Section>

          <Modal.Section>
            {/* Quote Details */}
            <BlockStack gap="400">
              <InlineStack gap="400" align="start">
                {/* Shipping Address */}
                <Box minWidth="50%">
                  <Card>
                    <BlockStack gap="300">
                      <Text as="h3" variant="headingMd">
                        Shipping Address
                      </Text>
                      <BlockStack gap="100">
                        <Text as="p" variant="bodyMd" fontWeight="medium">
                          {selectedQuote.shippingAddress.company}
                        </Text>
                        <Text as="p" variant="bodyMd">
                          {selectedQuote.shippingAddress.firstName} {selectedQuote.shippingAddress.lastName}
                        </Text>
                        <Text as="p" variant="bodyMd">
                          {selectedQuote.shippingAddress.address1}
                        </Text>
                        {selectedQuote.shippingAddress.address2 && (
                          <Text as="p" variant="bodyMd">
                            {selectedQuote.shippingAddress.address2}
                          </Text>
                        )}
                        <Text as="p" variant="bodyMd">
                          {selectedQuote.shippingAddress.city}, {selectedQuote.shippingAddress.state} {selectedQuote.shippingAddress.zipCode}
                        </Text>
                      </BlockStack>
                    </BlockStack>
                  </Card>
                </Box>

                {/* Order Details */}
                <Box minWidth="50%">
                  <Card>
                    <BlockStack gap="300">
                      <Text as="h3" variant="headingMd">
                        Order Details
                      </Text>
                      <BlockStack gap="200">
                        <InlineStack align="space-between">
                          <Text as="p" variant="bodySm" tone="subdued">
                            Order Reference
                          </Text>
                          <Text as="p" variant="bodyMd" fontWeight="medium">
                            {selectedQuote.orderRef}
                          </Text>
                        </InlineStack>
                        {selectedQuote.purchaseOrderNumber && (
                          <InlineStack align="space-between">
                            <Text as="p" variant="bodySm" tone="subdued">
                              Purchase Order
                            </Text>
                            <Text as="p" variant="bodyMd" fontWeight="medium">
                              {selectedQuote.purchaseOrderNumber}
                            </Text>
                          </InlineStack>
                        )}
                        {selectedQuote.approxDeliveryDate && (
                          <InlineStack align="space-between">
                            <Text as="p" variant="bodySm" tone="subdued">
                              Expected Delivery
                            </Text>
                            <Text as="p" variant="bodyMd" fontWeight="medium">
                              {formatDate(selectedQuote.approxDeliveryDate)}
                            </Text>
                          </InlineStack>
                        )}
                      </BlockStack>
                    </BlockStack>
                  </Card>
                </Box>
              </InlineStack>
            </BlockStack>
          </Modal.Section>

          <Modal.Section>
            {/* Quote Items */}
            <Card>
              <BlockStack gap="400">
                <Text as="h3" variant="headingMd">
                  Quote Items ({selectedQuote.items.length} items)
                </Text>
                <BlockStack gap="300">
                  {selectedQuote.items.map((item, index) => (
                    <Box key={index}>
                      <InlineStack align="space-between" blockAlign="start">
                        <BlockStack gap="200">
                          <Text as="p" variant="bodyMd" fontWeight="semibold">
                            {item.product.name}
                          </Text>
                          <InlineStack gap="300">
                            <Text as="p" variant="bodySm" tone="subdued">
                              SKU: {item.product.sku}
                            </Text>
                            <Text as="p" variant="bodySm" tone="subdued">
                              Quantity: {item.quantity}
                            </Text>
                            <Text as="p" variant="bodySm" tone="subdued">
                              Unit Price: {formatCurrency(item.totalPrice / item.quantity)}
                            </Text>
                          </InlineStack>
                        </BlockStack>
                        <Text as="p" variant="bodyLg" fontWeight="semibold">
                          {formatCurrency(item.totalPrice)}
                        </Text>
                      </InlineStack>
                      {index < selectedQuote.items.length - 1 && (
                        <Box paddingBlockStart="300">
                          <Divider />
                        </Box>
                      )}
                    </Box>
                  ))}
                  
                  <Box paddingBlockStart="400">
                    <Divider />
                    <Box paddingBlockStart="300">
                      <InlineStack align="space-between">
                        <Text as="p" variant="bodyLg" fontWeight="semibold">
                          Total
                        </Text>
                        <Text as="p" variant="headingMd" fontWeight="bold">
                          {formatCurrency(selectedQuote.amount)}
                        </Text>
                      </InlineStack>
                    </Box>
                  </Box>
                </BlockStack>
              </BlockStack>
            </Card>
          </Modal.Section>
        </Modal>
      )}
    </div>
  );
}