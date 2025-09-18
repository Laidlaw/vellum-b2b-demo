import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge, Text, BlockStack, Box, Card, InlineStack } from '@shopify/polaris';
import {
  DataFrameTable,
  type TableColumn,
  type SearchOptions,
  type QuickFiltersOptions,
  type ActiveQuickFilter,
  type PaginationOptions,
  type ExportOptions,
  type BulkAction,
  type DetailModalOptions
} from './DataFrameTable';
import type { Quote, PaginatedResponse } from '../../types';
import { formatCurrency, formatDate, exportData } from '../../utils';

interface EnhancedQuotesTableProps {
  companyId?: string;
}

function QuoteStatusBadge({ status }: { status: string }) {
  const getStatusProps = (status: string) => {
    switch (status) {
      case 'draft':
        return { tone: 'subdued' as const, children: 'Draft' };
      case 'pending':
        return { tone: 'attention' as const, children: 'Pending Approval' };
      case 'approved':
        return { tone: 'success' as const, children: 'Approved' };
      case 'expired':
        return { tone: 'critical' as const, children: 'Expired' };
      case 'rejected':
        return { tone: 'critical' as const, children: 'Rejected' };
      default:
        return { tone: 'subdued' as const, children: status };
    }
  };

  return <Badge {...getStatusProps(status)} />;
}

