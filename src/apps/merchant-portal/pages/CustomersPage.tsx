import {
  Page,
  Card,
  BlockStack,
  Text,
  Button,
  InlineStack,
} from '@shopify/polaris';
import { PersonFilledIcon, PlusIcon } from '@shopify/polaris-icons';
import { Link } from 'react-router-dom';

export default function CustomersPage() {
  return (
    <Page
      title="Customers"
      titleMetadata={<PersonFilledIcon />}
      primaryAction={
        <Button variant="primary" icon={PlusIcon}>
          Add customer
        </Button>
      }
    >
      <BlockStack gap="400">
        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              Customer Management
            </Text>
            <Text as="p">
              Manage your B2B customers, organize them into segments, and oversee company relationships.
            </Text>
            <InlineStack gap="300">
              <Link to="/merchant-portal/customers/companies">
                <Button>
                  View Companies
                </Button>
              </Link>
              <Link to="/merchant-portal/customers/segments">
                <Button variant="secondary">
                  Manage Segments
                </Button>
              </Link>
            </InlineStack>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="200">
            <Text as="h3" variant="headingMd">
              Quick Stats
            </Text>
            <InlineStack gap="600">
              <BlockStack gap="100">
                <Text as="span" variant="headingLg">
                  4
                </Text>
                <Text as="span" variant="bodySm" tone="subdued">
                  Total Companies
                </Text>
              </BlockStack>
              <BlockStack gap="100">
                <Text as="span" variant="headingLg">
                  12
                </Text>
                <Text as="span" variant="bodySm" tone="subdued">
                  Active Customers
                </Text>
              </BlockStack>
              <BlockStack gap="100">
                <Text as="span" variant="headingLg">
                  3
                </Text>
                <Text as="span" variant="bodySm" tone="subdued">
                  Pending Approvals
                </Text>
              </BlockStack>
            </InlineStack>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}