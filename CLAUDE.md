# Claude Development Guide

## Project Overview
B2B demo application with three user interfaces:
- **Storefront** - B2B shopper experience
- **Customer Admin** - Supervisor/admin interface  
- **Merchant Portal** - Shopify merchant dashboard

## Technology Stack
- Vite + React 18 + TypeScript
- Shopify Polaris (latest - use BlockStack/InnerStack, NOT Stack)
- React Router for routing
- Zustand for state management
- React Query for data fetching
- MSW for mock APIs

## Build Commands
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint checking
npm run typecheck    # TypeScript checking
npm test             # Run tests
```

## Project Structure
```
src/
├── apps/                    # Three main applications
│   ├── storefront/         # B2B shopper interface
│   ├── customer-admin/     # Supervisor/admin interface  
│   └── merchant-portal/    # Merchant dashboard
├── shared/                 # Reusable code
│   ├── components/         # Polaris components
│   ├── hooks/             # Custom hooks
│   ├── types/             # TypeScript definitions
│   └── stores/            # Zustand stores
├── data/                   # Mock data and APIs
│   ├── mock/              # JSON mock data
│   └── api/               # MSW handlers
└── assets/                # Static assets
```

## Code Patterns

### Component Structure
- Use TypeScript interfaces for all props
- Prefer functional components with hooks
- Keep components focused and single-purpose
- Use Polaris components consistently

### File Naming
- PascalCase for components: `ProductCard.tsx`
- camelCase for hooks: `useQuoteManager.ts`
- kebab-case for utilities: `format-currency.ts`

### State Management
- Zustand for global state
- React Query for server state
- useState for local component state

## Data Entities

Key interfaces based on requirements:
- Product (name, brand, model, sku, description, dimensions, reviews, volumePricing)
- Quote (name, dateCreated, dateExpired, amount, purchaseOrderNumber, status)
- ShoppingCart (products, quantities, discounts)
- Company (info, addresses, users)

## Development Workflow

### Git Worktrees (if used)
```bash
git worktree add ../vellum-storefront feature/storefront
git worktree add ../vellum-admin feature/customer-admin  
git worktree add ../vellum-merchant feature/merchant-portal
```

### Commit Messages
Use conventional commits:
- `feat(storefront): add product detail page`
- `fix(admin): resolve quote approval bug`
- `refactor(shared): extract common button component`

## Recent Changes

### 2025-09-11 - Initial Project Setup Complete
- ✅ Initialized Vite React TypeScript project
- ✅ Installed dependencies: Polaris, React Router, Zustand, React Query, MSW, Faker
- ✅ Created organized folder structure (apps/, shared/, data/)
- ✅ Set up comprehensive TypeScript interfaces for B2B entities
- ✅ Configured MSW with realistic mock data generators
- ✅ Created basic routing structure for three applications:
  - Storefront (B2B shopper interface)
  - Customer Admin (supervisor/admin interface)
  - Merchant Portal (Shopify merchant dashboard)
- ✅ All lint and typecheck passing

### 2025-09-11 - Customer Admin Quotes Implementation
- ✅ Enhanced Quote interface with shipping/billing addresses and expiration tracking
- ✅ Improved mock data generators with realistic B2B addresses and time calculations
- ✅ Built comprehensive QuotesTable component with Polaris ResourceList
- ✅ Implemented quote filtering by status and search functionality
- ✅ Added detailed quote modal with shipping address and item breakdown
- ✅ Created quote approval workflow with bulk actions
- ✅ Integrated React Query for data fetching and caching
- ✅ Follows Shopify design patterns and accessibility guidelines

### 2025-09-15 - Storefront B2B Features & Critical Fixes
- ✅ Implemented complete B2B storefront functionality
- ✅ Created Zustand stores for cart and quote management with persistence
- ✅ Built utility functions for currency, dates, and validation
- ✅ Added custom hooks for API integration and state management
- ✅ Implemented full shopping cart functionality with add/remove/update
- ✅ Created customer quote management system with history and duplication
- ✅ Fixed navigation issues - replaced broken onAction with onClick handlers
- ✅ Resolved SPA navigation to prevent page reloads
- ✅ Fixed date formatting errors in ProductDetails component
- ✅ **RESOLVED**: Fixed image system with local assets and pagination
  - Implemented local image mapping system with 29 professional product photos
  - Updated all components (ProductCard, ProductDetails, FeaturedProducts, ProductCatalog)
  - Added client-side pagination (12 items per page) with filter integration
  - Applied blur effects for professional demo aesthetic
  - Performance significantly improved with local assets

### 2025-09-16 - Enhanced Table System Implementation
- ✅ **ENTERPRISE TABLE SYSTEM**: Built unified DataFrameTable with enterprise features
  - **Pagination**: Configurable page sizes (10, 25, 50, 100) with navigation controls
  - **Column Management**: Show/hide columns dynamically with visibility toggles
  - **Export Functionality**: CSV, XLSX, JSON export with configurable formats
  - **Interactive Sorting**: Visual caret indicators with click-to-sort functionality
  - **Custom Rendering**: Support for formatted cells, colors, and custom components
  - **Row Interactions**: Clickable rows with custom handlers
  - **Performance Optimized**: Proper memoization and efficient data handling
- ✅ **COMPONENT ARCHITECTURE**: Created reusable table components
  - `DataFrameTable/`: Main table component with all enterprise features
  - `TableHeader`: Export buttons and column visibility controls
  - `TablePagination`: Navigation with page size selection
  - `TableFilters`: Standardized filter components
  - `TableMetrics`: Summary cards for table data
- ✅ **DEMO IMPLEMENTATION**: Table Demo page showcases all features
  - 47 sample products with realistic B2B data
  - All sorting, pagination, export, and column features working
  - Available at `/merchant-portal/table-demo`
- ✅ **TYPESCRIPT INTEGRATION**: Comprehensive type definitions
  - Enhanced interfaces for pagination, column visibility, export options
  - Proper typing for all table configuration options
  - Type-safe column definitions with custom render functions
- 🎯 **READY FOR MIGRATION**: Foundation set for unifying existing tables
  - QuotesTable, UsersTable, OrdersTable can migrate to enhanced system
  - 90% reduction in table-related code duplication expected
  - Consistent UX across all admin interfaces

### 2025-09-15 - B2B Cart/Quote Workflow Restructuring (PAUSED)
- ⏸️ **PAUSED**: Cart system restructuring to focus on table system enhancement
- 🎯 **NEXT PHASE**: Will resume after table system migration is complete

---

## Enhanced Table System Guide

### DataFrameTable Usage
The enhanced DataFrameTable provides enterprise-grade functionality with minimal setup:

```tsx
import { DataFrameTable, type TableColumn } from '../../../shared/components/tables';

