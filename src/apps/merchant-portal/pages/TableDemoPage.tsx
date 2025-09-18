import { useState } from 'react';
import { Page, Card, BlockStack, Text, Badge, InlineStack, Box, Button } from '@shopify/polaris';
import {
  DataFrameTable,
  type TableColumn,
  type PaginationOptions,
  type ColumnVisibilityOptions,
  type ExportOptions,
  type SearchOptions,
  type QuickFiltersOptions,
  type ActiveQuickFilter,
  type RowActionsConfig,
  type RowBadge,
  type BulkAction,
  type DetailModalOptions,
  type CellClickBehavior,
  DEFAULT_ACTIONS
} from '../../../shared/components/tables';
import { exportData } from '../../../shared/utils/table';

// Mock data for demo
const DEMO_DATA = Array.from({ length: 47 }, (_, index) => ({
  id: `item-${index + 1}`,
  name: `Product ${index + 1}`,
  sku: `SKU-${(index + 1).toString().padStart(3, '0')}`,
  category: ['Electronics', 'Clothing', 'Home & Garden', 'Tools'][index % 4],
  price: 19.99 + (index * 5.5),
  stock: Math.floor(Math.random() * 100),
  status: ['active', 'inactive', 'out-of-stock'][index % 3],
  vendor: ['Acme Corp', 'TechFlow', 'GreenLife', 'ProTools'][index % 4],
  dateAdded: new Date(2024, 0, 1 + (index * 2)).toISOString()
}));

