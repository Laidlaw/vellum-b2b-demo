import { Navigation } from '@shopify/polaris';

export interface SubNavigationItem {
  label: string;
  path: string;
  selected?: boolean;
}

export interface NavigationItemProps {
  label: string;
  icon?: React.ComponentType;
  path?: string;
  badge?: string;
  selected?: boolean;
  subItems?: SubNavigationItem[];
  onNavigate: (path: string) => void;
  onToggle?: () => void;
}

export interface NavigationItemData extends Omit<NavigationItemProps, 'onNavigate'> {}

export function createNavigationItem(
  item: NavigationItemProps
): Navigation['props']['children'][0]['props']['items'][0] {
  const baseItem = {
    label: item.label,
    icon: item.icon,
    selected: item.selected || false,
    badge: item.badge,
  };

  if (item.subItems && item.subItems.length > 0) {
    // Item with sub-navigation
    return {
      ...baseItem,
      onClick: () => {
        if (item.onToggle) item.onToggle();
        if (item.path) item.onNavigate(item.path);
      },
      subNavigationItems: item.subItems.map(subItem => ({
        label: subItem.label,
        onClick: () => item.onNavigate(subItem.path),
        selected: subItem.selected || false,
      })),
    };
  } else if (item.path) {
    // Simple navigation item
    return {
      ...baseItem,
      onClick: () => item.onNavigate(item.path),
    };
  } else {
    // Item without navigation (placeholder)
    return baseItem;
  }
}