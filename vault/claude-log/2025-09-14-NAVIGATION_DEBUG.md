# Navigation Sub-Items Issue Documentation

## Problem Statement
The "Companies" and "Segments" sub-navigation items are NOT appearing in the DOM under the "Customers" parent item, despite multiple implementation attempts.

## What IS Working
1. ✅ Main navigation items (Home, Orders, Products, etc.) render correctly
2. ✅ Main navigation routing works without page reloads
3. ✅ React state management (`customersExpanded`) toggles correctly
4. ✅ The `subItems` array is populated in the config
5. ✅ The `onToggle` function is called when clicking "Customers"
6. ✅ TypeScript compilation passes
7. ✅ React component renders without errors

## What IS NOT Working
1. ❌ `subNavigationItems` do not appear in the rendered DOM
2. ❌ No "Companies" or "Segments" items visible under "Customers"
3. ❌ Polaris Navigation component seems to ignore the `subNavigationItems` property

## Current Implementation Chain
```
navigationConfig.ts -> createMainNavigationItems()
  -> Returns Customers item with subItems array

MerchantNavigation.tsx -> maps items through createNavigationItem()
  -> Passes onNavigate and onToggle to each item

NavigationItem.tsx -> createNavigationItem()
  -> Returns object with subNavigationItems property

Polaris Navigation Component
  -> Should render sub-items but DOESN'T
```

## Core Issue Hypothesis
The Polaris Navigation component's `subNavigationItems` property is either:
1. Not the correct API for sub-navigation
2. Requires different data structure
3. Needs additional configuration
4. Has conditional rendering we're missing

## Current Data Structure Being Passed
```javascript
{
  label: 'Customers',
  icon: PersonFilledIcon,
  onClick: () => { onToggle(); onNavigate('/customers'); },
  subNavigationItems: [
    {
      label: 'Segments',
      onClick: () => onNavigate('/customers/segments'),
      selected: false
    },
    {
      label: 'Companies',
      onClick: () => onNavigate('/customers/companies'),
      selected: false
    }
  ]
}
```

## Attempted Solutions (All Failed)
1. Conditional rendering based on state (subItems: expanded ? [...] : [])
2. Always rendering sub-items (subItems: [...])
3. Adding url + preventDefault() approach
4. Only onClick approach
5. Various TypeScript interface modifications
6. State management with useEffect

## Next Steps Needed
1. Research actual Polaris Navigation subNavigationItems API documentation
2. Find working example of Polaris sub-navigation in real codebase
3. Consider alternative approaches (custom CSS, separate Navigation.Section)
4. Debug what's actually being passed to Polaris component

## Alternative Approach to Consider
Instead of relying on Polaris `subNavigationItems`, manually create a second Navigation.Section that appears/disappears based on state:

```javascript
// Main section
<Navigation.Section items={mainItems} />

// Conditional sub-section
{customersExpanded && (
  <Navigation.Section
    items={[
      { label: 'Segments', onClick: ... },
      { label: 'Companies', onClick: ... }
    ]}
  />
)}
```

This would guarantee the items appear in the DOM and can be controlled with React state.