export function EnhancedQuotesTable({ companyId }: EnhancedQuotesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeQuickFilters, setActiveQuickFilters] = useState<ActiveQuickFilter[]>([]);
  const [selectedQuoteIds, setSelectedQuoteIds] = useState<string[]>([]);

  // Fetch quotes data
  const { data, isLoading, refetch } = useQuery<PaginatedResponse<Quote>>({
    queryKey: ['quotes', { companyId, page: currentPage, limit: pageSize }],
    queryFn: () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });
      if (companyId) params.set('companyId', companyId);
      return fetch(`/api/quotes?${params}`).then(res => res.json());
    }
  });

  const quotes = data?.data || [];

  // Define table columns
  const columns: TableColumn[] = [
    {
      id: 'name',
      title: 'Quote Name',
      sortable: true,
      render: (value, quote) => (
        <BlockStack gap="100">
          <Text as="span" variant="bodyMd" fontWeight="semibold">
            {value as string}
          </Text>
          {(quote as Quote).purchaseOrderNumber && (
            <Text as="span" variant="bodySm" tone="subdued">
              PO: {(quote as Quote).purchaseOrderNumber}
            </Text>
          )}
        </BlockStack>
      )
    },
    {
      id: 'status',
      title: 'Status',
      sortable: true,
      render: (value) => <QuoteStatusBadge status={value as string} />
    },
    {
      id: 'amount',
      title: 'Amount',
      sortable: true,
      alignment: 'right',
      render: (value) => (
        <Text as="span" variant="bodyMd" fontWeight="semibold">
          {formatCurrency(value as number)}
        </Text>
      )
    },
    {
      id: 'dateCreated',
      title: 'Created',
      sortable: true,
      render: (value) => formatDate(value as string)
    },
    {
      id: 'timeUntilExpiration',
      title: 'Expires In',
      sortable: false,
      render: (value, quote) => {
        const expiration = value as string;
        const status = (quote as Quote).status;
        const isExpiringSoon = status === 'pending' && expiration.includes('day') &&
          parseInt(expiration) <= 7;

        return (
          <Text
            as="span"
            tone={isExpiringSoon ? 'critical' : 'subdued'}
            fontWeight={isExpiringSoon ? 'semibold' : 'regular'}
          >
            {expiration}
          </Text>
        );
      }
    },
    {
      id: 'approxDeliveryDate',
      title: 'Delivery Date',
      sortable: true,
      render: (value) => value ? formatDate(value as string) : '—'
    }
  ];

  // Search configuration
  const search: SearchOptions = {
    searchTerm,
    placeholder: 'Search quotes by name, PO number, or reference...',
    onSearch: setSearchTerm,
    onClear: () => setSearchTerm(''),
    enabled: true
  };

  // Quick filters configuration
  const quickFilters: QuickFiltersOptions = {
    filters: [
      {
        id: 'status',
        label: 'Status',
        field: 'status',
        options: [
          { label: 'Draft', value: 'draft' },
          { label: 'Pending Approval', value: 'pending' },
          { label: 'Approved', value: 'approved' },
          { label: 'Expired', value: 'expired' },
          { label: 'Rejected', value: 'rejected' }
        ],
        placeholder: 'All statuses'
      }
    ],
    activeFilters: activeQuickFilters,
    onFiltersChange: setActiveQuickFilters,
    onClearAll: () => setActiveQuickFilters([])
  };

  // Pagination configuration
  const pagination: PaginationOptions = {
    currentPage,
    pageSize,
    totalItems: data?.total || 0,
    onPageChange: setCurrentPage,
    onPageSizeChange: (newPageSize) => {
      setPageSize(newPageSize);
      setCurrentPage(1);
    }
  };

  // Export configuration
  const exportOptions: ExportOptions = {
    formats: ['csv', 'json'],
    filename: 'quotes-export',
    onExport: (format: string, data) => {
      exportData(data, format as 'csv' | 'json', {
        filename: 'quotes-export',
        includeHeaders: true,
        columnMapping: {
          name: 'Quote Name',
          status: 'Status',
          amount: 'Amount ($)',
          dateCreated: 'Date Created',
          timeUntilExpiration: 'Expires In',
          approxDeliveryDate: 'Delivery Date',
          purchaseOrderNumber: 'PO Number'
        },
        excludeColumns: ['id', 'orderRef', 'companyId']
      });
    }
  };

  // Bulk actions
  const bulkActions: BulkAction[] = useMemo(() => {
    if (selectedQuoteIds.length === 0) return [];

    return [
      {
        id: 'approve',
        label: `Approve ${selectedQuoteIds.length} quote${selectedQuoteIds.length === 1 ? '' : 's'}`,
        onAction: async (ids) => {
          for (const quoteId of ids) {
            await fetch(`/api/quotes/${quoteId}/approve`, { method: 'POST' });
          }
          setSelectedQuoteIds([]);
          refetch();
        }
      },
      {
        id: 'export',
        label: 'Export selected',
        onAction: (ids) => {
          const selectedQuotes = quotes.filter(quote => ids.includes(quote.id));
          exportData(selectedQuotes, 'csv', {
            filename: 'selected-quotes',
            includeHeaders: true
          });
        }
      }
    ];
  }, [selectedQuoteIds.length, quotes, refetch]);

  // Detail modal configuration
  const detailModal: DetailModalOptions = {
    enabled: true,
    title: (row) => `Quote Details: ${row.name}`,
    size: 'large',
    content: (row) => {
      const quote = row as Quote;
      return (
        <BlockStack gap="400">
          <Card>
            <BlockStack gap="300">
              <Text as="h3" variant="headingMd">Quote Information</Text>
              <InlineStack gap="600">
                <Box>
                  <Text as="p" variant="bodySm" tone="subdued">Quote Name</Text>
                  <Text as="p" variant="bodyMd" fontWeight="medium">{quote.name}</Text>
                </Box>
                <Box>
                  <Text as="p" variant="bodySm" tone="subdued">Status</Text>
                  <QuoteStatusBadge status={quote.status} />
                </Box>
                <Box>
                  <Text as="p" variant="bodySm" tone="subdued">PO Number</Text>
                  <Text as="p" variant="bodyMd" fontWeight="medium">
                    {quote.purchaseOrderNumber || '—'}
                  </Text>
                </Box>
              </InlineStack>
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="300">
              <Text as="h3" variant="headingMd">Financial Details</Text>
              <InlineStack gap="600">
                <Box>
                  <Text as="p" variant="bodySm" tone="subdued">Total Amount</Text>
                  <Text as="p" variant="headingMd" fontWeight="bold">
                    {formatCurrency(quote.amount)}
                  </Text>
                </Box>
                <Box>
                  <Text as="p" variant="bodySm" tone="subdued">Created Date</Text>
                  <Text as="p" variant="bodyMd" fontWeight="medium">
                    {formatDate(quote.dateCreated)}
                  </Text>
                </Box>
                <Box>
                  <Text as="p" variant="bodySm" tone="subdued">Expiration</Text>
                  <Text as="p" variant="bodyMd" fontWeight="medium">
                    {quote.timeUntilExpiration}
                  </Text>
                </Box>
              </InlineStack>
            </BlockStack>
          </Card>

          {quote.approxDeliveryDate && (
            <Card>
              <BlockStack gap="300">
                <Text as="h3" variant="headingMd">Delivery Information</Text>
                <Box>
                  <Text as="p" variant="bodySm" tone="subdued">Expected Delivery</Text>
                  <Text as="p" variant="bodyMd" fontWeight="medium">
                    {formatDate(quote.approxDeliveryDate)}
                  </Text>
                </Box>
              </BlockStack>
            </Card>
          )}
        </BlockStack>
      );
    },
    primaryAction: (row) => {
      const quote = row as Quote;
      if (quote.status === 'pending') {
        return {
          content: 'Approve Quote',
          onAction: async () => {
            await fetch(`/api/quotes/${quote.id}/approve`, { method: 'POST' });
            refetch();
          }
        };
      }
      return null;
    }
  };

  return (
    <DataFrameTable
      data={quotes}
      columns={columns}
      idField="id"
      search={search}
      quickFilters={quickFilters}
      pagination={pagination}
      exportOptions={exportOptions}
      selectable={true}
      selectedIds={selectedQuoteIds}
      onSelectionChange={setSelectedQuoteIds}
      bulkActions={bulkActions}
      detailModal={detailModal}
      cellClickBehavior="detail"
      loading={isLoading}
      emptyState={{
        title: 'No quotes found',
        description: 'Try adjusting your search or filter criteria'
      }}
    />
  );
}