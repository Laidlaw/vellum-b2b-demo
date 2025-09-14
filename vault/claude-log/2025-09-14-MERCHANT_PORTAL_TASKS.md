# Merchant Portal UI Implementation Tasks

## Navigation System

### Left Sidebar Navigation
- [ ] **Primary Navigation Structure**
  - [ ] Implement grouped navigation sections
  - [ ] Add icons for all navigation items
  - [ ] Create hover states with rounded background highlighting
  - [ ] Implement active/selected states

- [ ] **Navigation Features**
  - [ ] Add count badges (e.g., Orders: 4)
  - [ ] Implement sub-navigation (Customers → Segments, Companies)
  - [ ] Create expandable sections with carets (Sales channels, Apps)
  - [ ] Fix Settings at bottom of navigation
  - [ ] Add proper spacing and visual hierarchy

### Navigation Items to Implement
- [ ] Home
- [ ] Orders (with count badge)
- [ ] Products
- [ ] Customers (with sub-nav: Segments, Companies)
- [ ] Marketing
- [ ] Discounts
- [ ] Content
- [ ] Markets
- [ ] Finance
- [ ] Analytics
- [ ] Sales channels (expandable)
- [ ] Apps (expandable)
- [ ] Settings (fixed bottom)

## Page Layout Components

### Page Headers
- [ ] **Standard Page Header Pattern**
  - [ ] Page title with icon
  - [ ] Action buttons on the right (Add company, Create order, etc.)
  - [ ] Consistent spacing and alignment

- [ ] **Filter Controls**
  - [ ] Location filter dropdown (e.g., "All locations")
  - [ ] "Add filter" functionality with dropdown
  - [ ] Search functionality
  - [ ] Export/Import buttons where relevant

### Tab Navigation
- [ ] **Status-based Tabs**
  - [ ] Implement tab switching (All, Ordering approved, etc.)
  - [ ] Add proper active states
  - [ ] Make tabs contextual to each page

## Data Display Components

### Resource Tables
- [ ] **Table Features**
  - [ ] Sortable columns with indicators
  - [ ] Bulk selection with checkboxes
  - [ ] Status badges (Approved, Payment pending, etc.)
  - [ ] Proper column alignment and spacing

- [ ] **Table Actions**
  - [ ] Row-level actions
  - [ ] Bulk actions
  - [ ] "More actions" dropdown menus

### Status System
- [ ] **Status Badges**
  - [ ] Color-coded status indicators
  - [ ] Consistent badge styling across pages
  - [ ] Proper semantic colors (green=approved, yellow=pending, etc.)

### Summary Cards/Metrics
- [ ] **Statistics Display**
  - [ ] Summary cards for key metrics
  - [ ] Proper number formatting
  - [ ] Time period controls where relevant

## Detailed Views

### Company/Customer Detail Views
- [ ] **Right Sidebar Information Panel**
  - [ ] Company status and approval state
  - [ ] Customer information display
  - [ ] Assigned staff section
  - [ ] Markets and location info
  - [ ] Payment terms and checkout settings
  - [ ] Notes section with edit capability

- [ ] **Main Content Areas**
  - [ ] Orders table with filtering
  - [ ] Locations management
  - [ ] Metafields section
  - [ ] Custom field management

## Interactive Elements

### Buttons and Actions
- [ ] **Primary Actions**
  - [ ] "Add company", "Create order" style buttons
  - [ ] "More actions" dropdown implementation
  - [ ] Edit icons for inline editing

### Dropdowns and Filters
- [ ] **Filter System**
  - [ ] Multi-select filter dropdowns
  - [ ] Search within filters
  - [ ] Clear filter functionality

### Modal/Overlay Patterns
- [ ] **Detail Modals**
  - [ ] Company detail overlays
  - [ ] Order detail views
  - [ ] Proper modal sizing and positioning

## Responsive Behavior
- [ ] **Mobile/Tablet Adaptations**
  - [ ] Collapsible sidebar for smaller screens
  - [ ] Responsive table layouts
  - [ ] Touch-friendly interaction areas

## Polish and Consistency

### Visual Design
- [ ] **Spacing and Typography**
  - [ ] Consistent margin/padding system
  - [ ] Proper text hierarchy
  - [ ] Icon consistency and sizing

### Micro-interactions
- [ ] **Hover and Focus States**
  - [ ] Smooth transitions
  - [ ] Proper focus management
  - [ ] Loading states for actions

### Accessibility
- [ ] **A11y Requirements**
  - [ ] Keyboard navigation
  - [ ] Screen reader compatibility
  - [ ] Proper ARIA labels
  - [ ] Color contrast compliance

## Data Integration

### Mock Data Enhancement
- [ ] **Realistic Data**
  - [ ] Company data with proper relationships
  - [ ] Order data with statuses and workflows
  - [ ] User assignment and staff data

### State Management
- [ ] **Filters and Search**
  - [ ] Persistent filter states
  - [ ] URL-based navigation state
  - [ ] Search query management

## Priority Implementation Order

### Phase 1: Foundation
1. Left navigation structure and styling
2. Basic page headers and layouts
3. Navigation hover/active states

### Phase 2: Core Components
1. Resource tables with sorting/filtering
2. Status badge system
3. Action buttons and dropdowns

### Phase 3: Advanced Features
1. Detail panels and modals
2. Bulk actions and selection
3. Advanced filtering system

### Phase 4: Polish
1. Micro-interactions and animations
2. Responsive behavior
3. Accessibility improvements

## Notes for Implementation

- Use Shopify Polaris components where possible
- Follow existing project patterns from customer-admin
- Maintain consistency with existing TypeScript interfaces
- Test with realistic B2B merchant data scenarios
- Consider performance with large datasets (hundreds of companies/orders)

---

*This task list should be updated as requirements evolve and new patterns are discovered.*