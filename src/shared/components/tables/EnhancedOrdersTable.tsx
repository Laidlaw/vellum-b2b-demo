import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge, InlineStack, Text, BlockStack, Thumbnail } from '@shopify/polaris';
import {
  DataFrameTable,
  type TableColumn,
  type SearchOptions,
  type QuickFiltersOptions,
  type ActiveQuickFilter,
  type PaginationOptions,
  type ExportOptions,
  type BulkAction
} from './DataFrameTable';
import type { Order, PaginatedResponse } from '../../types';
import { formatCurrency, formatDate, exportData } from '../../utils';
import { getLocalProductImage } from '../../utils/localImages';

interface EnhancedOrdersTableProps {
  companyId?: string;
}

function OrderStatusBadge({ status }: { status: Order['status'] }) {
  const statusConfig = {
    confirmed: { tone: 'success' as const, label: 'Confirmed' },
    processing: { tone: 'attention' as const, label: 'Processing' },
    shipped: { tone: 'info' as const, label: 'Shipped' },
    delivered: { tone: 'success' as const, label: 'Delivered' },
    cancelled: { tone: 'critical' as const, label: 'Cancelled' }
  };

  const config = statusConfig[status];
  return <Badge tone={config.tone}>{config.label}</Badge>;
}

function PaymentStatusBadge({ status }: { status: Order['paymentStatus'] }) {
  const statusConfig = {
    paid: { tone: 'success' as const, label: 'Paid' },
    partial: { tone: 'attention' as const, label: 'Partial' },
    due: { tone: 'attention' as const, label: 'Payment Due' },
    overdue: { tone: 'critical' as const, label: 'Overdue' }
  };

  const config = statusConfig[status];
  return <Badge tone={config.tone}>{config.label}</Badge>;
}

