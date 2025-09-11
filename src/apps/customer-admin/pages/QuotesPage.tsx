import { Page, BlockStack } from '@shopify/polaris';
import QuotesTable from '../components/QuotesTable';

export default function QuotesPage() {
  return (
    <Page title="Quotes" subtitle="Review and approve pending quotes from your team">
      <BlockStack gap="400">
        <QuotesTable />
      </BlockStack>
    </Page>
  );
}