import { useState, useEffect, useRef } from 'react';
import {
  TextField,
  Select,
  InlineStack,
  Button,
  Text,
  Box,
  Tooltip
} from '@shopify/polaris';
import { CheckIcon, XIcon } from '@shopify/polaris-icons';
import { validateCellEdit } from '../../../utils/table';
import type { EditValidationOptions } from '../../../utils/table';

interface EditableCellProps {
  value: unknown;
  editType: 'text' | 'number' | 'select' | 'date';
  editOptions?: { label: string; value: string }[];
  validationOptions?: EditValidationOptions;
  isEditing: boolean;
  onStartEdit: () => void;
  onSave: (newValue: unknown) => void;
  onCancel: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function EditableCell({
  value,
  editType,
  editOptions = [],
  validationOptions = {},
  isEditing,
  onStartEdit,
  onSave,
  onCancel,
  disabled = false,
  placeholder
}: EditableCellProps) {
  const [editValue, setEditValue] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setEditValue(value);
      setError(null);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    }
  }, [isEditing, value]);

  const handleSave = () => {
    const validationError = validateCellEdit(editValue, editType, validationOptions);
    if (validationError) {
      setError(validationError);
      return;
    }

    let processedValue = editValue;

    // Type conversion based on editType
    switch (editType) {
      case 'number':
        processedValue = Number(editValue);
        break;
      case 'date':
        if (editValue) {
          processedValue = new Date(editValue as string).toISOString();
        }
        break;
    }

    onSave(processedValue);
    setError(null);
  };

  const handleCancel = () => {
    setEditValue(value);
    setError(null);
    onCancel();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSave();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      handleCancel();
    }
  };

  const displayValue = () => {
    if (value === null || value === undefined || value === '') {
      return <Text tone="subdued">—</Text>;
    }

    switch (editType) {
      case 'date':
        return new Date(value as string).toLocaleDateString();
      default:
        return String(value);
    }
  };

  if (!isEditing) {
    return (
      <Box
        onClick={disabled ? undefined : onStartEdit}
        style={{
          cursor: disabled ? 'default' : 'pointer',
          minHeight: '20px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {disabled ? (
          displayValue()
        ) : (
          <Tooltip content="Click to edit">
            {displayValue()}
          </Tooltip>
        )}
      </Box>
    );
  }

  return (
    <Box>
      <InlineStack gap="200" align="start">
        <Box minWidth="120px">
          {editType === 'select' ? (
            <Select
              options={editOptions}
              value={String(editValue || '')}
              onChange={setEditValue}
              placeholder={placeholder}
              autoFocus
            />
          ) : (
            <TextField
              ref={inputRef}
              value={String(editValue || '')}
              onChange={setEditValue}
              onKeyDown={handleKeyDown}
              type={editType === 'number' ? 'number' : editType === 'date' ? 'date' : 'text'}
              placeholder={placeholder}
              error={error || undefined}
              autoComplete="off"
              autoFocus
            />
          )}
        </Box>
        <InlineStack gap="100">
          <Button
            size="micro"
            variant="primary"
            icon={CheckIcon}
            onClick={handleSave}
            accessibilityLabel="Save changes"
          />
          <Button
            size="micro"
            icon={XIcon}
            onClick={handleCancel}
            accessibilityLabel="Cancel changes"
          />
        </InlineStack>
      </InlineStack>
      {error && (
        <Box paddingBlockStart="100">
          <Text as="p" variant="bodySm" tone="critical">
            {error}
          </Text>
        </Box>
      )}
    </Box>
  );
}