import { useCallback } from 'react';
import type { TableActionManager, ActionConfig } from './types';

interface UseTableActionManagerProps {
  data: Record<string, unknown>[]; // May be used later
  setData: (data: Record<string, unknown>[]) => void;
  idField: string;
  onNavigate?: (url: string) => void;
  onEdit?: (rowId: string, row: Record<string, unknown>) => void;
  onDelete?: (rowId: string, row: Record<string, unknown>) => void;
  customHandlers?: Record<string, (rowId: string, row: Record<string, unknown>) => void>; // May be used later
}

export function useTableActionManager({
  data, // May be used later
  setData,
  idField,
  onNavigate,
  onEdit,
  onDelete,
  customHandlers = {} // May be used later
}: UseTableActionManagerProps): TableActionManager {
  // Suppress lint warnings for intentionally unused params
  void data;
  void customHandlers;
  // Built-in navigation handler
  const navigate = useCallback((url: string) => {
    if (onNavigate) {
      onNavigate(url);
    } else {
      // Default behavior: open in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, [onNavigate]);

  // Built-in edit handler
  const edit = useCallback((rowId: string, row: Record<string, unknown>) => {
    if (onEdit) {
      onEdit(rowId, row);
    } else {
      console.log('Edit action:', { rowId, row });
      alert(`Edit ${row.name || rowId}`);
    }
  }, [onEdit]);

  // Built-in delete handler
  const deleteHandler = useCallback((rowId: string, row: Record<string, unknown>) => {
    if (onDelete) {
      onDelete(rowId, row);
    } else {
      // Default delete behavior
      const itemName = row.name || rowId;
      if (confirm(`Are you sure you want to delete ${itemName}?`)) {
        setData(prevData => prevData.filter(item => item[idField] !== rowId));
      }
    }
  }, [onDelete, setData, idField]);

  // Built-in activate handler
  const activate = useCallback((rowId: string, row: Record<string, unknown>) => {
    void row; // May be used later
    setData(prevData =>
      prevData.map(item =>
        item[idField] === rowId ? { ...item, status: 'active' } : item
      )
    );
  }, [setData, idField]);

  // Built-in deactivate handler
  const deactivate = useCallback((rowId: string, row: Record<string, unknown>) => {
    void row; // May be used later
    setData(prevData =>
      prevData.map(item =>
        item[idField] === rowId ? { ...item, status: 'inactive' } : item
      )
    );
  }, [setData, idField]);

  // Built-in duplicate handler
  const duplicate = useCallback((rowId: string, row: Record<string, unknown>) => {
    const newItem = {
      ...row,
      [idField]: `${row[idField]}-copy`,
      name: `${row.name || 'Item'} (Copy)`,
      sku: row.sku ? `${row.sku}-COPY` : undefined
    };
    setData(prevData => [...prevData, newItem]);
  }, [setData, idField]);

  // Bulk action handlers
  const bulkActivate = useCallback((selectedIds: string[]) => {
    setData(prevData =>
      prevData.map(item =>
        selectedIds.includes(item[idField] as string) ? { ...item, status: 'active' } : item
      )
    );
  }, [setData, idField]);

  const bulkDeactivate = useCallback((selectedIds: string[]) => {
    setData(prevData =>
      prevData.map(item =>
        selectedIds.includes(item[idField] as string) ? { ...item, status: 'inactive' } : item
      )
    );
  }, [setData, idField]);

  const bulkDelete = useCallback((selectedIds: string[]) => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) {
      setData(prevData =>
        prevData.filter(item => !selectedIds.includes(item[idField] as string))
      );
    }
  }, [setData, idField]);

  return {
    navigate,
    edit,
    delete: deleteHandler,
    activate,
    deactivate,
    duplicate,
    bulkActivate,
    bulkDeactivate,
    bulkDelete
  };
}

// Execute action based on config
export function executeAction(
  config: ActionConfig,
  rowId: string,
  row: Record<string, unknown>,
  actionManager: TableActionManager
): void {
  switch (config.type) {
    case 'navigate':
      if (config.url) {
        const url = typeof config.url === 'function' ? config.url(row) : config.url;
        actionManager.navigate(url);
      }
      break;
    case 'edit':
      actionManager.edit(rowId, row);
      break;
    case 'delete':
      actionManager.delete(rowId, row);
      break;
    case 'activate':
      actionManager.activate(rowId, row);
      break;
    case 'deactivate':
      actionManager.deactivate(rowId, row);
      break;
    case 'duplicate':
      actionManager.duplicate(rowId, row);
      break;
    case 'custom':
      if (config.handler) {
        config.handler(rowId, row);
      }
      break;
    default:
      console.warn('Unknown action type:', config.type);
  }
}

// Default action configurations
export const DEFAULT_ACTIONS = {
  view: {
    type: 'navigate' as const,
    label: 'View Details',
    url: (row: Record<string, unknown>) => `/details/${row.id}`
  },
  edit: {
    type: 'edit' as const,
    label: 'Edit'
  },
  duplicate: {
    type: 'duplicate' as const,
    label: 'Duplicate'
  },
  activate: {
    type: 'activate' as const,
    label: 'Activate'
  },
  deactivate: {
    type: 'deactivate' as const,
    label: 'Deactivate'
  },
  delete: {
    type: 'delete' as const,
    label: 'Delete',
    destructive: true
  }
} as const;