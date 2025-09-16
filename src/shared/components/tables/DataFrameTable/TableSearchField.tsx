import { useState, useCallback } from 'react';
import { TextField } from '@shopify/polaris';
import { SearchIcon } from '@shopify/polaris-icons';
import { debounce } from '../../../utils';

interface TableSearchFieldProps {
  value?: string;
  placeholder?: string;
  onSearch: (searchTerm: string) => void;
  onClear?: () => void;
  debounceMs?: number;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function TableSearchField({
  value = '',
  placeholder = 'Search...',
  onSearch,
  onClear,
  debounceMs = 300,
  disabled = false,
  autoFocus = false
}: TableSearchFieldProps) {
  const [localValue, setLocalValue] = useState(value);

  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      onSearch(searchTerm);
    }, debounceMs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onSearch, debounceMs]
  );

  const handleChange = useCallback((newValue: string) => {
    setLocalValue(newValue);
    debouncedSearch(newValue);
  }, [debouncedSearch]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    onSearch('');
    onClear?.();
  }, [onSearch, onClear]);

  return (
    <TextField
      label=""
      labelHidden
      value={localValue}
      onChange={handleChange}
      placeholder={placeholder}
      prefix={<SearchIcon />}
      clearButton={localValue.length > 0}
      onClearButtonClick={handleClear}
      disabled={disabled}
      autoComplete="off"
      autoFocus={autoFocus}
    />
  );
}