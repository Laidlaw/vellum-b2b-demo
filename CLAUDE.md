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

---

## Claude Instructions

**When working on this project:**
1. Always run `npm run lint && npm run typecheck` after changes
2. Use modern Polaris components (BlockStack, InnerStack, NOT Stack)
3. Keep components focused and create shared components in `src/shared/`
4. Follow the established file structure
5. Update this file when making significant architectural decisions