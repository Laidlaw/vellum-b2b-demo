import { useState, useCallback, useMemo } from 'react';
import { Badge, Text, InlineStack, Modal, Card, Box } from '@shopify/polaris';
import { useQuery } from '@tanstack/react-query';
import { DataFrameTable } from './DataFrameTable';
import type { TableColumn, TableFilter, TableMetric, BulkAction } from './DataFrameTable';
import type { Quote, PaginatedResponse } from '../../types';
import { formatCurrency, formatDate } from '../../utils';

interface QuotesDataTableProps {
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

function ContactCell({ quote }: { quote: Quote }) {
  return (
    <InlineStack gap="200" align="start">
      <Text variant="bodyMd">{quote.salespersonId}</Text>
    </InlineStack>
  );
}

export default function QuotesDataTable({ companyId }: QuotesDataTableProps) {
  const [selectedQuoteIds, setSelectedQuoteIds] = useState<string[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filters, setFilters] = useState<QuoteFilters>({
    status: [],
    queryValue: ''
  });

  // Fetch quotes data
  const { data: quotesResponse, isLoading, refetch } = useQuery<PaginatedResponse<Quote>>({
    queryKey: ['quotes', companyId, filters, activeFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (companyId) params.append('companyId', companyId);

      // Apply filter-based status filtering
      let statusFilter: string[] = [];
      switch (activeFilter) {
        case 'pending':
          statusFilter = ['pending'];
          break;
        case 'approved':
          statusFilter = ['approved'];
          break;
        case 'expired':
          statusFilter = ['expired'];
          break;
        case 'has-po':
          // This will be handled on backend to filter quotes with PO numbers
          params.append('hasPurchaseOrder', 'true');
          break;
        case 'missing-po':
          params.append('hasPurchaseOrder', 'false');
          break;
        case 'high-priority':
          params.append('priority', 'high');
          break;
        default:
          statusFilter = filters.status;
      }

      if (statusFilter.length) params.append('status', statusFilter.join(','));
      if (filters.queryValue) params.append('search', filters.queryValue);

      const response = await fetch(`/api/quotes?${params.toString()}`);
      return response.json();
    }
  });

  const quotes = quotesResponse?.data || [];

  // Table columns configuration
  const columns: TableColumn[] = useMemo(() => [
    {
      id: 'dateCreated',
      title: 'Quote Date',
      sortable: true,
      render: (value: Date) => formatDate(value)
    },
    {
      id: 'name',
      title: 'Quote Name',
      sortable: true,
      render: (value: string) => (
        <Text variant="bodyMd" fontWeight="semibold">{value}</Text>
      )
    },
    {
      id: 'dateExpired',
      title: 'Valid Till',
      sortable: true,
      render: (value: Date) => formatDate(value)
    },
    {
      id: 'status',
      title: 'Approval Status',
      render: (value: Quote['status']) => <QuoteStatusBadge status={value} />
    },
    {
      id: 'purchaseOrderNumber',
      title: 'PO Number',
      render: (value: string | undefined) => value || '—'
    },
    {
      id: 'amount',
      title: 'Estimated Value',
      sortable: true,
      alignment: 'right' as const,
      render: (value: number) => formatCurrency(value)
    },
    {
      id: 'approxDeliveryDate',
      title: 'Delivery Date',
      sortable: true,
      render: (value: Date | undefined) => value ? formatDate(value) : '—'
    },
    {
      id: 'orderRef',
      title: 'Order Ref',
      render: (value: string | undefined) => value || '—'
    },
    {
      id: 'contact',
      title: 'Contact',
      render: (_value: unknown, quote: Quote) => <ContactCell quote={quote} />
    }
  ], []);

  // Filter tabs configuration
  const filterTabs: TableFilter[] = useMemo(() => {
    const statusCounts = quotes.reduce((acc, quote) => {
      acc[quote.status] = (acc[quote.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const hasPOCount = quotes.filter(q => q.purchaseOrderNumber).length;
    const missingPOCount = quotes.filter(q => !q.purchaseOrderNumber).length;

    return [
      { id: 'all', label: 'All', count: quotes.length },
      { id: 'pending', label: 'Pending Approval', count: statusCounts.pending || 0, badge: true },
      { id: 'approved', label: 'Approved', count: statusCounts.approved || 0 },
      { id: 'expired', label: 'Expired', count: statusCounts.expired || 0 },
      { id: 'has-po', label: 'Has PO', count: hasPOCount },
      { id: 'missing-po', label: 'Missing PO', count: missingPOCount, badge: true },
      { id: 'high-priority', label: 'High Priority', count: 0 }
    ];
  }, [quotes]);

  // Metrics configuration
  const metrics: TableMetric[] = useMemo(() => {
    const pendingValue = quotes
      .filter(q => q.status === 'pending')
      .reduce((sum, quote) => sum + quote.amount, 0);
    const approvedValue = quotes
      .filter(q => q.status === 'approved')
      .reduce((sum, quote) => sum + quote.amount, 0);

    return [
      {
        id: 'total-quotes',
        title: 'Total Quotes',
        value: quotes.length,
        subtitle: 'All time'
      },
      {
        id: 'pending-approval',
        title: 'Pending Approval',
        value: quotes.filter(q => q.status === 'pending').length,
        subtitle: formatCurrency(pendingValue)
      },
      {
        id: 'approved-value',
        title: 'Approved Value',
        value: formatCurrency(approvedValue),
        subtitle: `${quotes.filter(q => q.status === 'approved').length} quotes`
      },
      {
        id: 'missing-po',
        title: 'Missing PO',
        value: quotes.filter(q => !q.purchaseOrderNumber).length,
        subtitle: 'Requires action'
      }
    ];
  }, [quotes]);

  // Bulk actions configuration
  const bulkActions: BulkAction[] = [
    {
      id: 'approve',
      label: 'Approve Selected',
      onAction: handleApproveQuotes
    },
    {
      id: 'reject',
      label: 'Reject Selected',
      destructive: true,
      onAction: handleRejectQuotes
    },
    {
      id: 'export',
      label: 'Export Selected',
      onAction: handleExportQuotes
    }
  ];

  // Action handlers
  async function handleApproveQuotes(selectedIds: string[]) {
    for (const quoteId of selectedIds) {
      await fetch(`/api/quotes/${quoteId}/approve`, { method: 'POST' });
    }
    setSelectedQuoteIds([]);
    refetch();
  }

  async function handleRejectQuotes(selectedIds: string[]) {
    for (const quoteId of selectedIds) {
      await fetch(`/api/quotes/${quoteId}/reject`, { method: 'POST' });
    }
    setSelectedQuoteIds([]);
    refetch();
  }

  function handleExportQuotes(selectedIds: string[]) {
    const selectedQuotes = quotes.filter(q => selectedIds.includes(q.id));
    console.log('Exporting quotes:', selectedQuotes);
    // TODO: Implement CSV/PDF export
  }

  const handleRowClick = useCallback((id: string, quote: Quote) => {
    setSelectedQuote(quote);
  }, []);

  const handleQuoteModalClose = useCallback(() => {
    setSelectedQuote(null);
  }, []);

  // Debug render
  if (isLoading) {
    return (
      <Card>
        <Box padding="400">
          <Text variant="bodyMd">Loading quotes...</Text>
        </Box>
      </Card>
    );
  }

  if (!quotes || quotes.length === 0) {
    return (
      <Card>
        <Box padding="400">
          <Text variant="bodyMd">No quotes found. Data: {JSON.stringify(quotesResponse)}</Text>
        </Box>
      </Card>
    );
  }

  return (
    <>
      <DataFrameTable
        data={quotes}
        columns={columns}
        idField="id"
        loading={isLoading}
        // Filtering
        filters={filterTabs}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        // Metrics
        metrics={metrics}
        // Selection
        selectable={true}
        selectedIds={selectedQuoteIds}
        onSelectionChange={setSelectedQuoteIds}
        bulkActions={bulkActions}
        // Row interaction
        onRowClick={handleRowClick}
        // Empty state
        emptyState={{
          title: 'No quotes found',
          description: 'There are no quotes matching your current filters.',
          action: {
            label: 'Clear filters',
            onAction: () => {
              setActiveFilter('all');
              setFilters({ status: [], queryValue: '' });
            }
          }
        }}
      />

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <Modal
          open={true}
          onClose={handleQuoteModalClose}
          title={`Quote: ${selectedQuote.name}`}
          primaryAction={{
            content: 'Close',
            onAction: handleQuoteModalClose
          }}
          large
        >
          <Modal.Section>
            <InlineStack gap="400" align="start">
              <div>
                <Text variant="headingSm">Status</Text>
                <QuoteStatusBadge status={selectedQuote.status} />
              </div>
              <div>
                <Text variant="headingSm">Value</Text>
                <Text variant="bodyLg">{formatCurrency(selectedQuote.amount)}</Text>
              </div>
              <div>
                <Text variant="headingSm">Valid Until</Text>
                <Text variant="bodyLg">{formatDate(selectedQuote.dateExpired)}</Text>
              </div>
              {selectedQuote.purchaseOrderNumber && (
                <div>
                  <Text variant="headingSm">PO Number</Text>
                  <Text variant="bodyLg">{selectedQuote.purchaseOrderNumber}</Text>
                </div>
              )}
            </InlineStack>
          </Modal.Section>
        </Modal>
      )}
    </>
  );
}