import { useState, useCallback, useMemo, useEffect } from 'react';
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
import { CellWrapper } from './CellWrapper';
import { RowActions } from './RowActions';
import { DetailModal } from './DetailModal';
import { StagedActions } from './StagedActions';
import { useTableActionManager } from './TableActionManager';
import { combineFilters } from '../../../utils/table';
import type { DataFrameTableProps, EditingCell, StagedAction } from './types';

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
  cellClickBehavior = 'detail',
  onRowClick,
  rowActions,
  rowBadges = [],
  detailModal,
  actionManager,
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
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [detailModalRow, setDetailModalRow] = useState<Record<string, unknown> | null>(null);
  const [stagedActions, setStagedActions] = useState<StagedAction[]>([]);

  // Initialize action manager
  const defaultActionManager = useTableActionManager({
    data,
    setData: () => {}, // No-op since we don't modify external data
    idField,
    onNavigate: actionManager?.navigate,
    onEdit: actionManager?.edit,
    onDelete: actionManager?.delete
  });

  const finalActionManager = { ...defaultActionManager, ...actionManager };

  // Use controlled or internal selection state
  const currentSelectedIds = onSelectionChange ? selectedIds : internalSelectedIds;
  const setCurrentSelectedIds = useCallback((ids: string[]) => {
    if (onSelectionChange) {
      onSelectionChange(ids);
    } else {
      setInternalSelectedIds(ids);
    }
  }, [onSelectionChange]);

  // Update internal data when prop changes
  // COMMENTED OUT: Causing infinite loop - using data prop directly instead
  // useEffect(() => {
  //   setInternalData(data);
  // }, [data]);

  // Use controlled or internal search state
  const currentSearchTerm = search?.onSearch ? (search.searchTerm || '') : internalSearchTerm;

  // Use controlled or internal sort state
  const currentSortBy = onSort ? sortBy : internalSortBy;
  const currentSortDirection = onSort ? sortDirection : internalSortDirection;

  // Filter visible columns based on column visibility settings
  // Remove any dedicated 'actions' columns as we now use floating actions
  const visibleColumns = useMemo(() => {
    const hiddenColumns = columnVisibility?.hiddenColumns || [];
    return columns.filter(col =>
      !hiddenColumns.includes(col.id) &&
      col.id !== 'actions' // Remove dedicated actions column
    );
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

  // Enhanced action handlers
  const handleCellEdit = useCallback((rowId: string, columnId: string, newValue: unknown) => {
    const column = columns.find(col => col.id === columnId);
    if (column?.onEdit) {
      column.onEdit(rowId, newValue);
    }

    // Update internal data
    // COMMENTED OUT: Using external data prop - parent component should handle updates
    // setInternalData(prevData =>
    //   prevData.map(row =>
    //     row[idField] === rowId ? { ...row, [columnId]: newValue } : row
    //   )
    // );

    setEditingCell(null);
  }, [columns, idField]);


  const handleExecuteStagedActions = useCallback(() => {
    // Execute all staged actions
    stagedActions.forEach(action => {
      if (action.type === 'bulk') {
        const bulkAction = bulkActions.find(ba => ba.id === action.actionId);
        if (bulkAction) {
          bulkAction.onAction(action.targetIds);
        }
      } else {
        const rowAction = rowActions.find(ra => ra.id === action.actionId);
        if (rowAction && action.targetIds.length > 0) {
          const targetRow = data.find(row => row[idField] === action.targetIds[0]);
          if (targetRow) {
            rowAction.onAction(action.targetIds[0], targetRow);
          }
        }
      }
    });

    setStagedActions([]);
  }, [stagedActions, bulkActions, rowActions, data, idField]);

  const handleDetailModalOpen = useCallback((row: Record<string, unknown>) => {
    if (detailModal?.enabled) {
      setDetailModalRow(row);
    }
  }, [detailModal]);

  const handleRowSelect = useCallback((rowId: string) => {
    if (currentSelectedIds.includes(rowId)) {
      setCurrentSelectedIds(currentSelectedIds.filter(id => id !== rowId));
    } else {
      setCurrentSelectedIds([...currentSelectedIds, rowId]);
    }
  }, [currentSelectedIds, setCurrentSelectedIds]);

  const handleRowClickInternal = useCallback((id: string, row: Record<string, unknown>) => {
    // Only handle row click if no specific cell click behavior is set
    if (cellClickBehavior === 'detail' && detailModal?.enabled) {
      handleDetailModalOpen(row);
    } else if (cellClickBehavior === 'select') {
      handleRowSelect(id);
    } else if (onRowClick) {
      onRowClick(id, row);
    }
  }, [cellClickBehavior, detailModal, onRowClick, handleDetailModalOpen, handleRowSelect]);

  // Enhanced bulk action handler with action manager integration
  const promotedBulkActions = bulkActions.map(action => {
    const handleBulkAction = () => {
      const selectedIds = selectedResources;

      // Use built-in action manager handlers for common actions
      switch (action.id) {
        case 'activate':
          finalActionManager.bulkActivate(selectedIds);
          break;
        case 'deactivate':
          finalActionManager.bulkDeactivate(selectedIds);
          break;
        case 'delete':
          finalActionManager.bulkDelete(selectedIds);
          break;
        default:
          action.onAction(selectedIds);
      }

      // Clear selection after action
      setCurrentSelectedIds([]);
    };

    return {
      content: action.label,
      onAction: handleBulkAction,
      destructive: action.destructive
    };
  });

  // Clear selections when data changes
  useEffect(() => {
    if (onSelectionChange) {
      setCurrentSelectedIds([]);
    }
  }, [data, onSelectionChange, setCurrentSelectedIds]);

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
      {/* Staged Actions */}
      {stagedActions.length > 0 && (
        <StagedActions
          stagedActions={stagedActions}
          onExecuteAll={handleExecuteStagedActions}
          onClearAll={() => setStagedActions([])}
          onRemoveAction={(actionId) =>
            setStagedActions(prev => prev.filter(action => action.actionId !== actionId))
          }
        />
      )}

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
            {resources.map((resource, index) => {
              const isSelected = selectedResources.includes(resource.id);

              return (
                <IndexTable.Row
                  key={resource.id}
                  id={resource.id}
                  selected={isSelected}
                  position={index}
                  onClick={cellClickBehavior === 'none' ? () => handleRowClickInternal(resource.id, resource) : undefined}
                >
                  {visibleColumns.map((column) => {
                    const value = resource[column.id];

                    return (
                      <IndexTable.Cell key={column.id}>
                        <InlineStack align="space-between" blockAlign="center">
                          <CellWrapper
                            value={value}
                            row={resource}
                            column={{
                              ...column,
                              clickBehavior: column.clickBehavior || cellClickBehavior
                            }}
                            isSelected={isSelected}
                            onSelect={() => handleRowSelect(resource.id)}
                            onEdit={(newValue) => handleCellEdit(resource.id, column.id, newValue)}
                            onDetailOpen={() => handleDetailModalOpen(resource)}
                            editingCell={editingCell}
                            setEditingCell={setEditingCell}
                          />

                          {/* Row actions - show only on the last column */}
                          {column === visibleColumns[visibleColumns.length - 1] && rowActions?.enabled && (
                            <RowActions
                              row={resource}
                              rowId={resource.id}
                              config={rowActions}
                              badges={rowBadges}
                              actionManager={finalActionManager}
                            />
                          )}
                        </InlineStack>
                      </IndexTable.Cell>
                    );
                  })}
                </IndexTable.Row>
              );
            })}
          </IndexTable>

          {/* Pagination */}
          {pagination && (
            <TablePagination pagination={pagination} />
          )}
        </BlockStack>
      </Card>

      {/* Detail Modal */}
      {detailModal && (
        <DetailModal
          row={detailModalRow}
          options={detailModal}
          onClose={() => setDetailModalRow(null)}
        />
      )}
    </BlockStack>
  );
}