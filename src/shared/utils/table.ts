import { debounce } from './index';

export interface SortOptions {
  column: string;
  direction: 'asc' | 'desc';
}

export interface SearchOptions {
  searchTerm: string;
  searchFields?: string[];
  caseSensitive?: boolean;
}

export interface PaginationResult<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export interface ExportConfig {
  filename?: string;
  includeHeaders?: boolean;
  columnMapping?: Record<string, string>;
  excludeColumns?: string[];
}

export function sortData<T extends Record<string, unknown>>(
  data: T[],
  options: SortOptions
): T[] {
  const { column, direction } = options;

  return [...data].sort((a, b) => {
    const aValue = a[column];
    const bValue = b[column];

    if (aValue === null || aValue === undefined) {
      return direction === 'asc' ? 1 : -1;
    }

    if (bValue === null || bValue === undefined) {
      return direction === 'asc' ? -1 : 1;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const result = aValue.localeCompare(bValue, undefined, {
        numeric: true,
        sensitivity: 'base'
      });
      return direction === 'asc' ? result : -result;
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      const result = aValue - bValue;
      return direction === 'asc' ? result : -result;
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      const result = aValue.getTime() - bValue.getTime();
      return direction === 'asc' ? result : -result;
    }

    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      const result = Number(aValue) - Number(bValue);
      return direction === 'asc' ? result : -result;
    }

    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();
    const result = aStr.localeCompare(bStr);
    return direction === 'asc' ? result : -result;
  });
}

export function filterData<T extends Record<string, unknown>>(
  data: T[],
  options: SearchOptions
): T[] {
  const { searchTerm, searchFields, caseSensitive = false } = options;

  if (!searchTerm.trim()) {
    return data;
  }

  const normalizedSearchTerm = caseSensitive
    ? searchTerm.trim()
    : searchTerm.trim().toLowerCase();

  return data.filter(item => {
    const fieldsToSearch = searchFields || Object.keys(item);

    return fieldsToSearch.some(field => {
      const value = item[field];

      if (value === null || value === undefined) {
        return false;
      }

      const stringValue = String(value);
      const normalizedValue = caseSensitive
        ? stringValue
        : stringValue.toLowerCase();

      return normalizedValue.includes(normalizedSearchTerm);
    });
  });
}

export function paginateData<T>(
  data: T[],
  currentPage: number,
  pageSize: number
): PaginationResult<T> {
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    totalItems,
    currentPage,
    pageSize,
    totalPages
  };
}

export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  config: ExportConfig = {}
): string {
  const {
    includeHeaders = true,
    columnMapping = {},
    excludeColumns = []
  } = config;

  if (data.length === 0) {
    return '';
  }

  const firstRow = data[0];
  const columns = Object.keys(firstRow).filter(col => !excludeColumns.includes(col));

  const rows: string[] = [];

  if (includeHeaders) {
    const headers = columns.map(col => columnMapping[col] || col);
    rows.push(headers.map(header => `"${header}"`).join(','));
  }

  data.forEach(row => {
    const values = columns.map(col => {
      const value = row[col];
      if (value === null || value === undefined) {
        return '""';
      }
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    rows.push(values.join(','));
  });

  return rows.join('\n');
}

export function exportToJSON<T extends Record<string, unknown>>(
  data: T[],
  config: ExportConfig = {}
): string {
  const { columnMapping = {}, excludeColumns = [] } = config;

  const processedData = data.map(row => {
    const newRow: Record<string, unknown> = {};

    Object.keys(row).forEach(key => {
      if (!excludeColumns.includes(key)) {
        const newKey = columnMapping[key] || key;
        newRow[newKey] = row[key];
      }
    });

    return newRow;
  });

  return JSON.stringify(processedData, null, 2);
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportData<T extends Record<string, unknown>>(
  data: T[],
  format: 'csv' | 'json',
  config: ExportConfig = {}
): void {
  const { filename = 'export' } = config;

  let content: string;
  let mimeType: string;
  let fileExtension: string;

  switch (format) {
    case 'csv':
      content = exportToCSV(data, config);
      mimeType = 'text/csv';
      fileExtension = 'csv';
      break;
    case 'json':
      content = exportToJSON(data, config);
      mimeType = 'application/json';
      fileExtension = 'json';
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }

  const fullFilename = `${filename}.${fileExtension}`;
  downloadFile(content, fullFilename, mimeType);
}

export const debouncedSearch = <T extends Record<string, unknown>>(
  data: T[],
  options: SearchOptions,
  callback: (filteredData: T[]) => void,
  delay: number = 300
) => {
  const debouncedFunction = debounce((searchOptions: SearchOptions) => {
    const filtered = filterData(data, searchOptions);
    callback(filtered);
  }, delay);

  return (searchTerm: string) => {
    debouncedFunction({ ...options, searchTerm });
  };
};

export interface QuickFilterConstraint {
  field: string;
  values: string[];
}

export function combineFilters<T extends Record<string, unknown>>(
  data: T[],
  filters: {
    search?: SearchOptions;
    sort?: SortOptions;
    quickFilters?: QuickFilterConstraint[];
    customFilters?: Array<(item: T) => boolean>;
  }
): T[] {
  let result = [...data];

  if (filters.customFilters) {
    filters.customFilters.forEach(filterFn => {
      result = result.filter(filterFn);
    });
  }

  if (filters.quickFilters && filters.quickFilters.length > 0) {
    result = result.filter(item => {
      return filters.quickFilters!.every(quickFilter => {
        const itemValue = String(item[quickFilter.field] || '').toLowerCase();
        return quickFilter.values.some(filterValue =>
          itemValue === filterValue.toLowerCase() ||
          itemValue.includes(filterValue.toLowerCase())
        );
      });
    });
  }

  if (filters.search) {
    result = filterData(result, filters.search);
  }

  if (filters.sort) {
    result = sortData(result, filters.sort);
  }

  return result;
}