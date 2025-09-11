import { Routes, Route } from 'react-router-dom';
import { Page, Card, BlockStack, Text, Button, InlineStack } from '@shopify/polaris';
import { Link } from 'react-router-dom';
import CustomerAdminNav from '../../shared/components/CustomerAdminNav';
import QuotesTable from './components/QuotesTable';

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

function InvoicesPage() {
  return (
    <Page title="Invoices" subtitle="View and manage company invoices and billing">
      <Card>
        <Text as="p">Invoice management interface will be implemented here</Text>
      </Card>
    </Page>
  );
}

export default function CustomerAdminApp() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <CustomerAdminNav />
      <Routes>
        <Route index element={<CustomerAdminHome />} />
        <Route path="quotes/*" element={<QuotesPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="company" element={<CompanyPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
      </Routes>
    </div>
  );
}