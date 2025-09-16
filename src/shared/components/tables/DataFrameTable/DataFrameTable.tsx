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
import type { DataFrameTableProps } from './types';

export function DataFrameTable({
  data,
  columns,
  idField,
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

  // Use controlled or internal selection state
  const currentSelectedIds = onSelectionChange ? selectedIds : internalSelectedIds;
  const setCurrentSelectedIds = onSelectionChange || setInternalSelectedIds;

  // Filter visible columns based on column visibility settings
  const visibleColumns = useMemo(() => {
    const hiddenColumns = columnVisibility?.hiddenColumns || [];
    return columns.filter(col => !hiddenColumns.includes(col.id));
  }, [columns, columnVisibility]);

  // Paginate data if pagination is enabled
  const paginatedData = useMemo(() => {
    if (!pagination) return data;

    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, pagination]);

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
  }));

  // Handle sorting
  const handleSort = useCallback((headingIndex: number, direction: 'asc' | 'desc') => {
    const column = visibleColumns[headingIndex];
    if (column && onSort) {
      onSort(column.id, direction);
    }
  }, [visibleColumns, onSort]);

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
          {/* Filters */}
          {filters.length > 0 && (
            <Box padding="400" paddingBlockEnd="0">
              <TableFilters
                filters={filters}
                activeFilter={activeFilter}
                onFilterChange={onFilterChange || (() => {})}
              />
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
            headings={headings.map((heading, index) => ({
              ...heading,
              sortable: visibleColumns[index]?.sortable
            }))}
            selectable={selectable}
            promotedBulkActions={promotedBulkActions}
            sortDirection={sortDirection}
            sortColumnIndex={sortBy ? visibleColumns.findIndex(col => col.id === sortBy) : undefined}
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