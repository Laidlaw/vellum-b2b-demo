import { Routes, Route, useLocation } from 'react-router-dom';
import {
  Page,
  Card,
  BlockStack,
  Text,
  Button,
  InlineStack
} from '@shopify/polaris';
import { Link } from 'react-router-dom';
import { QuotesTable, OrdersTable } from '../../shared/components/tables';
import { AppFrame } from '../../shared/components/layout';
import { createHorizontalNavigation } from '../../shared/components/navigation';
import UsersPage from './pages/UsersPage';
import CompanyPage from './pages/CompanyPage';
import InvoicesPage from './pages/InvoicesPage';
import DashboardPage from './pages/DashboardPage';


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

function OrdersPage() {
  return (
    <Page title="Orders" subtitle="Track and manage your company's orders">
      <OrdersTable />
    </Page>
  );
}


export default function CustomerAdminApp() {
  const location = useLocation();

  const currentUser = {
    name: "Sarah Chen",
    detail: "Acme Industrial Solutions",
    initials: "SC"
  };

  const companyAddress = {
    street: "314 Arthur Drive",
    city: "New York",
    state: "NY",
    zip: "10001"
  };

  const horizontalNavItems = createHorizontalNavigation('customer-admin', location.pathname);

  const handleUserLogout = () => {
    console.log('User logout');
  };

  return (
    <AppFrame
      appType="customer-admin"
      currentUser={currentUser}
      layoutStyle="commerce"
      companyName="B2BPaymentsPlus"
      companyAddress={companyAddress}
      horizontalNavItems={horizontalNavItems}
      onUserLogout={handleUserLogout}
    >
      <Routes>
        <Route index element={<CustomerAdminHome />} />
        <Route path="quotes/*" element={<QuotesPage />} />
        <Route path="orders/*" element={<OrdersPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="company" element={<CompanyPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="stats" element={<DashboardPage />} />
      </Routes>
    </AppFrame>
  );
}