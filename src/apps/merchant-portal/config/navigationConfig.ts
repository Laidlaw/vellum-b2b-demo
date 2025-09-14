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
  ChevronDownIcon,
  ChevronRightIcon,
} from '@shopify/polaris-icons';
import type { NavigationItemData } from '../components/NavigationItem';

export interface NavigationSection {
  title?: string;
  items: NavigationItemData[];
  expandable?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
  separator?: boolean;
}

export function createMainNavigationItems(currentPath: string, customersExpanded: boolean, onToggleCustomers: () => void): NavigationItemData[] {
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
}

export function createNavigationSections(
  currentPath: string,
  salesChannelsExpanded: boolean,
  appsExpanded: boolean,
  customersExpanded: boolean,
  onToggleSalesChannels: () => void,
  onToggleApps: () => void,
  onToggleCustomers: () => void
): NavigationSection[] {
  return [
    {
      items: createMainNavigationItems(currentPath, customersExpanded, onToggleCustomers),
    },
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
    },
    {
      items: [
        {
          label: 'Settings',
          icon: SettingsIcon,
          path: '/merchant-portal/settings',
          selected: currentPath.startsWith('/merchant-portal/settings'),
        },
      ],
      separator: true,
    },
  ];
}