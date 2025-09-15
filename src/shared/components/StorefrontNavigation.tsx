import {
  TopBar,
  Navigation,
  Frame,
  InlineStack,
  Button,
  Badge,
  Avatar,
  ActionList
} from '@shopify/polaris';
import {
  HomeIcon,
  ProductIcon,
  CartIcon,
  ContractIcon,
  SearchIcon,
  PersonAddIcon,
  ExitIcon
} from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';
import type { ProductCategory, User, ShoppingCart } from '../types';

interface StorefrontNavigationProps {
  currentUser?: User | null;
  cart?: ShoppingCart | null;
  categories: ProductCategory[];
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout?: () => void;
  children: React.ReactNode;
}

export function StorefrontNavigation({
  currentUser,
  cart,
  categories,
  currentPath,
  onNavigate,
  onLogout,
  children
}: StorefrontNavigationProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const toggleUserMenu = useCallback(
    () => setIsUserMenuOpen((isUserMenuOpen) => !isUserMenuOpen),
    []
  );

  const toggleMobileNavigation = useCallback(
    () => setMobileNavigationActive(
      (mobileNavigationActive) => !mobileNavigationActive
    ),
    []
  );

  const toggleSearchActive = useCallback(
    () => setIsSearchActive((isSearchActive) => !isSearchActive),
    []
  );

  // const handleSearchSubmit = useCallback(() => {
  //   // Handle search functionality
  //   console.log('Search for:', searchValue);
  //   setIsSearchActive(false);
  // }, [searchValue]);

  const cartItemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={[
        {
          items: [
            { content: 'Account Settings', icon: PersonAddIcon },
            { content: 'Order History', icon: ProductIcon },
            { content: 'My Quotes', icon: ContractIcon },
            { content: 'Sign Out', icon: ExitIcon, onAction: onLogout }
          ]
        }
      ]}
      name={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest'}
      detail={currentUser?.email}
      avatar={
        <Avatar
          customer
          size="small"
          name={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest'}
        />
      }
      open={isUserMenuOpen}
      onToggle={toggleUserMenu}
    />
  );

  const searchFieldMarkup = (
    <TopBar.SearchField
      onChange={setSearchValue}
      value={searchValue}
      placeholder="Search products..."
      showFocusBorder
    />
  );

  const searchResultsMarkup = (
    <ActionList
      items={[
        { content: 'Safety Helmets', onAction: () => onNavigate('/storefront/products?search=helmets') },
        { content: 'Work Gloves', onAction: () => onNavigate('/storefront/products?search=gloves') },
        { content: 'Steel Toe Boots', onAction: () => onNavigate('/storefront/products?search=boots') }
      ]}
    />
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      searchResultsVisible={isSearchActive}
      searchField={searchFieldMarkup}
      searchResults={searchResultsMarkup}
      onSearchResultsDismiss={toggleSearchActive}
      onNavigationToggle={toggleMobileNavigation}
      secondaryMenu={
        <InlineStack gap="200" blockAlign="center">
          <Button
            variant="tertiary"
            icon={CartIcon}
            onClick={() => onNavigate('/storefront/cart')}
          >
            Cart {cartItemCount > 0 && <Badge status="new">{cartItemCount}</Badge>}
          </Button>
        </InlineStack>
      }
    />
  );

  // Build navigation items
  const navigationItems = [
    {
      label: 'Home',
      icon: HomeIcon,
      selected: currentPath === '/storefront',
      onClick: () => onNavigate('/storefront')
    },
    {
      label: 'All Products',
      icon: ProductIcon,
      selected: currentPath.startsWith('/storefront/products'),
      onClick: () => onNavigate('/storefront/products')
    },
    {
      label: 'Shopping Cart',
      icon: CartIcon,
      selected: currentPath === '/storefront/cart',
      badge: cartItemCount > 0 ? cartItemCount.toString() : undefined,
      onClick: () => onNavigate('/storefront/cart')
    },
    {
      label: 'My Quotes',
      icon: ContractIcon,
      selected: currentPath.startsWith('/storefront/quotes'),
      onClick: () => onNavigate('/storefront/quotes')
    }
  ];

  // Add category navigation if categories exist
  if (categories.length > 0) {
    const categoryNavItems = categories
      .filter(cat => cat.isActive)
      .slice(0, 8) // Limit to prevent overwhelming navigation
      .map(category => ({
        label: category.name,
        selected: currentPath.includes(`category=${category.id}`),
        onClick: () => onNavigate(`/storefront/products?category=${category.id}`)
      }));

    if (categoryNavItems.length > 0) {
      navigationItems.push({
        label: 'Categories',
        icon: ProductIcon,
        selected: false,
        subNavigationItems: categoryNavItems
      });
    }
  }

  const navigationMarkup = (
    <Navigation location={currentPath}>
      <Navigation.Section
        items={navigationItems}
      />

      {/* Quick Actions Section */}
      <Navigation.Section
        title="Quick Actions"
        items={[
          {
            label: 'Search Products',
            icon: SearchIcon,
            onClick: toggleSearchActive
          }
        ]}
      />
    </Navigation>
  );

  return (
    <Frame
      topBar={topBarMarkup}
      navigation={navigationMarkup}
      showMobileNavigation={mobileNavigationActive}
      onNavigationDismiss={toggleMobileNavigation}
      skipToContentTarget="#main-content"
    >
      <div id="main-content">
        {children}
      </div>
    </Frame>
  );
}