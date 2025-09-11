import { Card, Page, BlockStack, Text } from '@shopify/polaris';

export default function InvoicesPage() {
  return (
    <Page title="Invoices" subtitle="View and manage company invoices and billing">
      <BlockStack gap="400">
        <Card>
          <Text as="p">Invoice management interface will be implemented here</Text>
        </Card>
      </BlockStack>
    </Page>
  );
}