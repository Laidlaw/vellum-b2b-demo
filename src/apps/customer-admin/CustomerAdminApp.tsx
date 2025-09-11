import { Routes, Route } from 'react-router-dom';
import { Page, Card, BlockStack, Text, Button, InlineStack } from '@shopify/polaris';
import { Link } from 'react-router-dom';
import QuotesTable from './components/QuotesTable';

function CustomerAdminHome() {
  return (
    <Page title="Customer Admin Portal">
      <BlockStack gap="400">
        <Card>
          <BlockStack gap="200">
            <Text as="h2" variant="headingMd">
              Supervisor Dashboard
            </Text>
            <Text as="p">
              Manage company users, approve quotes, handle billing addresses, and oversee B2B operations.
            </Text>
            <InlineStack gap="200">
              <Link to="/customer-admin/quotes">
                <Button>Review Quotes</Button>
              </Link>
              <Link to="/customer-admin/users">
                <Button variant="secondary">Manage Users</Button>
              </Link>
              <Link to="/customer-admin/company">
                <Button variant="secondary">Company Info</Button>
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
    <Page 
      title="Quote Management"
      subtitle="Review and approve pending quotes from your team"
      backAction={{
        content: 'Dashboard',
        url: '/customer-admin'
      }}
    >
      <QuotesTable />
    </Page>
  );
}

function UsersPage() {
  return (
    <Page 
      title="User Management"
      backAction={{
        content: 'Dashboard',
        url: '/customer-admin'
      }}
    >
      <Card>
        <Text as="p">User management will be implemented here</Text>
      </Card>
    </Page>
  );
}

function CompanyPage() {
  return (
    <Page 
      title="Company Information"
      backAction={{
        content: 'Dashboard',
        url: '/customer-admin'
      }}
    >
      <Card>
        <Text as="p">Company info and addresses will be implemented here</Text>
      </Card>
    </Page>
  );
}

export default function CustomerAdminApp() {
  return (
    <Routes>
      <Route index element={<CustomerAdminHome />} />
      <Route path="quotes/*" element={<QuotesPage />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="company" element={<CompanyPage />} />
    </Routes>
  );
}