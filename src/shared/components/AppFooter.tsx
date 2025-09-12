import { InlineStack, Text } from '@shopify/polaris';
import { StoreIcon, SettingsIcon, PersonIcon } from '@shopify/polaris-icons';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/Logo-blue-Large.png';

const APP_VERSION = 'v0.001';

export default function AppFooter() {
  const footerIconStyle = {
    opacity: 0.3,
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease'
  };

  const handleIconHover = (e: React.MouseEvent<SVGElement>) => {
    e.currentTarget.style.opacity = '0.6';
  };

  const handleIconLeave = (e: React.MouseEvent<SVGElement>) => {
    e.currentTarget.style.opacity = '0.3';
  };

  return (
    <div style={{
      borderTop: '1px solid #e1e3e5',
      backgroundColor: '#fafbfb',
      padding: '12px 20px',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Left side: Logo and version */}
        <InlineStack gap="200" align="center">
          <img 
            src={logoImage} 
            alt="Vellum" 
            style={{ 
              height: '20px',
              opacity: 0.5
            }} 
          />
          <Text as="span" variant="bodyXs" tone="subdued">
            {APP_VERSION}
          </Text>
          
          {/* Navigation icons */}
          <InlineStack gap="100" align="center">
            <Link to="/storefront" title="Storefront">
              <StoreIcon 
                style={footerIconStyle}
                onMouseEnter={handleIconHover}
                onMouseLeave={handleIconLeave}
              />
            </Link>
            <Link to="/merchant-portal" title="Merchant Portal">
              <SettingsIcon 
                style={footerIconStyle}
                onMouseEnter={handleIconHover}
                onMouseLeave={handleIconLeave}
              />
            </Link>
            <Link to="/customer-admin" title="Customer Admin">
              <PersonIcon 
                style={footerIconStyle}
                onMouseEnter={handleIconHover}
                onMouseLeave={handleIconLeave}
              />
            </Link>
          </InlineStack>
        </InlineStack>

        {/* Right side: Copyright */}
        <Text as="span" variant="bodyXs" tone="subdued">
          © 2025 Vellum. All rights reserved.
        </Text>
      </div>
    </div>
  );
}