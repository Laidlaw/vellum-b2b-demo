import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Page,
  Card,
  BlockStack,
  Text,
  Button,
  InlineStack,
  Layout,
  TopBar,
  Frame
} from '@shopify/polaris';
import {
  SettingsIcon,
  NotificationIcon,
} from '@shopify/polaris-icons';
import { Link } from 'react-router-dom';
import QuotesTable from './components/QuotesTable';
import OrdersTable from './components/OrdersTable';
import CompaniesPage from './pages/CompaniesPage';
import CustomersPage from './pages/CustomersPage';
import { MerchantNavigation } from './components/MerchantNavigation';
import { createNavigationSections } from './config/navigationConfig';

function MerchantPortalHome() {
  return (
    <Page title="Merchant Portal" subtitle="Overview of your company's B2B operations">
      <BlockStack gap="400">
        <Card>
          <BlockStack gap="200">
            <Text as="h2" variant="headingMd">
              Shopify Merchant Dashboard
            </Text>
            <Text as="p">
              Manage B2B companies, track deals, and oversee customer relationships integrated with Shopify.
            </Text>
            <InlineStack gap="200">
              <Link to="/merchant-portal/customers/companies">
                <Button>Manage Companies</Button>
              </Link>
              <Link to="/merchant-portal/orders">
                <Button variant="secondary">View Orders</Button>
              </Link>
              <Link to="/merchant-portal/analytics">
                <Button variant="secondary">Analytics</Button>
              </Link>
            </InlineStack>
          </BlockStack>
        </Card>
        
        <Card>
          <BlockStack gap="200">
            <Text as="h3" variant="headingMd">Quick Links</Text>
            <InlineStack gap="200">
              <Link to="/storefront">
                <Button variant="plain">Storefront</Button>
              </Link>
              <Link to="/customer-admin">
                <Button variant="plain">Customer Admin</Button>
              </Link>
            </InlineStack>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
/*
function CompaniesPage() {
  return (
    <Page 
      title="Company Management"
      backAction={{
        content: 'Merchant Portal',
        url: '/merchant-portal'
      }}
    >
      <Card>
        <Text as="p">Company management interface will be implemented here</Text>
      </Card>
    </Page>
  );
}

function OrdersPage() {
  return (
    <Page 
      title="B2B Orders"
      backAction={{
        content: 'Merchant Portal',
        url: '/merchant-portal'
      }}
    >
      <Card>
        <Text as="p">Order management will be implemented here</Text>
      </Card>
    </Page>
  );
}

function AnalyticsPage() {
  return (
    <Page 
      title="B2B Analytics"
      backAction={{
        content: 'Merchant Portal',
        url: '/merchant-portal'
      }}
    >
      <Card>
        <Text as="p">Analytics dashboard will be implemented here</Text>
      </Card>
    </Page>
  );
}
*/
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

export default function MerchantPortalApp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [salesChannelsExpanded, setSalesChannelsExpanded] = useState(false);
  const [appsExpanded, setAppsExpanded] = useState(false);
  const [customersExpanded, setCustomersExpanded] = useState(
    location.pathname.startsWith('/merchant-portal/customers')
  );

  // Auto-expand customers when on customer pages
  useEffect(() => {
    if (location.pathname.startsWith('/merchant-portal/customers')) {
      setCustomersExpanded(true);
    }
  }, [location.pathname]);

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
  
  const navigationSections = createNavigationSections(
    location.pathname,
    salesChannelsExpanded,
    appsExpanded,
    customersExpanded,
    () => setSalesChannelsExpanded(!salesChannelsExpanded),
    () => setAppsExpanded(!appsExpanded),
    () => setCustomersExpanded(!customersExpanded)
  );

  const navigationMarkup = (
    <MerchantNavigation
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
          <Route index element={<MerchantPortalHome />} />
          <Route path="orders/*" element={<OrdersPage />} />
          <Route path="products" element={<Page title="Products"><Card><Text>Products page</Text></Card></Page>} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/companies" element={<CompaniesPage />} />
          <Route path="customers/segments" element={<Page title="Segments"><Card><Text>Segments page</Text></Card></Page>} />
          <Route path="marketing" element={<Page title="Marketing"><Card><Text>Marketing page</Text></Card></Page>} />
          <Route path="discounts" element={<Page title="Discounts"><Card><Text>Discounts page</Text></Card></Page>} />
          <Route path="content" element={<Page title="Content"><Card><Text>Content page</Text></Card></Page>} />
          <Route path="markets" element={<Page title="Markets"><Card><Text>Markets page</Text></Card></Page>} />
          <Route path="finance" element={<Page title="Finance"><Card><Text>Finance page</Text></Card></Page>} />
          <Route path="analytics" element={<Page title="Analytics"><Card><Text>Analytics page</Text></Card></Page>} />
          <Route path="settings" element={<Page title="Settings"><Card><Text>Settings page</Text></Card></Page>} />
          <Route path="quotes/*" element={<QuotesPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="company" element={<CompanyPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
        </Routes>
      </Frame>
    );
  }
/*
export default function MerchantPortalApp() {
  return (
    <Routes>
      <Route index element={<MerchantPortalHome />} />
      <Route path="companies/*" element={<CompaniesPage />} />
      <Route path="orders" element={<OrdersPage />} />
      <Route path="analytics" element={<AnalyticsPage />} />
    </Routes>
  );
}

*/