import {
  HomeIcon,
  OrderIcon,
  ProductIcon,
  PersonFilledIcon,
  SettingsIcon,
  TargetFilledIcon,
  DiscountIcon,
  ContentIcon,
  ChartVerticalFilledIcon,
  MarketsIcon,
  FinanceIcon,
  PersonIcon,
  PaymentIcon,
  ContractIcon,
} from '@shopify/polaris-icons';
import type { NavigationItemData } from './NavigationItem';
import type { HorizontalNavItem } from '../layout/CommerceTopBar';

export interface NavigationSection {
  title?: string;
  items: NavigationItemData[];
  expandable?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
  separator?: boolean;
}

// App-specific navigation configurations
export type AppType = 'merchant-portal' | 'customer-admin' | 'storefront';

// Base navigation item creator
export function createMainNavigationItems(
  appType: AppType,
  currentPath: string,
  customersExpanded: boolean = false,
  onToggleCustomers?: () => void
): NavigationItemData[] {

  switch (appType) {
    case 'merchant-portal':
      return [
        {
          label: 'Home',
          icon: HomeIcon,
          path: '/merchant-portal',
          selected: currentPath === '/merchant-portal',
        },
        {
          label: 'Orders',
          icon: OrderIcon,
          path: '/merchant-portal/orders',
          selected: currentPath.startsWith('/merchant-portal/orders'),
          badge: '4',
        },
        {
          label: 'Products',
          icon: ProductIcon,
          path: '/merchant-portal/products',
          selected: currentPath.startsWith('/merchant-portal/products'),
        },
        {
          label: 'Customers',
          icon: PersonFilledIcon,
          path: '/merchant-portal/customers',
          selected: currentPath.startsWith('/merchant-portal/customers'),
          onToggle: onToggleCustomers,
          subItems: [
            {
              label: 'Segments',
              path: '/merchant-portal/customers/segments',
              selected: currentPath.startsWith('/merchant-portal/customers/segments'),
            },
            {
              label: 'Companies',
              path: '/merchant-portal/customers/companies',
              selected: currentPath.startsWith('/merchant-portal/customers/companies'),
            },
          ],
        },
        {
          label: 'Marketing',
          icon: TargetFilledIcon,
          path: '/merchant-portal/marketing',
          selected: currentPath.startsWith('/merchant-portal/marketing'),
        },
        {
          label: 'Discounts',
          icon: DiscountIcon,
          path: '/merchant-portal/discounts',
          selected: currentPath.startsWith('/merchant-portal/discounts'),
        },
        {
          label: 'Content',
          icon: ContentIcon,
          path: '/merchant-portal/content',
          selected: currentPath.startsWith('/merchant-portal/content'),
        },
        {
          label: 'Markets',
          icon: MarketsIcon,
          path: '/merchant-portal/markets',
          selected: currentPath.startsWith('/merchant-portal/markets'),
        },
        {
          label: 'Finance',
          icon: FinanceIcon,
          path: '/merchant-portal/finance',
          selected: currentPath.startsWith('/merchant-portal/finance'),
        },
        {
          label: 'Analytics',
          icon: ChartVerticalFilledIcon,
          path: '/merchant-portal/analytics',
          selected: currentPath.startsWith('/merchant-portal/analytics'),
        },
      ];

    case 'customer-admin':
      return [
        {
          label: 'Dashboard',
          icon: HomeIcon,
          path: '/customer-admin',
          selected: currentPath === '/customer-admin',
        },
        {
          label: 'Quotes',
          icon: ContractIcon,
          path: '/customer-admin/quotes',
          selected: currentPath.startsWith('/customer-admin/quotes'),
        },
        {
          label: 'Orders',
          icon: OrderIcon,
          path: '/customer-admin/orders',
          selected: currentPath.startsWith('/customer-admin/orders'),
        },
        {
          label: 'Invoices',
          icon: PaymentIcon,
          path: '/customer-admin/invoices',
          selected: currentPath.startsWith('/customer-admin/invoices'),
        },
        {
          label: 'Team',
          icon: PersonIcon,
          path: '/customer-admin/users',
          selected: currentPath.startsWith('/customer-admin/users'),
        },
        {
          label: 'Company',
          icon: SettingsIcon,
          path: '/customer-admin/company',
          selected: currentPath.startsWith('/customer-admin/company'),
        },
      ];

    default:
      return [];
  }
}

export function createNavigationSections(
  appType: AppType,
  currentPath: string,
  salesChannelsExpanded: boolean = false,
  appsExpanded: boolean = false,
  customersExpanded: boolean = false,
  onToggleSalesChannels?: () => void,
  onToggleApps?: () => void,
  onToggleCustomers?: () => void
): NavigationSection[] {

  const mainItems = createMainNavigationItems(
    appType,
    currentPath,
    customersExpanded,
    onToggleCustomers
  );

  // Base sections common to all apps
  const sections: NavigationSection[] = [
    {
      items: mainItems,
    },
  ];

  // Add app-specific sections
  if (appType === 'merchant-portal') {
    sections.push(
      {
        title: 'Sales channels',
        items: [],
        expandable: true,
        expanded: salesChannelsExpanded,
        onToggle: onToggleSalesChannels,
      },
      {
        title: 'Apps',
        items: [],
        expandable: true,
        expanded: appsExpanded,
        onToggle: onToggleApps,
      }
    );
  }

  // Settings section (common to all apps)
  sections.push({
    items: [
      {
        label: 'Settings',
        icon: SettingsIcon,
        path: `/${appType.replace('-portal', '').replace('-admin', '')}/settings`,
        selected: currentPath.startsWith(`/${appType.replace('-portal', '').replace('-admin', '')}/settings`),
      },
    ],
    separator: true,
  });

  return sections;
}

/**
 * Create horizontal navigation items for commerce layout
 */
export function createHorizontalNavigation(
  appType: AppType,
  currentPath: string
): HorizontalNavItem[] {
  if (appType === 'customer-admin') {
    return [
      {
        label: 'Shop',
        path: '/storefront',
        active: currentPath.startsWith('/storefront')
      },
      {
        label: 'Orders',
        path: '/customer-admin/orders',
        active: currentPath.startsWith('/customer-admin/orders')
      },
      {
        label: 'Quotes',
        path: '/customer-admin/quotes',
        active: currentPath.startsWith('/customer-admin/quotes')
      },
      {
        label: 'Company',
        path: '/customer-admin/company',
        active: currentPath.startsWith('/customer-admin/company')
      }
    ];
  }

  if (appType === 'merchant-portal') {
    return [
      {
        label: 'Dashboard',
        path: '/merchant-portal',
        active: currentPath === '/merchant-portal'
      },
      {
        label: 'Orders',
        path: '/merchant-portal/orders',
        active: currentPath.startsWith('/merchant-portal/orders')
      },
      {
        label: 'Customers',
        path: '/merchant-portal/customers',
        active: currentPath.startsWith('/merchant-portal/customers')
      },
      {
        label: 'Products',
        path: '/merchant-portal/products',
        active: currentPath.startsWith('/merchant-portal/products')
      }
    ];
  }

  // Storefront - simple navigation
  return [
    {
      label: 'Products',
      path: '/storefront',
      active: currentPath === '/storefront'
    },
    {
      label: 'Quote Builder',
      path: '/storefront/quote-builder',
      active: currentPath.startsWith('/storefront/quote-builder')
    }
  ];
}