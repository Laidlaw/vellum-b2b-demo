import { useState, useCallback } from 'react';
import {
  InlineStack,
  Select,
  Button,
  Badge,
  Text,
  Box
} from '@shopify/polaris';
import { FilterIcon } from '@shopify/polaris-icons';

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

interface QuickFiltersProps {
  filters: QuickFilter[];
  activeFilters?: ActiveQuickFilter[];
  onFiltersChange: (filters: ActiveQuickFilter[]) => void;
  onClearAll?: () => void;
  data?: Record<string, unknown>[];
}

export function QuickFilters({
  filters,
  activeFilters = [],
  onFiltersChange,
  onClearAll,
  data = []
}: QuickFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  // Get active filter for a specific filter ID
  const getActiveFilter = useCallback((filterId: string) => {
    return activeFilters.find(af => af.filterId === filterId);
  }, [activeFilters]);

  // Handle filter value change
  const handleFilterChange = useCallback((filterId: string, newValue: string) => {
    const updatedFilters = [...activeFilters];
    const existingFilterIndex = updatedFilters.findIndex(af => af.filterId === filterId);

    if (newValue === '') {
      // Remove filter if empty value
      if (existingFilterIndex !== -1) {
        updatedFilters.splice(existingFilterIndex, 1);
      }
    } else {
      // Update or add filter
      if (existingFilterIndex !== -1) {
        updatedFilters[existingFilterIndex].values = [newValue];
      } else {
        updatedFilters.push({
          filterId,
          values: [newValue]
        });
      }
    }

    onFiltersChange(updatedFilters);
  }, [activeFilters, onFiltersChange]);

  // Clear all filters
  const handleClearAll = useCallback(() => {
    onFiltersChange([]);
    onClearAll?.();
  }, [onFiltersChange, onClearAll]);

  // Get count of items that match current filters
  const getFilteredCount = useCallback(() => {
    if (!data.length || !activeFilters.length) return data.length;

    return data.filter(item => {
      return activeFilters.every(activeFilter => {
        const filter = filters.find(f => f.id === activeFilter.filterId);
        if (!filter) return true;

        const itemValue = String(item[filter.field] || '').toLowerCase();
        return activeFilter.values.some(value =>
          itemValue === value.toLowerCase() ||
          itemValue.includes(value.toLowerCase())
        );
      });
    }).length;
  }, [data, activeFilters, filters]);

  // Auto-generate options from data if not provided
  const getFilterOptions = useCallback((filter: QuickFilter): QuickFilterOption[] => {
    if (filter.options.length > 0) {
      return filter.options;
    }

    // Generate options from data
    const uniqueValues = new Set<string>();
    data.forEach(item => {
      const value = item[filter.field];
      if (value !== null && value !== undefined) {
        uniqueValues.add(String(value));
      }
    });

    return Array.from(uniqueValues)
      .sort()
      .map(value => ({
        label: value,
        value: value
      }));
  }, [data]);

  const activeFilterCount = activeFilters.length;
  const filteredCount = getFilteredCount();

  return (
    <Box>
      <InlineStack align="space-between" blockAlign="center">
        <InlineStack gap="300" blockAlign="center">
          <Button
            icon={FilterIcon}
            onClick={() => setShowFilters(!showFilters)}
            pressed={showFilters}
            size="medium"
          >
            Filters
            {activeFilterCount > 0 && (
              <Badge tone="info">{activeFilterCount}</Badge>
            )}
          </Button>

          {activeFilterCount > 0 && (
            <Button
              variant="plain"
              onClick={handleClearAll}
              size="medium"
            >
              Clear all
            </Button>
          )}
        </InlineStack>

        {data.length > 0 && (
          <Text as="span" variant="bodyMd" tone="subdued">
            {filteredCount} of {data.length} items
          </Text>
        )}
      </InlineStack>

      {showFilters && (
        <Box paddingBlockStart="400">
          <InlineStack gap="300" wrap>
            {filters.map(filter => {
              const options = getFilterOptions(filter);
              const activeFilter = getActiveFilter(filter.id);
              const currentValue = activeFilter?.values[0] || '';

              const selectOptions = [
                { label: filter.placeholder || `All ${filter.label}`, value: '' },
                ...options
              ];

              return (
                <Box key={filter.id} minWidth="200px">
                  <Select
                    label={filter.label}
                    labelHidden
                    placeholder={filter.placeholder || `Filter by ${filter.label.toLowerCase()}`}
                    options={selectOptions}
                    value={currentValue}
                    onChange={(value) => handleFilterChange(filter.id, value)}
                  />
                </Box>
              );
            })}
          </InlineStack>

          {activeFilterCount > 0 && (
            <Box paddingBlockStart="300">
              <InlineStack gap="200" wrap>
                <Text as="span" variant="bodyMd" fontWeight="medium">
                  Active filters:
                </Text>
                {activeFilters.map(activeFilter => {
                  const filter = filters.find(f => f.id === activeFilter.filterId);
                  if (!filter) return null;

                  return activeFilter.values.map(value => (
                    <Badge
                      key={`${activeFilter.filterId}-${value}`}
                      tone="info"
                    >
                      {filter.label}: {value}
                    </Badge>
                  ));
                })}
              </InlineStack>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}