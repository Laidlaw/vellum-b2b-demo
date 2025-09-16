import { useState, useMemo } from 'react';
import { Page, Card, BlockStack } from '@shopify/polaris';
import {
  DataFrameTable,
  type TableColumn,
  type PaginationOptions,
  type ColumnVisibilityOptions,
  type ExportOptions
} from '../../../shared/components/tables';

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
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...DEMO_DATA].sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
    return sorted;
  }, [sortBy, sortDirection]);

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

  // Export configuration
  const exportOptions: ExportOptions = {
    formats: ['csv', 'xlsx', 'json'],
    filename: 'products-export',
    onExport: (format: string, data) => {
      console.log(`Exporting ${data.length} items as ${format}`);
      // In a real app, this would trigger actual export logic
      alert(`Would export ${data.length} items as ${format.toUpperCase()}`);
    }
  };

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    setSortBy(column);
    setSortDirection(direction);
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
                <li><strong>Pagination:</strong> Navigate through 47 items with configurable page sizes</li>
                <li><strong>Column Visibility:</strong> Hide/show columns using the "Columns" button</li>
                <li><strong>Export:</strong> Export data in CSV, XLSX, or JSON formats</li>
                <li><strong>Sorting:</strong> Click column headers to sort data</li>
                <li><strong>Custom Rendering:</strong> See status colors, price formatting, and stock indicators</li>
                <li><strong>Row Interaction:</strong> Click any row to see details</li>
              </ul>
            </div>
          </BlockStack>
        </Card>

        <DataFrameTable
          data={sortedData}
          columns={columns}
          idField="id"
          pagination={pagination}
          columnVisibility={columnVisibility}
          exportOptions={exportOptions}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={handleSort}
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