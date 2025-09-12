import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { 
  Page, 
  Card, 
  BlockStack, 
  Text, 
  Button, 
  InlineStack,
  Layout,
  Navigation,
  TopBar,
  Frame
} from '@shopify/polaris';
import { 
  HomeIcon,
  OrderIcon,
  ProductIcon,
  PersonIcon,
  SettingsIcon,
  NotificationIcon
} from '@shopify/polaris-icons';
import { Link } from 'react-router-dom';
import QuotesTable from './components/QuotesTable';
import OrdersTable from './components/OrdersTable';

function CustomerAdminHome() {
  return (
    <Page title="Dashboard" subtitle="Overview of your company's B2B operations">
      <BlockStack gap="400">
        <Card>
          <BlockStack gap="200">
            <Text as="h2" variant="headingMd">
              Welcome to Abstract's Customer Portal
            </Text>
            <Text as="p">
              Manage your company's users, review quotes, handle billing addresses, and oversee B2B operations.
            </Text>
            <InlineStack gap="200">
              <Link to="/customer-admin/quotes">
                <Button variant="primary">Review Quotes</Button>
              </Link>
              <Link to="/customer-admin/users">
                <Button>Manage Users</Button>
              </Link>
              <Link to="/customer-admin/company">
                <Button>Company Info</Button>
              </Link>
            </InlineStack>
          </BlockStack>
        </Card>
        
        <Card>
          <BlockStack gap="200">
            <Text as="h3" variant="headingMd">Quick Actions</Text>
            <InlineStack gap="200">
              <Link to="/storefront">
                <Button variant="plain">Go to Storefront</Button>
              </Link>
              <Link to="/merchant-portal">
                <Button variant="plain">Merchant Portal</Button>
              </Link>
            </InlineStack>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}

function QuotesPage() {
  return (
    <Page title="Quotes" subtitle="Review and approve pending quotes from your team">
      <QuotesTable />
    </Page>
  );
}

function UsersPage() {
  return (
    <Page title="Users" subtitle="Manage company users and their permissions">
      <Card>
        <Text as="p">User management interface will be implemented here</Text>
      </Card>
    </Page>
  );
}

function CompanyPage() {
  return (
    <Page title="Company Information" subtitle="Manage company details, addresses, and settings">
      <Card>
        <Text as="p">Company info and addresses will be implemented here</Text>
      </Card>
    </Page>
  );
}

function OrdersPage() {
  return (
    <Page title="Orders" subtitle="Track and manage your company's orders">
      <OrdersTable />
    </Page>
  );
}

function InvoicesPage() {
  return (
    <Page title="Invoices" subtitle="View and manage company invoices and billing">
      <Layout>
        <Layout.Section>
          <Card>
            <Text as="p">Invoice management interface will be implemented here</Text>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default function CustomerAdminApp() {
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMobileNavigationActive = () =>
    setMobileNavigationActive((mobileNavigationActive) => !mobileNavigationActive);

  const toggleUserMenuOpen = () => setUserMenuOpen((open) => !open);

  const userMenuActions = [
    {
      items: [
        { content: 'Profile settings', icon: SettingsIcon },
        { content: 'Help center' },
        { content: 'Sign out' }
      ]
    }
  ];

  const navigationMarkup = (
    <Navigation location={location.pathname}>
      <Navigation.Section
        items={[
          {
            label: 'Dashboard',
            icon: HomeIcon,
            onClick: () => navigate('/customer-admin'),
            selected: location.pathname === '/customer-admin',
          },
          {
            label: 'Quotes',
            icon: ProductIcon,
            onClick: () => navigate('/customer-admin/quotes'),
            selected: location.pathname.startsWith('/customer-admin/quotes'),
          },
          {
            label: 'Orders', 
            icon: OrderIcon,
            onClick: () => navigate('/customer-admin/orders'),
            selected: location.pathname.startsWith('/customer-admin/orders'),
          },
          {
            label: 'Invoices',
            onClick: () => navigate('/customer-admin/invoices'),
            selected: location.pathname.startsWith('/customer-admin/invoices'),
          },
          {
            label: 'Team',
            icon: PersonIcon,
            onClick: () => navigate('/customer-admin/users'),
            selected: location.pathname.startsWith('/customer-admin/users'),
          },
          {
            label: 'Company',
            icon: SettingsIcon,
            onClick: () => navigate('/customer-admin/company'),
            selected: location.pathname.startsWith('/customer-admin/company'),
          },
        ]}
      />
    </Navigation>
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={
        <TopBar.UserMenu
          actions={userMenuActions}
          name="Sarah Chen"
          detail="Acme Industrial Solutions"
          initials="SC"
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

  return (
    <Frame
      topBar={topBarMarkup}
      navigation={navigationMarkup}
      showMobileNavigation={mobileNavigationActive}
      onNavigationDismiss={toggleMobileNavigationActive}
    >
      <Routes>
        <Route index element={<CustomerAdminHome />} />
        <Route path="quotes/*" element={<QuotesPage />} />
        <Route path="orders/*" element={<OrdersPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="company" element={<CompanyPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
      </Routes>
    </Frame>
  );
}