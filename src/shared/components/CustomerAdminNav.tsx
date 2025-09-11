import { Link, useLocation } from 'react-router-dom';
import { Button, InlineStack, Text, Box } from '@shopify/polaris';
import { NotificationIcon, ExternalSmallIcon } from '@shopify/polaris-icons';
import UserMenu from './UserMenu';

const navigationItems = [
  { label: 'Users', path: '/customer-admin/users' },
  { label: 'Company Info', path: '/customer-admin/company' },
  { label: 'Quotes', path: '/customer-admin/quotes' },
  { label: 'Invoices', path: '/customer-admin/invoices' }
];

export default function CustomerAdminNav() {
  const location = useLocation();

  return (
    <Box 
      padding="400" 
      borderBlockEndWidth="0125" 
      borderColor="border-secondary"
      background="bg-surface"
    >
      <InlineStack align="space-between" blockAlign="center">
        <InlineStack gap="800" blockAlign="center">
          <Link 
            to="/customer-admin" 
            style={{ 
              textDecoration: 'none',
              color: 'var(--p-color-text)'
            }}
          >
            <Text as="h1" variant="headingLg" fontWeight="bold">
              Abstract
            </Text>
          </Link>
          
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
          <Button
            icon={NotificationIcon}
            variant="tertiary"
            accessibilityLabel="Notifications"
          />
          <Link to="/storefront" style={{ textDecoration: 'none' }}>
            <Button
              icon={ExternalSmallIcon}
            >
              Go to store
            </Button>
          </Link>
          <UserMenu />
        </InlineStack>
      </InlineStack>
    </Box>
  );
}