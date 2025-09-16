import { useState } from 'react';
import { TopBar, Frame } from '@shopify/polaris';
import { SettingsIcon, NotificationIcon } from '@shopify/polaris-icons';
import { AppNavigation, createNavigationSections, type AppType } from '../navigation';
import { useLocation, useNavigate } from 'react-router-dom';
import { CommerceTopBar, type Address, type HorizontalNavItem } from './CommerceTopBar';

export interface User {
  name: string;
  detail: string;
  initials: string;
}

export interface AppFrameProps {
  appType: AppType;
  currentUser: User;
  children: React.ReactNode;
  layoutStyle?: 'admin' | 'commerce';
  companyName?: string;
  companyAddress?: Address;
  horizontalNavItems?: HorizontalNavItem[];
  salesChannelsExpanded?: boolean;
  appsExpanded?: boolean;
  customersExpanded?: boolean;
  onToggleSalesChannels?: () => void;
  onToggleApps?: () => void;
  onToggleCustomers?: () => void;
  onUserLogout?: () => void;
}

export function AppFrame({
  appType,
  currentUser,
  children,
  layoutStyle = 'admin',
  companyName,
  companyAddress,
  horizontalNavItems = [],
  salesChannelsExpanded = false,
  appsExpanded = false,
  customersExpanded = false,
  onToggleSalesChannels,
  onToggleApps,
  onToggleCustomers,
  onUserLogout
}: AppFrameProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleMobileNavigationActive = () =>
    setMobileNavigationActive((mobileNavigationActive) => !mobileNavigationActive);

  const toggleUserMenuOpen = () => setUserMenuOpen((open) => !open);

  const userMenuActions = [
    {
      items: [
        { content: 'Profile settings', icon: SettingsIcon },
        { content: 'Help center' },
        { content: 'Sign out', onAction: onUserLogout }
      ]
    }
  ];

  const navigationSections = createNavigationSections(
    appType,
    location.pathname,
    salesChannelsExpanded,
    appsExpanded,
    customersExpanded,
    onToggleSalesChannels,
    onToggleApps,
    onToggleCustomers
  );

  const navigationMarkup = (
    <AppNavigation
      currentPath={location.pathname}
      sections={navigationSections}
      onNavigate={navigate}
    />
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={
        <TopBar.UserMenu
          actions={userMenuActions}
          name={currentUser.name}
          detail={currentUser.detail}
          initials={currentUser.initials}
          open={userMenuOpen}
          onToggle={toggleUserMenuOpen}
        />
      }
      secondaryMenu={
        <TopBar.Menu
          activatorContent={
            <span>
              <NotificationIcon />
            </span>
          }
          open={false}
          onOpen={() => {}}
          onClose={() => {}}
          actions={[
            {
              items: [{ content: 'View all notifications' }],
            },
          ]}
        />
      }
      onNavigationToggle={toggleMobileNavigationActive}
    />
  );

  // Commerce layout: No sidebar, horizontal navigation in top bar
  if (layoutStyle === 'commerce') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fafbfb' }}>
        <CommerceTopBar
          companyName={companyName || 'Commerce Portal'}
          companyAddress={companyAddress}
          horizontalNavItems={horizontalNavItems}
          currentUser={currentUser}
          onNavigate={navigate}
          onUserLogout={onUserLogout}
        />
        <main style={{ padding: '24px' }}>
          {children}
        </main>
      </div>
    );
  }

  // Admin layout: Standard Frame with sidebar navigation
  return (
    <Frame
      topBar={topBarMarkup}
      navigation={navigationMarkup}
      showMobileNavigation={mobileNavigationActive}
      onNavigationDismiss={toggleMobileNavigationActive}
    >
      {children}
    </Frame>
  );
}