import { Card, Page, BlockStack, Text } from '@shopify/polaris';

export default function UsersPage() {
  return (
    <Page title="Users" subtitle="Manage company users and their permissions">
      <BlockStack gap="400">
        <Card>
          <Text as="p">User management interface will be implemented here</Text>
        </Card>
      </BlockStack>
    </Page>
  );
}