export default function TableDemoPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeQuickFilters, setActiveQuickFilters] = useState<ActiveQuickFilter[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [data] = useState(DEMO_DATA);
  const [cellClickBehavior, setCellClickBehavior] = useState<CellClickBehavior>('detail');

  // Action manager configuration (simplified - no handlers needed!)
  const actionManager = {
    navigate: (url: string) => {
      console.log('Navigate to:', url);
      alert(`Navigate to: ${url}`);
    },
    edit: (rowId: string, row: Record<string, unknown>) => {
      console.log('Edit action:', { rowId, row });
      alert(`Edit ${row.name}`);
    }
    // delete, activate, deactivate, duplicate handlers are provided by useTableActionManager
  };

  // Define table columns with refined features
  const columns: TableColumn[] = [
    {
      id: 'name',
      title: 'Name',
      sortable: true,
      clickBehavior: 'detail', // Override global behavior for this column
      render: (value) => <strong>{value as string}</strong>
    },
    {
      id: 'sku',
      title: 'SKU',
      sortable: true,
      clickBehavior: 'select' // Click to select row
    },
    {
      id: 'category',
      title: 'Category',
      sortable: true,
      clickBehavior: 'none' // No click action
    },
    {
      id: 'price',
      title: 'Price',
      sortable: true,
      alignment: 'right',
      render: (value) => `$${(value as number).toFixed(2)}`
    },
    {
      id: 'stock',
      title: 'Amount',
      sortable: true,
      alignment: 'right',
      editable: true,
      editType: 'number',
      render: (value) => {
        const stock = value as number;
        return (
          <span style={{ color: stock === 0 ? 'red' : stock < 10 ? 'orange' : 'inherit' }}>
            {stock}
          </span>
        );
      }
    },
    {
      id: 'status',
      title: 'Status',
      sortable: true,
      render: (value) => {
        const status = value as string;
        const toneMap: Record<string, 'success' | 'subdued' | 'critical'> = {
          active: 'success',
          inactive: 'subdued',
          'out-of-stock': 'critical'
        };
        return (
          <Badge tone={toneMap[status] || 'subdued'}>
            {status.replace('-', ' ')}
          </Badge>
        );
      }
    },
    {
      id: 'vendor',
      title: 'Vendor',
      sortable: true
    },
    {
      id: 'dateAdded',
      title: 'Date Added',
      sortable: true,
      render: (value) => new Date(value as string).toLocaleDateString()
    }
  ];


  // Search configuration
  const search: SearchOptions = {
    searchTerm,
    placeholder: 'Search products by name, SKU, category, vendor...',
    onSearch: setSearchTerm,
    onClear: () => setSearchTerm(''),
    enabled: true
  };

  // Quick filters configuration
  const quickFilters: QuickFiltersOptions = {
    filters: [
      {
        id: 'category',
        label: 'Category',
        field: 'category',
        options: [],
        placeholder: 'All categories'
      },
      {
        id: 'status',
        label: 'Status',
        field: 'status',
        options: [],
        placeholder: 'All statuses'
      },
      {
        id: 'vendor',
        label: 'Vendor',
        field: 'vendor',
        options: [],
        placeholder: 'All vendors'
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
    totalItems: DEMO_DATA.length,
    onPageChange: setCurrentPage,
    onPageSizeChange: (newPageSize) => {
      setPageSize(newPageSize);
      setCurrentPage(1); // Reset to first page when changing page size
    }
  };

  // Column visibility configuration
  const columnVisibility: ColumnVisibilityOptions = {
    hiddenColumns,
    onColumnVisibilityChange: setHiddenColumns
  };

  // Export configuration - now with real functionality
  const exportOptions: ExportOptions = {
    formats: ['csv', 'json'],
    filename: 'products-export',
    onExport: (format: string, data) => {
      try {
        exportData(data, format as 'csv' | 'json', {
          filename: 'products-export',
          includeHeaders: true,
          columnMapping: {
            id: 'Product ID',
            name: 'Product Name',
            sku: 'SKU',
            category: 'Category',
            price: 'Price ($)',
            stock: 'Stock Quantity',
            status: 'Status',
            vendor: 'Vendor',
            dateAdded: 'Date Added'
          }
        });
      } catch (error) {
        console.error('Export failed:', error);
        alert(`Export failed: ${error}`);
      }
    }
  };


  // Row actions configuration - using action configs instead of handlers
  const rowActions: RowActionsConfig = {
    enabled: true,
    actions: [
      {
        ...DEFAULT_ACTIONS.view,
        url: (row) => `/products/${row.id}` // Dynamic URL generation
      },
      DEFAULT_ACTIONS.edit,
      DEFAULT_ACTIONS.duplicate,
      DEFAULT_ACTIONS.delete
    ]
  };

  // Row badges configuration
  const rowBadges: RowBadge[] = [
    {
      content: 'Low Stock',
      tone: 'attention',
      condition: (row) => (row.stock as number) < 10 && (row.stock as number) > 0
    },
    {
      content: 'Out of Stock',
      tone: 'critical',
      condition: (row) => (row.stock as number) === 0
    },
    {
      content: 'Premium',
      tone: 'success',
      condition: (row) => (row.price as number) > 100
    }
  ];

  // Simplified bulk actions using built-in handlers
  const bulkActions: BulkAction[] = [
    {
      id: 'activate',
      label: 'Activate Selected',
      onAction: () => {} // Handled by action manager
    },
    {
      id: 'deactivate',
      label: 'Deactivate Selected',
      onAction: () => {} // Handled by action manager
    },
    {
      id: 'delete',
      label: 'Delete Selected',
      destructive: true,
      onAction: () => {} // Handled by action manager
    }
  ];

  // Detail modal configuration
  const detailModal: DetailModalOptions = {
    enabled: true,
    title: (row) => `Product Details: ${row.name}`,
    size: 'medium',
    content: (row) => (
      <BlockStack gap="400">
        <Card>
          <BlockStack gap="300">
            <Text as="h3" variant="headingMd">Product Information</Text>
            <InlineStack gap="600">
              <Box>
                <Text as="p" variant="bodySm" tone="subdued">SKU</Text>
                <Text as="p" variant="bodyMd" fontWeight="medium">{row.sku as string}</Text>
              </Box>
              <Box>
                <Text as="p" variant="bodySm" tone="subdued">Category</Text>
                <Text as="p" variant="bodyMd" fontWeight="medium">{row.category as string}</Text>
              </Box>
              <Box>
                <Text as="p" variant="bodySm" tone="subdued">Vendor</Text>
                <Text as="p" variant="bodyMd" fontWeight="medium">{row.vendor as string}</Text>
              </Box>
            </InlineStack>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="300">
            <Text as="h3" variant="headingMd">Inventory & Pricing</Text>
            <InlineStack gap="600">
              <Box>
                <Text as="p" variant="bodySm" tone="subdued">Price</Text>
                <Text as="p" variant="headingMd" fontWeight="bold">
                  ${(row.price as number).toFixed(2)}
                </Text>
              </Box>
              <Box>
                <Text as="p" variant="bodySm" tone="subdued">Stock Level</Text>
                <Text as="p" variant="bodyMd" fontWeight="medium">
                  {row.stock as number} units
                </Text>
              </Box>
              <Box>
                <Text as="p" variant="bodySm" tone="subdued">Status</Text>
                <Badge tone={(row.status === 'active') ? 'success' :
                  (row.status === 'inactive') ? 'subdued' : 'critical'}>
                  {(row.status as string).replace('-', ' ')}
                </Badge>
              </Box>
            </InlineStack>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="300">
            <Text as="h3" variant="headingMd">Metadata</Text>
            <Box>
              <Text as="p" variant="bodySm" tone="subdued">Date Added</Text>
              <Text as="p" variant="bodyMd" fontWeight="medium">
                {new Date(row.dateAdded as string).toLocaleDateString()}
              </Text>
            </Box>
          </BlockStack>
        </Card>
      </BlockStack>
    ),
    primaryAction: (row) => ({
      content: 'Edit Product',
      onAction: () => {
        alert(`Edit ${row.name}`);
      }
    })
  };

  return (
    <Page
      title="Enhanced Table Demo"
      subtitle="Showcasing the new DataFrameTable features: pagination, column visibility, export, and sorting"
    >
      <BlockStack gap="600">
        <Card>
          <BlockStack gap="400">
            <div>
              <h3>Refined DataFrameTable Features:</h3>
              <ul>
                <li><strong>🔍 Real-time Search:</strong> Search across all fields with debounced input</li>
                <li><strong>🎛️ Quick Filters:</strong> Dropdown filters for category, status, and vendor</li>
                <li><strong>📄 Pagination:</strong> Navigate with configurable page sizes (10, 25, 50, 100)</li>
                <li><strong>👁️ Column Visibility:</strong> Hide/show columns using the "Columns" button</li>
                <li><strong>📊 Real Export:</strong> Download actual CSV and JSON files</li>
                <li><strong>🔄 Built-in Sorting:</strong> Click column headers to sort</li>
                <li><strong>✏️ Inline Editing:</strong> Click on stock values to edit directly (editable cells have dashed border)</li>
                <li><strong>🖱️ Smart Cell Clicks:</strong> Different click behaviors per column:
                  <ul>
                    <li>Product Name: Opens detail modal</li>
                    <li>SKU: Selects/deselects row</li>
                    <li>Category: No action</li>
                    <li>Stock: Editable (overrides other behaviors)</li>
                  </ul>
                </li>
                <li><strong>⋮ Floating Row Actions:</strong> Three-dots menu with View, Edit, Duplicate, Delete</li>
                <li><strong>🔗 Detail Modal:</strong> Click product names for detailed information</li>
                <li><strong>🏷️ Smart Badges:</strong> Visual indicators for low stock, out of stock, premium items</li>
                <li><strong>☑️ Intelligent Bulk Actions:</strong> Built-in handlers for common operations</li>
                <li><strong>⚙️ Action Manager:</strong> Abstracted action handling - no custom handlers needed</li>
              </ul>

              <BlockStack gap="300">
                <Text as="p" variant="bodySm" tone="subdued">
                  Try different interactions:
                </Text>
                <InlineStack gap="200">
                  <Button
                    size="small"
                    variant={cellClickBehavior === 'detail' ? 'primary' : 'secondary'}
                    onClick={() => setCellClickBehavior('detail')}
                  >
                    Detail Mode
                  </Button>
                  <Button
                    size="small"
                    variant={cellClickBehavior === 'select' ? 'primary' : 'secondary'}
                    onClick={() => setCellClickBehavior('select')}
                  >
                    Select Mode
                  </Button>
                  <Button
                    size="small"
                    variant={cellClickBehavior === 'none' ? 'primary' : 'secondary'}
                    onClick={() => setCellClickBehavior('none')}
                  >
                    No Action
                  </Button>
                </InlineStack>
                <Text as="p" variant="bodySm" tone="subdued">
                  Current mode: <strong>{cellClickBehavior}</strong> •
                  Individual columns can override this behavior
                </Text>
              </BlockStack>
            </div>
          </BlockStack>
        </Card>

        <DataFrameTable
          data={data}
          columns={columns}
          idField="id"
          search={search}
          quickFilters={quickFilters}
          pagination={pagination}
          columnVisibility={columnVisibility}
          exportOptions={exportOptions}
          selectable={true}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          cellClickBehavior={cellClickBehavior}
          bulkActions={bulkActions}
          rowActions={rowActions}
          rowBadges={rowBadges}
          detailModal={detailModal}
          actionManager={actionManager}
          emptyState={{
            title: 'No products found',
            description: 'Try adjusting your search or filter criteria'
          }}
        />
      </BlockStack>
    </Page>
  );
}