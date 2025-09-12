import { InlineStack, Text, BlockStack } from '@shopify/polaris';
import { StoreIcon, SettingsIcon, PersonIcon } from '@shopify/polaris-icons';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/Logo-blue-Large.png';

const APP_VERSION = 'v0.001';

export default function AppFooter() {
  const linkStyle = {
    textDecoration: 'none',
    color: '#6d7175',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    opacity: 0.7,
    transition: 'opacity 0.2s ease'
  };

  const iconStyle = {
    width: '20px',
    height: '20px'
  };

  return (
    <div style={{
      borderTop: '1px solid #e1e3e5',
      // backgroundColor: '#fafbfb',
      padding: '16px 20px',
      marginTop: '40px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Right side content */}
        <div style={{ textAlign: 'right' }}>
          {/* Navigation links with icons and labels */}
          <InlineStack gap="300" align="center">
            <Link 
              to="/storefront" 
              style={linkStyle}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
            >
              <StoreIcon style={iconStyle} />
              <span>Store</span>
            </Link>
            <Link 
              to="/customer-admin" 
              style={linkStyle}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
            >
              <PersonIcon style={iconStyle} />
              <span>Buyer</span>
            </Link>
            <Link 
              to="/merchant-portal" 
              style={linkStyle}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
            >
              <SettingsIcon style={iconStyle} />
              <span>Seller</span>
            </Link>
          </InlineStack>
          
          {/* Copyright below the navigation */}
          <div style={{ marginTop: '8px' }}>
            <Text as="span" variant="bodyXs" tone="subdued">
              © 2025 Vellum. All rights reserved.
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}