import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ActionList,
  Button,
  InlineStack,
  Text,
  Box,
  Popover
} from '@shopify/polaris';
import {
  NotificationIcon,
  PersonIcon,
  ExternalSmallIcon
} from '@shopify/polaris-icons';

interface CustomerAdminLayoutProps {
  children: React.ReactNode;
}

const COMPANY_NAME = 'Abstract';

const navigationItems = [
  { label: 'Users', path: '/customer-admin/users' },
  { label: 'Company Info', path: '/customer-admin/company' },
  { label: 'Quotes', path: '/customer-admin/quotes' },
  { label: 'Invoices', path: '/customer-admin/invoices' }
];

export default function CustomerAdminLayout({ children }: CustomerAdminLayoutProps) {
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);

  const toggleUserMenu = () => setUserMenuOpen(prev => !prev);
  const toggleNotificationMenu = () => setNotificationMenuOpen(prev => !prev);

  const userMenuActions = [
    {
      content: 'Account settings',
      onAction: () => {
        setUserMenuOpen(false);
        console.log('Navigate to account settings');
      }
    },
    {
      content: 'Sign out',
      onAction: () => {
        setUserMenuOpen(false);
        console.log('Sign out user');
      }
    }
  ];

  const notificationActions = [
    {
      content: 'New quote submitted for approval',
      onAction: () => {
        setNotificationMenuOpen(false);
        // Navigate to quotes
      }
    },
    {
      content: 'User access request pending',
      onAction: () => {
        setNotificationMenuOpen(false);
        // Navigate to users
      }
    },
    {
      content: 'Mark all as read',
      onAction: () => {
        setNotificationMenuOpen(false);
        console.log('Mark all notifications as read');
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
          icon={PersonIcon}
          variant="tertiary"
          size="large"
        />
      }
      onClose={() => setUserMenuOpen(false)}
    >
      <ActionList items={userMenuActions} />
    </Popover>
  );

  const notificationMenuMarkup = (
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
      <ActionList items={notificationActions} />
    </Popover>
  );

  const secondaryMenuMarkup = (
    <InlineStack gap="200" align="center">
      {notificationMenuMarkup}
      <Link to="/storefront" style={{ textDecoration: 'none' }}>
        <Button
          icon={ExternalSmallIcon}
          size="large"
        >
          Go to store
        </Button>
      </Link>
      {userMenuMarkup}
    </InlineStack>
  );

  const logoMarkup = (
    <Link 
      to="/customer-admin" 
      style={{ 
        textDecoration: 'none',
        color: 'var(--p-color-text)', 
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
    >
      <Text as="h1" variant="headingLg" fontWeight="bold">
        {COMPANY_NAME}
      </Text>
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
          <InlineStack gap="600">
            {navigationItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    textDecoration: 'none',
                    padding: '0.5rem 0',
                    borderBottom: isActive ? '2px solid var(--p-color-border-interactive)' : '2px solid transparent',
                    color: isActive ? 'var(--p-color-text)' : 'var(--p-color-text-secondary)'
                  }}
                >
                  <Text 
                    as="span" 
                    variant="bodyMd" 
                    fontWeight={isActive ? 'semibold' : 'regular'}
                  >
                    {item.label}
                  </Text>
                </Link>
              );
            })}
          </InlineStack>
        </InlineStack>
        
        <InlineStack gap="200" align="center">
          {notificationMenuMarkup}
          <Link to="/storefront" style={{ textDecoration: 'none' }}>
            <Button
              icon={ExternalSmallIcon}
              size="medium"
            >
              Go to store
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