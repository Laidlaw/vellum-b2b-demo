# Vellum B2B Demo Application

A comprehensive React-based B2B demo application built with Shopify Polaris components, featuring three distinct user interfaces for different personas in the B2B workflow.

## 🎯 Overview

This application demonstrates a complete B2B e-commerce solution with three main applications:

1. **Storefront** (`/storefront/*`) - B2B shopper interface for browsing products, managing carts, and creating quotes
2. **Customer Admin** (`/customer-admin/*`) - Supervisor dashboard for approving quotes, managing users, and company operations  
3. **Merchant Portal** (`/merchant-portal/*`) - Shopify merchant interface for managing B2B companies and relationships

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

## 📋 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checks
- `npm test` - Run tests (placeholder)

## 🏗️ Architecture

### Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **UI Components**: Shopify Polaris (latest)
- **Routing**: React Router v7
- **State Management**: Zustand + React Query
- **Mock API**: MSW (Mock Service Worker) + Faker.js
- **Styling**: Polaris CSS + built-in component styles

### Project Structure

```
src/
├── apps/                    # Three main applications
│   ├── storefront/         # B2B shopper interface
│   ├── customer-admin/     # Supervisor/admin interface  
│   └── merchant-portal/    # Merchant dashboard
├── shared/
│   ├── components/         # Reusable Polaris components
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   ├── stores/            # Zustand stores
│   └── utils/             # Helper functions
├── data/
│   ├── mock/              # Static mock data & generators
│   └── api/               # MSW API handlers
└── assets/                # Images, icons, etc.
```

## 🔗 Navigation

The app uses client-side routing with the following main routes:

- `/` - Redirects to storefront
- `/storefront/*` - B2B shopper experience  
- `/customer-admin/*` - Supervisor dashboard
- `/merchant-portal/*` - Merchant interface

Each application has its own internal routing structure with dedicated pages and flows.

## 📊 Data Model

Key entities include:

- **Product** - Inventory items with volume pricing, reviews, specifications
- **Quote** - B2B quote requests with approval workflow
- **Company** - B2B customer organizations with users and addresses
- **User** - Individual users with roles and permissions
- **ShoppingCart** - Cart management with bulk operations

## 🎨 Design System

Built with Shopify Polaris components following modern design patterns:

- **Layout**: Uses `BlockStack` and `InlineStack` (not deprecated `Stack`)
- **Navigation**: Consistent page headers with back actions
- **Forms**: Polaris form components with validation
- **Tables**: Resource lists for data display
- **Cards**: Content organization and grouping

## 🧪 Mock Data

The application uses MSW for realistic API simulation:

- **Faker.js** generates realistic B2B data (companies, products, quotes)
- **Static seed data** ensures consistent demo experience
- **API handlers** simulate real backend responses with pagination
- **Service worker** intercepts requests in development

## 🚧 Development Status

**Current Status**: Initial setup complete ✅

### Implemented
- ✅ Project structure and build configuration
- ✅ TypeScript interfaces for all entities  
- ✅ Mock data generators with realistic B2B data
- ✅ MSW API handlers with pagination
- ✅ Basic routing structure for all three apps
- ✅ Polaris integration with proper theming

### Next Steps
- [ ] Implement storefront product catalog
- [ ] Build quote management workflows
- [ ] Add customer admin interfaces
- [ ] Create merchant portal features
- [ ] Implement state management
- [ ] Add form validation and error handling

## 📝 Contributing

See `CLAUDE.md` for development guidelines, coding patterns, and Claude-specific instructions.

## 🎯 Goals

This demo is designed to:

- Showcase realistic B2B e-commerce workflows
- Demonstrate Shopify Polaris component usage
- Provide a foundation for production development
- Enable easy feature expansion and customization

The codebase emphasizes clean architecture, TypeScript safety, and modern React patterns to ensure maintainability and scalability.
