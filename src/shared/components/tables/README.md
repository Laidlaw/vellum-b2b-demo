# Enhanced Table System Implementation Guide

## Overview

The Enhanced Table System provides enterprise-grade table functionality with minimal code. All tables in the application should use the `DataFrameTable` component to ensure consistency, performance, and maintainability.

## Quick Start

```tsx
import { DataFrameTable, type TableColumn } from '../../../shared/components/tables';

const columns: TableColumn[] = [
  {
    id: 'name',
    title: 'Name',
    sortable: true,
    render: (value) => <strong>{value as string}</strong>
  },
  {
    id: 'status',
    title: 'Status',
    sortable: true,
    render: (value) => <Badge>{value as string}</Badge>
  }
];

<DataFrameTable
  data={data}
  columns={columns}
  idField="id"
  search={{ placeholder: "Search..." }}
/>
```

## Core Features

### ✅ Built-in Capabilities
- **Automatic Sorting**: Click column headers to sort (no external state needed)
- **Real-time Search**: Debounced text search across all fields
- **Smart Pagination**: Configurable page sizes with proper navigation
- **Column Management**: Show/hide columns with visibility controls
- **Real Export**: Download actual CSV/JSON files
- **Quick Filters**: Dropdown filters for specific fields
- **Bulk Actions**: Multi-select operations with custom actions
- **Loading States**: Built-in loading and empty state handling

## Column Configuration

### Basic Column
```tsx
{
  id: 'productName',
  title: 'Product Name',
  sortable: true,
  alignment: 'left' // 'left' | 'center' | 'right'
}
```

### Custom Rendered Column
```tsx
{
  id: 'status',
  title: 'Status',
  sortable: true,
  render: (value, row) => {
    const status = value as string;
    return (
      <Badge tone={status === 'active' ? 'success' : 'critical'}>
        {status}
      </Badge>
    );
  }
}
```

### Complex Column with Multiple Values
```tsx
{
  id: 'customer',
  title: 'Customer',
  sortable: true,
  render: (value, row) => (
    <BlockStack gap="100">
      <Text variant="bodyMd" fontWeight="semibold">
        {(row as Order).customerName}
      </Text>
      <Text variant="bodySm" tone="subdued">
        {(row as Order).customerEmail}
      </Text>
    </BlockStack>
  )
}
```

## Search Configuration

### Basic Search
```tsx
const search: SearchOptions = {
  placeholder: 'Search products...',
  enabled: true // default: true
};
```

### Advanced Search
```tsx
const search: SearchOptions = {
  searchTerm: searchState, // controlled
  placeholder: 'Search by name, SKU, or vendor...',
  searchFields: ['name', 'sku', 'vendor'], // limit search to specific fields
  onSearch: setSearchState,
  onClear: () => setSearchState(''),
  enabled: true
};
```

## Quick Filters (Dropdown Filters)

```tsx
const quickFilters: QuickFiltersOptions = {
  filters: [
    {
      id: 'category',
      label: 'Category',
      field: 'category',
      options: [], // auto-generated from data if empty
      placeholder: 'All categories'
    },
    {
      id: 'status',
      label: 'Status',
      field: 'status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ],
      placeholder: 'All statuses'
    }
  ],
  activeFilters: activeFilters,
  onFiltersChange: setActiveFilters,
  onClearAll: () => setActiveFilters([])
};
```

## Pagination Setup

```tsx
const pagination: PaginationOptions = {
  currentPage: page,
  pageSize: size,
  totalItems: data?.total || 0,
  pageSizeOptions: [10, 25, 50, 100], // optional
  onPageChange: setPage,
  onPageSizeChange: (newSize) => {
    setSize(newSize);
    setPage(1); // reset to first page
  }
};
```

## Export Configuration

```tsx
const exportOptions: ExportOptions = {
  formats: ['csv', 'json'], // 'csv' | 'json'
  filename: 'products-export',
  onExport: (format, data) => {
    exportData(data, format as 'csv' | 'json', {
      filename: 'products-export',
      includeHeaders: true,
      columnMapping: {
        id: 'Product ID',
        name: 'Product Name',
        price: 'Price ($)'
      },
      excludeColumns: ['internalId', 'metadata']
    });
  }
};
```

## Bulk Actions

```tsx
const bulkActions: BulkAction[] = [
  {
    id: 'archive',
    label: `Archive ${selectedIds.length} item${selectedIds.length === 1 ? '' : 's'}`,
    destructive: true,
    onAction: async (ids) => {
      await archiveItems(ids);
      setSelectedIds([]);
      refetch();
    }
  },
  {
    id: 'export',
    label: 'Export selected',
    onAction: (ids) => {
      const selectedItems = data.filter(item => ids.includes(item.id));
      exportData(selectedItems, 'csv');
    }
  }
];
```

## Complete Example: Enhanced Orders Table

