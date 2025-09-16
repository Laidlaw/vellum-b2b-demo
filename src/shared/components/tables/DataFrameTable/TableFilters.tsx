import { Tabs, Badge } from '@shopify/polaris';
import type { TableFilter } from './types';

interface TableFiltersProps {
  filters: TableFilter[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

export function TableFilters({ filters, activeFilter, onFilterChange }: TableFiltersProps) {
  const tabs = filters.map(filter => ({
    id: filter.id,
    content: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {filter.label}
        {filter.count !== undefined && (
          <Badge tone={filter.badge ? 'info' : 'subdued'}>
            {filter.count}
          </Badge>
        )}
      </div>
    ),
  }));

  const selectedTab = tabs.findIndex(tab => tab.id === activeFilter);

  return (
    <Tabs
      tabs={tabs}
      selected={selectedTab >= 0 ? selectedTab : 0}
      onSelect={(selectedTabIndex) => {
        const selectedFilter = filters[selectedTabIndex];
        if (selectedFilter) {
          onFilterChange(selectedFilter.id);
        }
      }}
      fitted
    />
  );
}