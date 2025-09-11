import { Card, Page, BlockStack, Text, Button, InlineStack } from '@shopify/polaris';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
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