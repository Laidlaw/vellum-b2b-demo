import { Routes, Route } from 'react-router-dom';
import { Page, Card, BlockStack, Text, Button, InlineStack } from '@shopify/polaris';
import { Link } from 'react-router-dom';

function MerchantPortalHome() {
  return (
    <Page title="Merchant Portal">
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
              <Link to="/merchant-portal/companies">
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