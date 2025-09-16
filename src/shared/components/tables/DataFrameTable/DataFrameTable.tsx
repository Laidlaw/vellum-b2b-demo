import { useState, useCallback, useMemo } from 'react';
import {
  Card,
  IndexTable,
  BlockStack,
  InlineStack,
  Text,
  EmptyState,
  Spinner,
  Box,
  useIndexResourceState
} from '@shopify/polaris';
import { TableFilters } from './TableFilters';
import { TableMetrics } from './TableMetrics';
import { TableHeader } from './TableHeader';
import { TablePagination } from './TablePagination';
import { TableSearchField } from './TableSearchField';
import { QuickFilters } from './QuickFilters';
import { combineFilters } from '../../../utils/table';
import type { DataFrameTableProps } from './types';

export function DataFrameTable({
  data,
  columns,
  idField,
  search,
  quickFilters,
  filters = [],
  activeFilter = 'all',
  onFilterChange,
  metrics = [],
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  bulkActions = [],
  onRowClick,
  sortBy,
  sortDirection = 'asc',
  onSort,
  pagination,
  columnVisibility,
  exportOptions,
  // density = 'comfortable', // TODO: Implement density feature
  loading = false,
  emptyState
}: DataFrameTableProps) {
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>([]);
  const [internalSearchTerm, setInternalSearchTerm] = useState(search?.searchTerm || '');
  const [internalSortBy, setInternalSortBy] = useState(sortBy || columns.find(col => col.sortable)?.id || undefined);
  const [internalSortDirection, setInternalSortDirection] = useState<'asc' | 'desc'>(sortDirection || 'asc');

  // Use controlled or internal selection state
  const currentSelectedIds = onSelectionChange ? selectedIds : internalSelectedIds;
  const setCurrentSelectedIds = onSelectionChange || setInternalSelectedIds;

  // Use controlled or internal search state
  const currentSearchTerm = search?.onSearch ? (search.searchTerm || '') : internalSearchTerm;

  // Use controlled or internal sort state
  const currentSortBy = onSort ? sortBy : internalSortBy;
  const currentSortDirection = onSort ? sortDirection : internalSortDirection;

  // Filter visible columns based on column visibility settings
  const visibleColumns = useMemo(() => {
    const hiddenColumns = columnVisibility?.hiddenColumns || [];
    return columns.filter(col => !hiddenColumns.includes(col.id));
  }, [columns, columnVisibility]);

  // Apply search, filtering, and sorting
  const processedData = useMemo(() => {
    // Convert QuickFilters to filter constraints
    const quickFilterConstraints = quickFilters?.activeFilters?.map(activeFilter => {
      const filter = quickFilters.filters.find(f => f.id === activeFilter.filterId);
      return filter ? {
        field: filter.field,
        values: activeFilter.values
      } : null;
    }).filter(Boolean) || [];

    return combineFilters(data, {
      quickFilters: quickFilterConstraints.length > 0 ? quickFilterConstraints : undefined,
      search: search?.enabled !== false && currentSearchTerm ? {
        searchTerm: currentSearchTerm,
        searchFields: search?.searchFields
      } : undefined,
      sort: currentSortBy ? {
        column: currentSortBy,
        direction: currentSortDirection
      } : undefined
    });
  }, [data, quickFilters, currentSearchTerm, search?.enabled, search?.searchFields, currentSortBy, currentSortDirection]);

  // Paginate processed data if pagination is enabled
  const paginatedData = useMemo(() => {
    if (!pagination) return processedData;

    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return processedData.slice(startIndex, endIndex);
  }, [processedData, pagination]);

  // Prepare resources for IndexTable using paginated data
  const resources = useMemo(() => {
    return paginatedData.map(row => ({
      id: row[idField] as string,
      ...row
    }));
  }, [paginatedData, idField]);

  // Use Polaris index resource state for selection
  const resourceIDResolver = useCallback((resource: Record<string, unknown>) => {
    return resource.id as string;
  }, []);

  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
  } = useIndexResourceState(resources, {
    resourceIDResolver,
    selectedResources: currentSelectedIds,
    onSelectionChange: setCurrentSelectedIds,
  });

  // Convert visible columns to headings
  const headings = visibleColumns.map(col => ({
    title: col.title,
    id: col.id,
    sortable: col.sortable,
    alignment: col.alignment
  }));

  // Handle sorting
  const handleSort = useCallback((headingIndex: number, direction: 'asc' | 'desc') => {
    const column = visibleColumns[headingIndex];
    if (column) {
      if (onSort) {
        onSort(column.id, direction);
      } else {
        setInternalSortBy(column.id);
        setInternalSortDirection(direction);
      }
    }
  }, [visibleColumns, onSort]);

  // Handle search
  const handleSearch = useCallback((searchTerm: string) => {
    if (search?.onSearch) {
      search.onSearch(searchTerm);
    } else {
      setInternalSearchTerm(searchTerm);
    }
  }, [search]);

  // Handle search clear
  const handleSearchClear = useCallback(() => {
    if (search?.onClear) {
      search.onClear();
    } else {
      setInternalSearchTerm('');
    }
  }, [search]);

  // Bulk action handler
  const promotedBulkActions = bulkActions.map(action => ({
    content: action.label,
    onAction: () => action.onAction(selectedResources),
    destructive: action.destructive
  }));

  if (loading) {
    return (
      <Card>
        <Box padding="400">
          <InlineStack align="center">
            <Spinner size="large" />
            <Text variant="bodyMd">Loading...</Text>
          </InlineStack>
        </Box>
      </Card>
    );
  }

  if (data.length === 0 && emptyState) {
    return (
      <Card>
        <EmptyState
          heading={emptyState.title}
          image=""
          action={emptyState.action}
        >
          {emptyState.description && (
            <Text as="p">{emptyState.description}</Text>
          )}
        </EmptyState>
      </Card>
    );
  }

  return (
    <BlockStack gap="400">
      {/* Metrics Section */}
      {metrics.length > 0 && <TableMetrics metrics={metrics} />}

      {/* Table Header with Export and Column Visibility */}
      <TableHeader
        columns={columns}
        exportOptions={exportOptions}
        columnVisibility={columnVisibility}
        data={data}
      />

      {/* Main Table Card */}
      <Card padding="0">
        <BlockStack gap="0">
          {/* Search and Filters */}
          {(search?.enabled !== false || quickFilters || filters.length > 0) && (
            <Box padding="400" paddingBlockEnd="0">
              <BlockStack gap="300">
                {/* Quick Filters */}
                {quickFilters && (
                  <QuickFilters
                    filters={quickFilters.filters}
                    activeFilters={quickFilters.activeFilters}
                    onFiltersChange={quickFilters.onFiltersChange}
                    onClearAll={quickFilters.onClearAll}
                    data={data}
                  />
                )}

                {/* Search Field */}
                {search?.enabled !== false && (
                  <TableSearchField
                    value={currentSearchTerm}
                    placeholder={search?.placeholder}
                    onSearch={handleSearch}
                    onClear={handleSearchClear}
                  />
                )}

                {/* Tab Filters */}
                {filters.length > 0 && (
                  <TableFilters
                    filters={filters}
                    activeFilter={activeFilter}
                    onFilterChange={onFilterChange || (() => {})}
                  />
                )}
              </BlockStack>
            </Box>
          )}

          {/* Index Table */}
          <IndexTable
            resourceName={{
              singular: 'item',
              plural: 'items',
            }}
            itemCount={resources.length}
            selectedItemsCount={
              allResourcesSelected ? 'All' : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            headings={headings}
            selectable={selectable}
            promotedBulkActions={promotedBulkActions}
            sortDirection={currentSortDirection}
            sortColumnIndex={currentSortBy ? visibleColumns.findIndex(col => col.id === currentSortBy) : undefined}
            onSort={handleSort}
          >
            {resources.map((resource, index) => (
              <IndexTable.Row
                key={resource.id}
                id={resource.id}
                selected={selectedResources.includes(resource.id)}
                position={index}
                onClick={() => onRowClick && onRowClick(resource.id, resource)}
              >
                {visibleColumns.map((column) => {
                  const value = resource[column.id];
                  const cellContent = column.render ? column.render(value, resource) : (value || '—');

                  return (
                    <IndexTable.Cell key={column.id}>
                      {cellContent}
                    </IndexTable.Cell>
                  );
                })}
              </IndexTable.Row>
            ))}
          </IndexTable>

          {/* Pagination */}
          {pagination && (
            <TablePagination pagination={pagination} />
          )}
        </BlockStack>
      </Card>
    </BlockStack>
  );
}