```tsx
import { useState, useMemo } from 'react';
import { Badge, Text, BlockStack } from '@shopify/polaris';
import {
  DataFrameTable,
  type TableColumn,
  type SearchOptions,
  type QuickFiltersOptions,
  type PaginationOptions,
  type ExportOptions,
  type BulkAction
} from './DataFrameTable';

export function OrdersTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch data
  const { data, isLoading } = useQuery(['orders', currentPage, pageSize]);

  // Column definitions
  const columns: TableColumn[] = [
    {
      id: 'orderNumber',
      title: 'Order',
      sortable: true,
      render: (value, order) => (
        <BlockStack gap="100">
          <Text variant="bodyMd" fontWeight="semibold">
            #{value}
          </Text>
          <Text variant="bodySm" tone="subdued">
            {formatDate(order.dateCreated)}
          </Text>
        </BlockStack>
      )
    },
    {
      id: 'status',
      title: 'Status',
      sortable: true,
      render: (value) => <OrderStatusBadge status={value} />
    },
    {
      id: 'totalAmount',
      title: 'Total',
      sortable: true,
      alignment: 'right',
      render: (value) => formatCurrency(value)
    }
  ];

  return (
    <DataFrameTable
      data={data?.orders || []}
      columns={columns}
      idField="id"
      search={{
        searchTerm,
        placeholder: 'Search orders...',
        onSearch: setSearchTerm,
        onClear: () => setSearchTerm('')
      }}
      quickFilters={{
        filters: [
          {
            id: 'status',
            label: 'Status',
            field: 'status',
            options: [
              { label: 'Confirmed', value: 'confirmed' },
              { label: 'Processing', value: 'processing' },
              { label: 'Shipped', value: 'shipped' }
            ]
          }
        ],
        activeFilters,
        onFiltersChange: setActiveFilters
      }}
      pagination={{
        currentPage,
        pageSize,
        totalItems: data?.total || 0,
        onPageChange: setCurrentPage,
        onPageSizeChange: setPageSize
      }}
      exportOptions={{
        formats: ['csv', 'json'],
        filename: 'orders-export',
        onExport: (format, data) => exportData(data, format)
      }}
      selectable={true}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
      bulkActions={[
        {
          id: 'fulfill',
          label: 'Mark as fulfilled',
          onAction: handleFulfillOrders
        }
      ]}
      loading={isLoading}
      emptyState={{
        title: 'No orders found',
        description: 'Try adjusting your search criteria'
      }}
    />
  );
}
```

## Migration Guide

### From ResourceList to DataFrameTable

**Before:**
```tsx
<ResourceList
  resourceName={{ singular: 'quote', plural: 'quotes' }}
  items={quotes}
  renderItem={renderQuoteItem}
  filterControl={filterControl}
  selectedItems={selectedItems}
  onSelectionChange={setSelectedItems}
  promotedBulkActions={bulkActions}
/>
```

**After:**
```tsx
<DataFrameTable
  data={quotes}
  columns={columns}
  idField="id"
  search={{ placeholder: 'Search quotes...' }}
  quickFilters={quickFilters}
  selectable={true}
  selectedIds={selectedItems}
  onSelectionChange={setSelectedItems}
  bulkActions={bulkActions}
/>
```

### Benefits of Migration

| **Before** | **After** |
|------------|-----------|
| 150+ lines of code | 50 lines of code |
| Manual filter/search logic | Built-in search & filters |
| No sorting capabilities | Automatic sorting |
| No export functionality | Real file downloads |
| Custom pagination code | Built-in pagination |
| ResourceList limitations | Full table features |

## Best Practices

### 1. Column Design
- Keep column IDs consistent with data field names
- Use descriptive titles
- Mark frequently sorted columns as `sortable: true`
- Use custom renderers for complex data display

### 2. Performance
- Use pagination for large datasets (>100 items)
- Implement server-side filtering for very large datasets
- Use React Query for data fetching and caching

### 3. User Experience
- Provide meaningful search placeholders
- Use logical filter groupings
- Include empty state messages
- Show loading states during data fetching

### 4. Type Safety
- Define proper TypeScript interfaces for your data
- Use type assertions in render functions: `value as string`
- Export all types from your table implementations

## Available Components

- `DataFrameTable` - Main table component
- `TableSearchField` - Standalone search input
- `QuickFilters` - Dropdown filter component
- `TableHeader` - Export and column visibility controls
- `TablePagination` - Pagination controls
- `TableMetrics` - Summary metric cards

## Utilities

- `sortData()` - Client-side sorting
- `filterData()` - Text search filtering
- `exportData()` - File export with proper formatting
- `combineFilters()` - Apply multiple filters efficiently

---

For more examples, see:
- `TableDemoPage.tsx` - Complete feature demonstration
- `EnhancedQuotesTable.tsx` - Quotes table migration example
- `EnhancedOrdersTable.tsx` - Orders table migration example