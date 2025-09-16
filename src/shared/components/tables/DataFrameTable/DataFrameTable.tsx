import { useState, useCallback, useMemo } from 'react';
import {
  Card,
  IndexTable,
  BlockStack,
  InlineStack,
  Button,
  Text,
  EmptyState,
  Spinner,
  ButtonGroup,
  Box,
  useIndexResourceState
} from '@shopify/polaris';
import { TableFilters } from './TableFilters';
import { TableMetrics } from './TableMetrics';
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
  loading = false,
  emptyState
}: DataFrameTableProps) {
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>([]);

  // Use controlled or internal selection state
  const currentSelectedIds = onSelectionChange ? selectedIds : internalSelectedIds;
  const setCurrentSelectedIds = onSelectionChange || setInternalSelectedIds;

  // Prepare resources for IndexTable
  const resources = useMemo(() => {
    return data.map(row => ({
      id: row[idField] as string,
      ...row
    }));
  }, [data, idField]);

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

  // Convert columns to headings
  const headings = columns.map(col => ({
    title: col.title,
    id: col.id,
  }));

  // Handle sorting
  const handleSort = useCallback((headingIndex: number, direction: 'asc' | 'desc') => {
    const column = columns[headingIndex];
    if (column && onSort) {
      onSort(column.id, direction);
    }
  }, [columns, onSort]);

  // Bulk actions
  const showBulkActions = selectable && selectedResources.length > 0 && bulkActions.length > 0;

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
              sortable: columns[index]?.sortable
            }))}
            selectable={selectable}
            promotedBulkActions={promotedBulkActions}
            sortDirection={sortDirection}
            sortColumnIndex={sortBy ? columns.findIndex(col => col.id === sortBy) : undefined}
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
                {columns.map((column) => {
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
        </BlockStack>
      </Card>
    </BlockStack>
  );
}