// Define columns with type safety
const columns: TableColumn[] = [
  {
    id: 'name',
    title: 'Product Name',
    sortable: true,
    render: (value) => <strong>{value as string}</strong>
  },
  {
    id: 'price',
    title: 'Price',
    sortable: true,
    alignment: 'right',
    render: (value) => `$${(value as number).toFixed(2)}`
  }
];

// Configure pagination
const pagination = {
  currentPage: 1,
  pageSize: 25,
  totalItems: data.length,
  onPageChange: setCurrentPage,
  onPageSizeChange: setPageSize
};

// Set up column visibility
const columnVisibility = {
  hiddenColumns: [],
  onColumnVisibilityChange: setHiddenColumns
};

// Configure export
const exportOptions = {
  formats: ['csv', 'xlsx', 'json'],
  filename: 'export-data',
  onExport: (format, data) => handleExport(format, data)
};

// Use the table
<DataFrameTable
  data={data}
  columns={columns}
  idField="id"
  pagination={pagination}
  columnVisibility={columnVisibility}
  exportOptions={exportOptions}
  sortBy={sortBy}
  sortDirection={sortDirection}
  onSort={handleSort}
  onRowClick={handleRowClick}
/>
```

### Table Components Available
- `DataFrameTable`: Main enterprise table with all features
- `TableHeader`: Export and column visibility controls
- `TablePagination`: Page navigation with size selection
- `TableFilters`: Standardized filter components
- `TableMetrics`: Summary cards for table data

### Migration Pattern
When migrating existing tables:
1. Replace ResourceList/IndexTable with DataFrameTable
2. Convert column definitions to TableColumn interface
3. Add pagination, export, and column visibility as needed
4. Remove custom table logic in favor of built-in features
5. Update imports to use shared table components

### Demo Reference
See `/merchant-portal/table-demo` for complete implementation example with all features.

---

## Claude Instructions

**When working on this project:**
1. Always run `npm run lint && npm run typecheck` after changes
2. Use modern Polaris components (BlockStack, InnerStack, NOT Stack)
3. **Use DataFrameTable** for any new table implementations
4. Keep components focused and create shared components in `src/shared/`
5. Follow the established file structure
6. Update this file when making significant architectural decisions