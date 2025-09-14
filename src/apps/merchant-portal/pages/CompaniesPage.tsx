import { useState } from 'react';
import {
  Page,
  Card,
  ResourceList,
  ResourceItem,
  Text,
  Badge,
  Button,
  InlineStack,
  BlockStack,
  TextField,
  Filters,
  Tabs,
  ButtonGroup,
} from '@shopify/polaris';
import {
  PersonIcon,
  PlusIcon,
  ExportIcon,
  ImportIcon,
  SearchIcon,
  FilterIcon,
} from '@shopify/polaris-icons';

interface Company {
  id: string;
  name: string;
  ordering: 'approved' | 'not-approved';
  locations: number;
  mainContact: string;
  totalOrders: number;
  totalSales: number;
}

const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'TruValue Tools',
    ordering: 'approved',
    locations: 1,
    mainContact: 'alex@onc.design',
    totalOrders: 1,
    totalSales: 2796.90,
  },
  {
    id: '2',
    name: 'Alex Test Company',
    ordering: 'approved',
    locations: 1,
    mainContact: 'Alex Sagel',
    totalOrders: 3,
    totalSales: 3159.80,
  },
  {
    id: '3',
    name: 'Snowdevil',
    ordering: 'approved',
    locations: 1,
    mainContact: 'Karine Ruby',
    totalOrders: 0,
    totalSales: 0.00,
  },
  {
    id: '4',
    name: 'Powderbound',
    ordering: 'not-approved',
    locations: 1,
    mainContact: 'No main contact',
    totalOrders: 0,
    totalSales: 0.00,
  },
];

export default function CompaniesPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const tabs = [
    { id: 'all', content: 'All' },
    { id: 'ordering-approved', content: 'Ordering approved' },
    { id: 'ordering-not-approved', content: 'Ordering not approved' },
  ];

  const filteredCompanies = mockCompanies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      company.mainContact.toLowerCase().includes(searchValue.toLowerCase());

    const matchesTab = selectedTab === 0 ||
      (selectedTab === 1 && company.ordering === 'approved') ||
      (selectedTab === 2 && company.ordering === 'not-approved');

    return matchesSearch && matchesTab;
  });

  const formatCurrency = (amount: number) => `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  const renderCompanyItem = (company: Company) => {
    const { id, name, ordering, locations, mainContact, totalOrders, totalSales } = company;

    return (
      <ResourceItem
        id={id}
        onClick={() => {}}
        accessibilityLabel={`View details for ${name}`}
      >
        <InlineStack align="space-between">
          <BlockStack gap="100">
            <Text as="h3" variant="bodyMd" fontWeight="medium">
              {name}
            </Text>
            <InlineStack gap="200">
              <Badge tone={ordering === 'approved' ? 'success' : 'attention'}>
                {ordering === 'approved' ? 'Approved' : 'Not approved'}
              </Badge>
              <Text as="span" variant="bodySm" tone="subdued">
                {locations} location{locations !== 1 ? 's' : ''}
              </Text>
              <Text as="span" variant="bodySm" tone="subdued">
                {mainContact}
              </Text>
            </InlineStack>
          </BlockStack>
          <InlineStack gap="600" align="end">
            <BlockStack gap="100">
              <Text as="span" variant="bodySm" tone="subdued">
                Total orders
              </Text>
              <Text as="span" variant="bodyMd">
                {totalOrders} order{totalOrders !== 1 ? 's' : ''}
              </Text>
            </BlockStack>
            <BlockStack gap="100">
              <Text as="span" variant="bodySm" tone="subdued">
                Total sales
              </Text>
              <Text as="span" variant="bodyMd">
                {formatCurrency(totalSales)}
              </Text>
            </BlockStack>
          </InlineStack>
        </InlineStack>
      </ResourceItem>
    );
  };

  const primaryAction = (
    <Button
      variant="primary"
      icon={PlusIcon}
    >
      Add company
    </Button>
  );

  const secondaryActions = [
    <Button key="export" icon={ExportIcon}>
      Export
    </Button>,
    <Button key="import" icon={ImportIcon}>
      Import
    </Button>,
  ];

  return (
    <Page
      title="Companies"
      titleMetadata={<PersonIcon />}
      primaryAction={primaryAction}
      secondaryActions={secondaryActions}
    >
      <BlockStack gap="400">
        <Card>
          <BlockStack gap="400">
            <Tabs
              tabs={tabs}
              selected={selectedTab}
              onSelect={setSelectedTab}
            />
            <InlineStack align="space-between">
              <TextField
                label="Search companies"
                labelHidden
                prefix={<SearchIcon />}
                placeholder="Search companies"
                value={searchValue}
                onChange={setSearchValue}
                autoComplete="off"
                clearButton
                onClearButtonClick={() => setSearchValue('')}
              />
              <ButtonGroup>
                <Button icon={FilterIcon}>
                  Add filter
                </Button>
              </ButtonGroup>
            </InlineStack>
          </BlockStack>
        </Card>

        <Card>
          <ResourceList
            resourceName={{ singular: 'company', plural: 'companies' }}
            items={filteredCompanies}
            renderItem={renderCompanyItem}
            selectedItems={selectedCompanies}
            onSelectionChange={setSelectedCompanies}
            promotedBulkActions={[
              {
                content: 'Approve ordering',
                onAction: () => console.log('Approve ordering'),
              },
            ]}
            bulkActions={[
              {
                content: 'Remove companies',
                onAction: () => console.log('Remove companies'),
              },
            ]}
            sortOptions={[
              { label: 'Company name A-Z', value: 'company_name_asc' },
              { label: 'Company name Z-A', value: 'company_name_desc' },
              { label: 'Total sales', value: 'total_sales' },
              { label: 'Total orders', value: 'total_orders' },
            ]}
            onSortChange={() => {}}
          />
        </Card>
      </BlockStack>
    </Page>
  );
}