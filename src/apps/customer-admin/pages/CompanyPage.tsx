import { Card, Page, BlockStack, Text } from '@shopify/polaris';

export default function CompanyPage() {
  return (
    <Page title="Company Information" subtitle="Manage company details, addresses, and settings">
      <BlockStack gap="400">
        <Card>
          <Text as="p">Company information and addresses will be implemented here</Text>
        </Card>
      </BlockStack>
    </Page>
  );
}