import { useState } from 'react';
import { Page, Card, BlockStack } from '@shopify/polaris';
import {
  DataFrameTable,
  type TableColumn,
  type PaginationOptions,
  type ColumnVisibilityOptions,
  type ExportOptions,
  type SearchOptions,
  type QuickFiltersOptions,
  type ActiveQuickFilter
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

  // Define table columns
  const columns: TableColumn[] = [
    {
      id: 'name',
      title: 'Product Name',
      sortable: true,
      render: (value) => <strong>{value as string}</strong>
    },
    {
      id: 'sku',
      title: 'SKU',
      sortable: true
    },
    {
      id: 'category',
      title: 'Category',
      sortable: true
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
      title: 'Stock',
      sortable: true,
      alignment: 'right',
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
        const colors: Record<string, string> = {
          active: 'green',
          inactive: 'gray',
          'out-of-stock': 'red'
        };
        return (
          <span style={{
            color: colors[status] || 'inherit',
            textTransform: 'capitalize'
          }}>
            {status.replace('-', ' ')}
          </span>
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


  const handleRowClick = (id: string, row: Record<string, unknown>) => {
    console.log('Row clicked:', { id, row });
    alert(`Clicked on ${row.name} (${id})`);
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
              <h3>Features Demonstrated:</h3>
              <ul>
                <li><strong>🔍 Real-time Search:</strong> Search across all fields with debounced input</li>
                <li><strong>🎛️ Quick Filters:</strong> Dropdown filters for category, status, and vendor with auto-generated options</li>
                <li><strong>📄 Pagination:</strong> Navigate through 47 items with configurable page sizes (10, 25, 50, 100)</li>
                <li><strong>👁️ Column Visibility:</strong> Hide/show columns using the "Columns" button</li>
                <li><strong>📊 Real Export:</strong> Download actual CSV and JSON files</li>
                <li><strong>🔄 Built-in Sorting:</strong> Click column headers to sort (no external state needed)</li>
                <li><strong>🎨 Custom Rendering:</strong> Status colors, price formatting, and stock indicators</li>
                <li><strong>🖱️ Row Interaction:</strong> Click any row to see details</li>
                <li><strong>⚡ Performance:</strong> Optimized search, sort, and filter processing</li>
              </ul>
            </div>
          </BlockStack>
        </Card>

        <DataFrameTable
          data={DEMO_DATA}
          columns={columns}
          idField="id"
          search={search}
          quickFilters={quickFilters}
          pagination={pagination}
          columnVisibility={columnVisibility}
          exportOptions={exportOptions}
          onRowClick={handleRowClick}
          emptyState={{
            title: 'No products found',
            description: 'Try adjusting your search or filter criteria'
          }}
        />
      </BlockStack>
    </Page>
  );
}