export function EnhancedOrdersTable({ companyId }: EnhancedOrdersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeQuickFilters, setActiveQuickFilters] = useState<ActiveQuickFilter[]>([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  // Fetch orders data
  const { data, isLoading, refetch } = useQuery<PaginatedResponse<Order>>({
    queryKey: ['orders', { companyId, page: currentPage, limit: pageSize }],
    queryFn: () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });
      if (companyId) params.set('companyId', companyId);
      return fetch(`/api/orders?${params}`).then(res => res.json());
    }
  });

  const orders = data?.data || [];

  // Define table columns
  const columns: TableColumn[] = [
    {
      id: 'orderNumber',
      title: 'Order',
      sortable: true,
      render: (value, order) => (
        <BlockStack gap="100">
          <Text as="span" variant="bodyMd" fontWeight="semibold">
            #{value as string}
          </Text>
          <Text as="span" variant="bodySm" tone="subdued">
            {formatDate((order as Order).dateCreated)}
          </Text>
        </BlockStack>
      )
    },
    {
      id: 'items',
      title: 'Items',
      sortable: false,
      render: (value, order) => {
        const items = value as Order['items'];
        const firstItem = items[0];
        const moreCount = items.length - 1;

        return (
          <InlineStack gap="300" blockAlign="center">
            <Thumbnail
              source={getLocalProductImage(firstItem.productId)}
              alt={firstItem.name}
              size="small"
            />
            <BlockStack gap="100">
              <Text as="span" variant="bodyMd">
                {firstItem.name}
              </Text>
              {moreCount > 0 && (
                <Text as="span" variant="bodySm" tone="subdued">
                  +{moreCount} more item{moreCount === 1 ? '' : 's'}
                </Text>
              )}
            </BlockStack>
          </InlineStack>
        );
      }
    },
    {
      id: 'status',
      title: 'Order Status',
      sortable: true,
      render: (value) => <OrderStatusBadge status={value as Order['status']} />
    },
    {
      id: 'paymentStatus',
      title: 'Payment',
      sortable: true,
      render: (value) => <PaymentStatusBadge status={value as Order['paymentStatus']} />
    },
    {
      id: 'totalAmount',
      title: 'Total',
      sortable: true,
      alignment: 'right',
      render: (value) => (
        <Text as="span" variant="bodyMd" fontWeight="semibold">
          {formatCurrency(value as number)}
        </Text>
      )
    },
    {
      id: 'customerName',
      title: 'Customer',
      sortable: true,
      render: (value, order) => (
        <BlockStack gap="100">
          <Text as="span" variant="bodyMd">
            {value as string}
          </Text>
          <Text as="span" variant="bodySm" tone="subdued">
            {(order as Order).customerEmail}
          </Text>
        </BlockStack>
      )
    },
    {
      id: 'shippingAddress',
      title: 'Shipping',
      sortable: false,
      render: (value) => {
        const address = value as Order['shippingAddress'];
        return (
          <Text as="span" variant="bodyMd">
            {address.city}, {address.state}
          </Text>
        );
      }
    }
  ];

  // Search configuration
  const search: SearchOptions = {
    searchTerm,
    placeholder: 'Search orders by number, customer, or email...',
    onSearch: setSearchTerm,
    onClear: () => setSearchTerm(''),
    enabled: true
  };

  // Quick filters configuration
  const quickFilters: QuickFiltersOptions = {
    filters: [
      {
        id: 'status',
        label: 'Order Status',
        field: 'status',
        options: [
          { label: 'Confirmed', value: 'confirmed' },
          { label: 'Processing', value: 'processing' },
          { label: 'Shipped', value: 'shipped' },
          { label: 'Delivered', value: 'delivered' },
          { label: 'Cancelled', value: 'cancelled' }
        ],
        placeholder: 'All statuses'
      },
      {
        id: 'paymentStatus',
        label: 'Payment Status',
        field: 'paymentStatus',
        options: [
          { label: 'Paid', value: 'paid' },
          { label: 'Partial', value: 'partial' },
          { label: 'Payment Due', value: 'due' },
          { label: 'Overdue', value: 'overdue' }
        ],
        placeholder: 'All payment statuses'
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
    filename: 'orders-export',
    onExport: (format: string, data) => {
      exportData(data, format as 'csv' | 'json', {
        filename: 'orders-export',
        includeHeaders: true,
        columnMapping: {
          orderNumber: 'Order Number',
          status: 'Order Status',
          paymentStatus: 'Payment Status',
          totalAmount: 'Total Amount ($)',
          customerName: 'Customer Name',
          customerEmail: 'Customer Email',
          dateCreated: 'Date Created'
        },
        excludeColumns: ['id', 'items', 'shippingAddress', 'billingAddress']
      });
    }
  };

  // Bulk actions
  const bulkActions: BulkAction[] = useMemo(() => {
    if (selectedOrderIds.length === 0) return [];

    return [
      {
        id: 'fulfill',
        label: `Mark ${selectedOrderIds.length} order${selectedOrderIds.length === 1 ? '' : 's'} as fulfilled`,
        onAction: async (ids) => {
          for (const orderId of ids) {
            await fetch(`/api/orders/${orderId}/fulfill`, { method: 'POST' });
          }
          setSelectedOrderIds([]);
          refetch();
        }
      },
      {
        id: 'export',
        label: 'Export selected',
        onAction: (ids) => {
          const selectedOrders = orders.filter(order => ids.includes(order.id));
          exportData(selectedOrders, 'csv', {
            filename: 'selected-orders',
            includeHeaders: true
          });
        }
      }
    ];
  }, [selectedOrderIds.length, orders, refetch]);

  const handleRowClick = (id: string, order: Record<string, unknown>) => {
    console.log('Order clicked:', { id, order });
    // TODO: Open order details modal or navigate to order page
  };

  return (
    <DataFrameTable
      data={orders}
      columns={columns}
      idField="id"
      search={search}
      quickFilters={quickFilters}
      pagination={pagination}
      exportOptions={exportOptions}
      selectable={true}
      selectedIds={selectedOrderIds}
      onSelectionChange={setSelectedOrderIds}
      bulkActions={bulkActions}
      onRowClick={handleRowClick}
      loading={isLoading}
      emptyState={{
        title: 'No orders found',
        description: 'Try adjusting your search or filter criteria'
      }}
    />
  );
}