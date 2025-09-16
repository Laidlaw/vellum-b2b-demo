import { useState, useCallback } from 'react';
import {
  Button,
  Popover,
  ActionList,
  InlineStack,
  Checkbox,
  Text,
  Box
} from '@shopify/polaris';
import {
  ExportIcon,
  ViewIcon
} from '@shopify/polaris-icons';
import type { TableColumn, ExportOptions, ColumnVisibilityOptions } from './types';

interface TableHeaderProps {
  columns: TableColumn[];
  exportOptions?: ExportOptions;
  columnVisibility?: ColumnVisibilityOptions;
  data: Record<string, unknown>[];
  title?: string;
  actions?: React.ReactNode;
}

export function TableHeader({
  columns,
  exportOptions,
  columnVisibility,
  data,
  title,
  actions
}: TableHeaderProps) {
  const [exportPopoverActive, setExportPopoverActive] = useState(false);
  const [columnsPopoverActive, setColumnsPopoverActive] = useState(false);

  const handleExport = useCallback((format: string) => {
    if (exportOptions?.onExport) {
      exportOptions.onExport(format, data);
    }
    setExportPopoverActive(false);
  }, [exportOptions, data]);

  const handleColumnVisibilityChange = useCallback((columnId: string, visible: boolean) => {
    if (!columnVisibility?.onColumnVisibilityChange) return;

    const hiddenColumns = columnVisibility.hiddenColumns || [];

    if (visible) {
      // Show column - remove from hidden list
      const newHiddenColumns = hiddenColumns.filter(id => id !== columnId);
      columnVisibility.onColumnVisibilityChange(newHiddenColumns);
    } else {
      // Hide column - add to hidden list
      const newHiddenColumns = [...hiddenColumns, columnId];
      columnVisibility.onColumnVisibilityChange(newHiddenColumns);
    }
  }, [columnVisibility]);

  const exportActions = exportOptions?.formats?.map(format => ({
    content: `Export as ${format.toUpperCase()}`,
    onAction: () => handleExport(format)
  })) || [];

  const hiddenColumns = columnVisibility?.hiddenColumns || [];
  const visibleColumnsCount = columns.length - hiddenColumns.length;

  return (
    <Box paddingBlockEnd="400">
      <InlineStack align="space-between" blockAlign="center">
        {title && (
          <Text as="h2" variant="headingMd">
            {title}
          </Text>
        )}

        <InlineStack gap="200">
          {actions}

          {/* Column visibility toggle */}
          {columnVisibility && (
            <Popover
              active={columnsPopoverActive}
              activator={
                <Button
                  icon={ViewIcon}
                  onClick={() => setColumnsPopoverActive(!columnsPopoverActive)}
                  size="medium"
                >
                  Columns ({visibleColumnsCount})
                </Button>
              }
              onClose={() => setColumnsPopoverActive(false)}
              preferredAlignment="right"
            >
              <Box padding="300">
                <Text as="h3" variant="headingSm" fontWeight="medium">
                  Show/hide columns
                </Text>
                <Box paddingBlockStart="300">
                  {columns.map((column) => {
                    const isVisible = !hiddenColumns.includes(column.id);
                    return (
                      <Box key={column.id} paddingBlockStart="200">
                        <Checkbox
                          label={column.title}
                          checked={isVisible}
                          onChange={(checked) => handleColumnVisibilityChange(column.id, checked)}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Popover>
          )}

          {/* Export functionality */}
          {exportOptions && exportActions.length > 0 && (
            <Popover
              active={exportPopoverActive}
              activator={
                <Button
                  icon={ExportIcon}
                  onClick={() => setExportPopoverActive(!exportPopoverActive)}
                  size="medium"
                >
                  Export
                </Button>
              }
              onClose={() => setExportPopoverActive(false)}
              preferredAlignment="right"
            >
              <ActionList items={exportActions} />
            </Popover>
          )}
        </InlineStack>
      </InlineStack>
    </Box>
  );
}