import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ActionList,
  Button,
  InlineStack,
  Text,
  Box,
  Popover,
  Badge,
  Avatar
} from '@shopify/polaris';
import {
  NotificationIcon,
  ExternalSmallIcon,
  HomeIcon
} from '@shopify/polaris-icons';

interface CustomerAdminLayoutProps {
  children: React.ReactNode;
}

// Mock company data - in a real app this would come from an API
const COMPANY_DATA = {
  name: 'Acme Industrial Solutions',
  industry: 'Manufacturing',
  plan: 'Enterprise',
  logo: null, // Would be a URL in production
  currentUser: {
    name: 'Sarah Chen',
    role: 'Account Administrator',
    email: 'sarah.chen@acme-industrial.com',
    initials: 'SC'
  }
};

const navigationItems = [
  { label: 'Dashboard', path: '/customer-admin', icon: HomeIcon },
  { label: 'Quotes', path: '/customer-admin/quotes' },
  { label: 'Orders', path: '/customer-admin/orders' },
  { label: 'Invoices', path: '/customer-admin/invoices' },
  { label: 'Team', path: '/customer-admin/users' },
  { label: 'Company', path: '/customer-admin/company' }
];

export default function CustomerAdminLayout({ children }: CustomerAdminLayoutProps) {
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);

  const toggleUserMenu = () => setUserMenuOpen(prev => !prev);
  const toggleNotificationMenu = () => setNotificationMenuOpen(prev => !prev);

  const userMenuActions = [
    {
      content: 'Profile settings',
      onAction: () => {
        setUserMenuOpen(false);
        // Navigate to profile settings
      }
    },
    {
      content: 'Account preferences',
      onAction: () => {
        setUserMenuOpen(false);
        // Navigate to account preferences
      }
    },
    {
      content: 'Help & support',
      onAction: () => {
        setUserMenuOpen(false);
        // Navigate to help
      }
    },
    { content: '-' },
    {
      content: 'Sign out',
      onAction: () => {
        setUserMenuOpen(false);
        // Handle sign out
      }
    }
  ];

  const notificationActions = [
    {
      content: 'Quote #Q-2024-0156 requires approval',
      onAction: () => {
        setNotificationMenuOpen(false);
        // Navigate to specific quote
      }
    },
    {
      content: 'Order #ORD-4821 has shipped',
      onAction: () => {
        setNotificationMenuOpen(false);
        // Navigate to order tracking
      }
    },
    {
      content: 'Invoice #INV-2024-0089 is due in 3 days',
      onAction: () => {
        setNotificationMenuOpen(false);
        // Navigate to invoice
      }
    },
    {
      content: 'New team member Emily Johnson added',
      onAction: () => {
        setNotificationMenuOpen(false);
        // Navigate to team
      }
    },
    { content: '-' },
    {
      content: 'View all notifications',
      onAction: () => {
        setNotificationMenuOpen(false);
        // Navigate to notifications page
      }
    },
    {
      content: 'Mark all as read',
      onAction: () => {
        setNotificationMenuOpen(false);
        // Mark all as read
      }
    }
  ];

  const userMenuMarkup = (
    <Popover
      active={userMenuOpen}
      activator={
        <Button
          onClick={toggleUserMenu}
          disclosure
          variant="tertiary"
          size="large"
        >
          <InlineStack gap="200" align="center">
            <Avatar
              size="small"
              name={COMPANY_DATA.currentUser.name}
              initials={COMPANY_DATA.currentUser.initials}
            />
            <Box>
              <Text as="span" variant="bodySm" fontWeight="medium">
                {COMPANY_DATA.currentUser.name}
              </Text>
            </Box>
          </InlineStack>
        </Button>
      }
      onClose={() => setUserMenuOpen(false)}
    >
      <Box padding="200">
        <Text as="p" variant="bodyMd" fontWeight="semibold">
          {COMPANY_DATA.currentUser.name}
        </Text>
        <Text as="p" variant="bodySm" tone="subdued">
          {COMPANY_DATA.currentUser.role}
        </Text>
        <Text as="p" variant="bodySm" tone="subdued">
          {COMPANY_DATA.currentUser.email}
        </Text>
      </Box>
      <ActionList items={userMenuActions} />
    </Popover>
  );

  const notificationMenuMarkup = (
    <Box position="relative">
      <Popover
        active={notificationMenuOpen}
        activator={
          <Button
            onClick={toggleNotificationMenu}
            icon={NotificationIcon}
            variant="tertiary"
            size="large"
          />
        }
        onClose={() => setNotificationMenuOpen(false)}
      >
        <Box padding="200">
          <InlineStack align="space-between">
            <Text as="h3" variant="headingSm">
              Notifications
            </Text>
            <Badge tone="info">4 new</Badge>
          </InlineStack>
        </Box>
        <ActionList items={notificationActions} />
      </Popover>
      <Box
        position="absolute"
        insetBlockStart="-0.25rem"
        insetInlineEnd="-0.25rem"
        background="bg-critical"
        borderRadius="full"
        minHeight="0.5rem"
        minWidth="0.5rem"
      />
    </Box>
  );


  const logoMarkup = (
    <Link 
      to="/customer-admin" 
      style={{ 
        textDecoration: 'none',
        color: 'var(--p-color-text)', 
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}
    >
      <Box
        background="bg-surface-brand"
        borderRadius="200"
        padding="200"
        minHeight="2rem"
        minWidth="2rem"
      >
        <Text as="span" variant="headingSm" fontWeight="bold" tone="text-on-color">
          AI
        </Text>
      </Box>
      <Box>
        <Text as="h1" variant="headingMd" fontWeight="bold">
          {COMPANY_DATA.name}
        </Text>
        <Text as="p" variant="bodySm" tone="subdued">
          {COMPANY_DATA.industry} • {COMPANY_DATA.plan}
        </Text>
      </Box>
    </Link>
  );


  // Custom navigation bar to match Shopify customer accounts design
  const customNavMarkup = (
    <Box 
      padding="400" 
      borderBlockEndWidth="0125" 
      borderColor="border-secondary"
      background="bg-surface"
    >
      <InlineStack align="space-between" blockAlign="center">
        <InlineStack gap="800" blockAlign="center">
          {logoMarkup}
          <InlineStack gap="400">
            {navigationItems.map((item) => {
              const isActive = item.path === '/customer-admin' 
                ? location.pathname === '/customer-admin'
                : location.pathname.startsWith(item.path) && location.pathname !== '/customer-admin';
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    textDecoration: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.375rem',
                    backgroundColor: isActive ? 'var(--p-color-bg-surface-hover)' : 'transparent',
                    color: isActive ? 'var(--p-color-text)' : 'var(--p-color-text-secondary)',
                    border: isActive ? '1px solid var(--p-color-border-secondary)' : '1px solid transparent'
                  }}
                >
                  <Text 
                    as="span" 
                    variant="bodySm" 
                    fontWeight={isActive ? 'medium' : 'regular'}
                  >
                    {item.label}
                  </Text>
                </Link>
              );
            })}
          </InlineStack>
        </InlineStack>
        
        <InlineStack gap="300" align="center">
          {notificationMenuMarkup}
          <Link to="/storefront" style={{ textDecoration: 'none' }}>
            <Button
              icon={ExternalSmallIcon}
              size="medium"
              variant="secondary"
            >
              Shop now
            </Button>
          </Link>
          {userMenuMarkup}
        </InlineStack>
      </InlineStack>
    </Box>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--p-color-bg)' }}>
      {customNavMarkup}
      <Box padding="600">
        {children}
      </Box>
    </div>
  );
}