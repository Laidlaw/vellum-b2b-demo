import { Link, useLocation } from 'react-router-dom';
import { Button } from '@shopify/polaris';
import { NotificationIcon, ExternalSmallIcon } from '@shopify/polaris-icons';
import UserMenu from './UserMenu';

const navigationItems = [
  { label: 'Users', path: '/customer-admin/users' },
  { label: 'Company Info', path: '/customer-admin/company' },
  { label: 'Orders', path: '/customer-admin/orders' },
  { label: 'Quotes', path: '/customer-admin/quotes' },
  { label: 'Invoices', path: '/customer-admin/invoices' }
];

export default function CustomerAdminNav() {
  const location = useLocation();

  const navStyle: React.CSSProperties = {
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e1e5e9',
    padding: '0 24px',
    //height: '64px',
    //display: 'flex',
    //alignItems: 'center',
    //justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100
  };

  const header__container: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const leftSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '32px'
  };

  const logoStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#202223',
    textDecoration: 'none'
  };

  const navLinksStyle: React.CSSProperties = {
    display: 'flex',
    gap: '24px'
  };

  const rightSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const getLinkStyle = (isActive: boolean): React.CSSProperties => ({
    color: isActive ? '#202223' : '#6d7175',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: isActive ? '500' : '400',
    padding: '8px 0',
    borderBottom: isActive ? '2px solid #008060' : '2px solid transparent',
    transition: 'all 0.2s ease'
  });

  return (
    <header style={navStyle}>
      <div style={header__container}>
        <div style={leftSectionStyle}>
          <Link to="/customer-admin" style={logoStyle}>
            Abstract
          </Link>
          
          <div style={navLinksStyle}>
            {navigationItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={getLinkStyle(isActive)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
        
        <div style={rightSectionStyle}>
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
        </div>
      </div>
    </header>
  );
}