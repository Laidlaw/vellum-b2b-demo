import React from 'react';
import {
  Pagination,
  Select,
  Text,
  InlineStack,
  Box
} from '@shopify/polaris';
import type { PaginationOptions } from './types';

interface TablePaginationProps {
  pagination: PaginationOptions;
}

export function TablePagination({ pagination }: TablePaginationProps) {
  const {
    currentPage,
    pageSize,
    totalItems,
    pageSizeOptions = [10, 25, 50, 100],
    onPageChange,
    onPageSizeChange
  } = pagination;

  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const handlePrevious = () => {
    if (hasPrevious) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onPageChange(currentPage + 1);
    }
  };

  const pageSizeSelectOptions = pageSizeOptions.map(size => ({
    label: `${size} items`,
    value: size.toString()
  }));

  return (
    <Box paddingBlock="400">
      <InlineStack align="space-between" blockAlign="center">
        {/* Items info and page size selector */}
        <InlineStack gap="400" blockAlign="center">
          <Text as="p" variant="bodySm" tone="subdued">
            Showing {startItem}-{endItem} of {totalItems} items
          </Text>
          <InlineStack gap="200" blockAlign="center">
            <Text as="span" variant="bodySm">Items per page:</Text>
            <Box minWidth="120px">
              <Select
                options={pageSizeSelectOptions}
                value={pageSize.toString()}
                onChange={(value) => onPageSizeChange(parseInt(value, 10))}
                size="slim"
              />
            </Box>
          </InlineStack>
        </InlineStack>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <Pagination
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        )}
      </InlineStack>
    </Box>
  );
}