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
  Badge,
  EmptyState,
  Filters,
  Modal,
  DataTable,
  ButtonGroup,
  Box
} from '@shopify/polaris';
import { ViewIcon, DuplicateIcon } from '@shopify/polaris-icons';
import { useQuotes, useQuoteBuilder } from '../hooks';
import { formatCurrency, formatDate, getTimeUntilExpiration, isExpired } from '../utils';
import type { Quote } from '../types';

interface CustomerQuotesProps {
  companyId: string;
  onBack?: () => void;
  onCreateQuote?: () => void;
}

export function CustomerQuotes({ companyId, onBack, onCreateQuote }: CustomerQuotesProps) {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const { data, isLoading } = useQuotes(companyId);
  const quotes = data?.data || [];
  const { addToQuote, openQuoteBuilder } = useQuoteBuilder();

  const handleStatusFilterChange = (value: string[]) => {
    setStatusFilter(value);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleClearFilters = () => {
    setStatusFilter([]);
    setSearchValue('');
  };

  const handleViewQuote = (quote: Quote) => {
    setSelectedQuote(quote);
  };

  const handleDuplicateQuote = (quote: Quote) => {
    // Add all items from the quote to the quote builder
    quote.items.forEach(item => {
      addToQuote(item.product, item.quantity);
    });
    openQuoteBuilder();
  };

  const getStatusBadge = (status: Quote['status']) => {
    const statusConfig = {
      draft: { tone: 'info' as const, text: 'Draft' },
      pending: { tone: 'warning' as const, text: 'Pending Approval' },
      approved: { tone: 'success' as const, text: 'Approved' },
      expired: { tone: 'critical' as const, text: 'Expired' },
      rejected: { tone: 'critical' as const, text: 'Rejected' }
    };

    const config = statusConfig[status];
    return <Badge tone={config.tone}>{config.text}</Badge>;
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(quote.status);
    const matchesSearch = searchValue === '' ||
      quote.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      quote.id.toLowerCase().includes(searchValue.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const filterOptions = [
    {
      key: 'status',
      label: 'Status',
      filter: (
        <Filters
          queryValue={searchValue}
          queryPlaceholder="Search quotes..."
          filters={[
            {
              key: 'status',
              label: 'Status',
              filter: (
                <div>Status filter content</div>
              ),
            },
          ]}
          onQueryChange={handleSearchChange}
          onQueryClear={() => handleSearchChange('')}
          onClearAll={handleClearFilters}
        />
      ),
    },
  ];

  const renderQuoteItem = (quote: Quote) => {
    const expired = isExpired(quote.dateExpired);
    const timeRemaining = getTimeUntilExpiration(quote.dateExpired);

    return (
      <ResourceItem
        id={quote.id}
        onClick={() => handleViewQuote(quote)}
      >
        <BlockStack gap="200">
          <InlineStack align="space-between">
            <BlockStack gap="100">
              <InlineStack gap="200" align="center">
                <Text variant="bodyMd" fontWeight="semibold">
                  {quote.name}
                </Text>
                {getStatusBadge(quote.status)}
              </InlineStack>
              <Text variant="bodySm" tone="subdued">
                Quote ID: {quote.id} • Created {formatDate(quote.dateCreated)}
              </Text>
              <Text variant="bodySm">
                {quote.items.length} item{quote.items.length === 1 ? '' : 's'}
              </Text>
            </BlockStack>

            <BlockStack gap="200" align="end">
              <Text variant="headingMd">
                {formatCurrency(quote.amount)}
              </Text>

              <Text
                variant="bodySm"
                tone={expired ? 'critical' : quote.status === 'pending' ? 'warning' : 'subdued'}
              >
                {timeRemaining}
              </Text>

              <ButtonGroup>
                <Button
                  icon={ViewIcon}
                  size="micro"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewQuote(quote);
                  }}
                >
                  View
                </Button>
                <Button
                  icon={DuplicateIcon}
                  size="micro"
                  variant="plain"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicateQuote(quote);
                  }}
                >
                  Duplicate
                </Button>
              </ButtonGroup>
            </BlockStack>
          </InlineStack>
        </BlockStack>
      </ResourceItem>
    );
  };

  if (filteredQuotes.length === 0 && !isLoading) {
    return (
      <Page
        title="My Quotes"
        backAction={onBack ? { content: 'Back', onAction: onBack } : undefined}
        primaryAction={{
          content: 'Create New Quote',
          onAction: onCreateQuote
        }}
      >
        <EmptyState
          heading="No quotes found"
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          action={{
            content: 'Create Your First Quote',
            onAction: onCreateQuote
          }}
        >
          <Text as="p">Start building a quote to get custom pricing for your business needs.</Text>
        </EmptyState>
      </Page>
    );
  }

  return (
    <>
      <Page
        title={`My Quotes (${filteredQuotes.length})`}
        backAction={onBack ? { content: 'Back', onAction: onBack } : undefined}
        primaryAction={{
          content: 'Create New Quote',
          onAction: onCreateQuote
        }}
      >
        <Card>
          <ResourceList
            resourceName={{ singular: 'quote', plural: 'quotes' }}
            items={filteredQuotes}
            renderItem={renderQuoteItem}
            loading={isLoading}
            filterControl={
              <Filters
                queryValue={searchValue}
                queryPlaceholder="Search quotes..."
                filters={[]}
                onQueryChange={handleSearchChange}
                onQueryClear={() => handleSearchChange('')}
                onClearAll={handleClearFilters}
              />
            }
          />
        </Card>
      </Page>

      {selectedQuote && (
        <Modal
          open={!!selectedQuote}
          onClose={() => setSelectedQuote(null)}
          title={`Quote Details - ${selectedQuote.name}`}
          size="large"
          primaryAction={{
            content: 'Duplicate Quote',
            onAction: () => {
              handleDuplicateQuote(selectedQuote);
              setSelectedQuote(null);
            }
          }}
          secondaryActions={[
            {
              content: 'Close',
              onAction: () => setSelectedQuote(null)
            }
          ]}
        >
          <Modal.Section>
            <BlockStack gap="400">
              <InlineStack align="space-between">
                <BlockStack gap="100">
                  <Text variant="headingMd">Quote Information</Text>
                  <Text variant="bodySm">
                    Created: {formatDate(selectedQuote.dateCreated)}
                  </Text>
                  <Text variant="bodySm">
                    Expires: {formatDate(selectedQuote.dateExpired)}
                  </Text>
                  <Text variant="bodySm">
                    Status: {getStatusBadge(selectedQuote.status)}
                  </Text>
                </BlockStack>
                <Text variant="headingLg">
                  {formatCurrency(selectedQuote.amount)}
                </Text>
              </InlineStack>

              <Box>
                <Text variant="headingMd">Items ({selectedQuote.items.length})</Text>
                <Box paddingBlockStart="200">
                  <DataTable
                    columnContentTypes={['text', 'text', 'numeric', 'numeric', 'numeric']}
                    headings={['Product', 'SKU', 'Quantity', 'Unit Price', 'Total']}
                    rows={selectedQuote.items.map(item => [
                      item.product.name,
                      item.product.sku,
                      item.quantity.toString(),
                      formatCurrency(item.unitPrice),
                      formatCurrency(item.totalPrice)
                    ])}
                  />
                </Box>
              </Box>
            </BlockStack>
          </Modal.Section>
        </Modal>
      )}
    </>
  );
}