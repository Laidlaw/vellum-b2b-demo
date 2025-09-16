// Types for configurable DataTable system
import { ReactNode } from 'react';

export interface TableColumn {
  id: string;
  title: string;
  sortable?: boolean;
  alignment?: 'left' | 'center' | 'right';
  width?: string;
  render?: (value: unknown, row: unknown) => ReactNode;
}

export interface TableFilter {
  id: string;
  label: string;
  count?: number;
  badge?: boolean;
}

export interface TableMetric {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface BulkAction {
  id: string;
  label: string;
  destructive?: boolean;
  onAction: (selectedIds: string[]) => void;
}

export interface PaginationOptions {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export interface ColumnVisibilityOptions {
  hiddenColumns?: string[];
  onColumnVisibilityChange?: (hiddenColumns: string[]) => void;
}

export interface ExportOptions {
  formats?: ('csv' | 'xlsx' | 'json')[];
  filename?: string;
  onExport: (format: string, data: Record<string, unknown>[]) => void;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: Record<string, unknown>;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface SavedSearchOptions {
  savedSearches?: SavedSearch[];
  activeSavedSearch?: string;
  onSavedSearchApply?: (search: SavedSearch) => void;
  onSavedSearchSave?: (name: string, filters: Record<string, unknown>) => void;
  onSavedSearchDelete?: (searchId: string) => void;
}

export interface DataFrameTableProps {
  // Data
  data: Record<string, unknown>[];
  columns: TableColumn[];

  // Identification
  idField: string;

  // Filtering
  filters?: TableFilter[];
  activeFilter?: string;
  onFilterChange?: (filterId: string) => void;

  // Metrics
  metrics?: TableMetric[];

  // Selection
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  bulkActions?: BulkAction[];

  // Actions
  onRowClick?: (id: string, row: Record<string, unknown>) => void;

  // Sorting
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string, direction: 'asc' | 'desc') => void;

  // Pagination
  pagination?: PaginationOptions;

  // Column visibility
  columnVisibility?: ColumnVisibilityOptions;

  // Export functionality
  exportOptions?: ExportOptions;

  // Saved searches
  savedSearches?: SavedSearchOptions;

  // Table density
  density?: 'compact' | 'comfortable' | 'spacious';

  // View options
  viewType?: 'table' | 'list' | 'cards';
  onViewTypeChange?: (viewType: 'table' | 'list' | 'cards') => void;

  // Loading state
  loading?: boolean;

  // Empty state
  emptyState?: {
    title: string;
    description?: string;
    action?: {
      label: string;
      onAction: () => void;
    };
  };
}

export interface TableContextType {
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  bulkActions: BulkAction[];
}