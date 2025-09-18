// Types for configurable DataTable system
import { ReactNode } from 'react';
import { BadgeProps } from '@shopify/polaris';

// Cell click behavior options
export type CellClickBehavior = 'none' | 'detail' | 'select';

// Action manager types
export interface ActionConfig {
  type: 'navigate' | 'edit' | 'delete' | 'activate' | 'deactivate' | 'duplicate' | 'custom';
  label: string;
  url?: string | ((row: Record<string, unknown>) => string);
  handler?: (rowId: string, row: Record<string, unknown>) => void | Promise<void>;
  destructive?: boolean;
  disabled?: (row: Record<string, unknown>) => boolean;
}

export interface TableColumn {
  id: string;
  title: string;
  sortable?: boolean;
  alignment?: 'left' | 'center' | 'right';
  width?: string;
  render?: (value: unknown, row: unknown) => ReactNode;
  editable?: boolean;
  editType?: 'text' | 'number' | 'select' | 'date';
  editOptions?: { label: string; value: string }[];
  onEdit?: (rowId: string, newValue: unknown) => void;
  clickBehavior?: CellClickBehavior;
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

export interface RowAction {
  id: string;
  config: ActionConfig;
  icon?: ReactNode;
}

export interface RowActionsConfig {
  enabled?: boolean;
  actions: ActionConfig[];
  maxVisibleActions?: number;
  showAsColumn?: boolean;
}

export interface RowBadge {
  content: string;
  tone?: BadgeProps['tone'];
  condition?: (row: Record<string, unknown>) => boolean;
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

export interface SearchOptions {
  searchTerm?: string;
  searchFields?: string[];
  placeholder?: string;
  enabled?: boolean;
  onSearch?: (searchTerm: string) => void;
  onClear?: () => void;
}

export interface QuickFilterOption {
  label: string;
  value: string;
}

export interface QuickFilter {
  id: string;
  label: string;
  field: string;
  options: QuickFilterOption[];
  placeholder?: string;
  allowMultiple?: boolean;
}

export interface ActiveQuickFilter {
  filterId: string;
  values: string[];
}

export interface QuickFiltersOptions {
  filters: QuickFilter[];
  activeFilters?: ActiveQuickFilter[];
  onFiltersChange: (filters: ActiveQuickFilter[]) => void;
  onClearAll?: () => void;
}

export interface DetailModalOptions {
  enabled?: boolean;
  title?: (row: Record<string, unknown>) => string;
  content: (row: Record<string, unknown>) => ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullScreen';
  primaryAction?: (row: Record<string, unknown>) => {
    content: string;
    onAction: () => void;
    destructive?: boolean;
    loading?: boolean;
  } | null;
  secondaryActions?: (row: Record<string, unknown>) => {
    content: string;
    onAction: () => void;
  }[];
}

export interface RowReorderingOptions {
  enabled?: boolean;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  dragHandle?: boolean;
}

export interface TableActionManager {
  // Built-in action handlers
  navigate: (url: string) => void;
  edit: (rowId: string, row: Record<string, unknown>) => void;
  delete: (rowId: string, row: Record<string, unknown>) => void;
  activate: (rowId: string, row: Record<string, unknown>) => void;
  deactivate: (rowId: string, row: Record<string, unknown>) => void;
  duplicate: (rowId: string, row: Record<string, unknown>) => void;

  // Bulk action handlers
  bulkActivate: (selectedIds: string[]) => void;
  bulkDeactivate: (selectedIds: string[]) => void;
  bulkDelete: (selectedIds: string[]) => void;
}

export interface DataFrameTableProps {
  // Data
  data: Record<string, unknown>[];
  columns: TableColumn[];

  // Identification
  idField: string;

  // Search functionality
  search?: SearchOptions;

  // Quick dropdown filters
  quickFilters?: QuickFiltersOptions;

  // Tab filters
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

  // Row interactions
  cellClickBehavior?: CellClickBehavior;
  onRowClick?: (id: string, row: Record<string, unknown>) => void;
  rowActions?: RowActionsConfig;
  rowBadges?: RowBadge[];
  detailModal?: DetailModalOptions;
  rowReordering?: RowReorderingOptions;
  actionManager?: Partial<TableActionManager>;

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
  stagedActions: StagedAction[];
  setStagedActions: (actions: StagedAction[]) => void;
}

export interface StagedAction {
  id: string;
  type: 'bulk' | 'row';
  actionId: string;
  targetIds: string[];
  label: string;
  destructive?: boolean;
}

export interface EditingCell {
  rowId: string;
  columnId: string;
  value: unknown;
}

export interface TableState {
  selectedIds: string[];
  editingCell: EditingCell | null;
  detailModalRow: Record<string, unknown> | null;
  stagedActions: StagedAction[];
}

export interface CellWrapperProps {
  value: unknown;
  row: Record<string, unknown>;
  column: TableColumn;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: (newValue: unknown) => void;
  onDetailOpen: () => void;
  editingCell: EditingCell | null;
  setEditingCell: (cell: EditingCell | null) => void;
}