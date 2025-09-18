import { Box, Tooltip } from '@shopify/polaris';
import { EditableCell } from './EditableCell';
import type { CellWrapperProps, CellClickBehavior } from './types';

const CLICKABLE_CELL_STYLES = {
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  padding: '2px 4px',
  borderRadius: '4px',
  ':hover': {
    backgroundColor: '#f6f6f7'
  }
};

export function CellWrapper({
  value,
  row,
  column,
  isSelected,
  onSelect,
  onEdit,
  onDetailOpen,
  editingCell,
  setEditingCell
}: CellWrapperProps) {
  const rowId = row[Object.keys(row)[0]] as string; // Assuming first key is ID
  const isEditingThisCell = editingCell?.rowId === rowId && editingCell?.columnId === column.id;

  // Determine click behavior
  const getClickBehavior = (): CellClickBehavior => {
    if (column.editable) {
      return 'none'; // Editable cells handle their own clicks
    }

    return column.clickBehavior || 'detail'; // Default to detail view
  };

  const clickBehavior = getClickBehavior();

  // Handle cell click based on behavior
  const handleCellClick = (event: React.MouseEvent) => {
    // Don't trigger if clicking inside an editable cell that's currently editing
    if (column.editable && isEditingThisCell) {
      return;
    }

    event.stopPropagation(); // Prevent row click

    switch (clickBehavior) {
      case 'select':
        onSelect();
        break;
      case 'detail':
        onDetailOpen();
        break;
      case 'none':
      default:
        // No action
        break;
    }
  };

  // Handle starting edit mode for editable cells
  const handleStartEdit = () => {
    if (column.editable) {
      setEditingCell({
        rowId,
        columnId: column.id,
        value
      });
    }
  };

  // Handle saving edited value
  const handleSaveEdit = (newValue: unknown) => {
    onEdit(newValue);
    setEditingCell(null);
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingCell(null);
  };

  // Render editable cell
  if (column.editable) {
    return (
      <EditableCell
        value={value}
        editType={column.editType || 'text'}
        editOptions={column.editOptions}
        validationOptions={{}}
        isEditing={isEditingThisCell}
        onStartEdit={handleStartEdit}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        placeholder={`Edit ${column.title.toLowerCase()}`}
      />
    );
  }

  // Render cell content
  const cellContent = column.render ? column.render(value, row) : (value || '—');

  // Determine wrapper styles and tooltip
  const getWrapperProps = () => {
    const baseProps = {
      onClick: clickBehavior !== 'none' ? handleCellClick : undefined,
      style: clickBehavior !== 'none' ? CLICKABLE_CELL_STYLES : undefined
    };

    switch (clickBehavior) {
      case 'select':
        return {
          ...baseProps,
          'aria-label': `Select row ${rowId}`,
          role: 'button',
          tabIndex: 0
        };
      case 'detail':
        return {
          ...baseProps,
          'aria-label': `View details for ${rowId}`,
          role: 'button',
          tabIndex: 0
        };
      default:
        return {
          style: undefined,
          onClick: undefined
        };
    }
  };

  const wrapperProps = getWrapperProps();

  // Render with tooltip if clickable
  const wrappedContent = (
    <Box {...wrapperProps}>
      {cellContent}
    </Box>
  );

  if (clickBehavior === 'none') {
    return wrappedContent;
  }

  const tooltipContent =
    clickBehavior === 'select'
      ? `Click to ${isSelected ? 'deselect' : 'select'} row`
      : 'Click to view details';

  return (
    <Tooltip content={tooltipContent}>
      {wrappedContent}
    </Tooltip>
  );
}