import { 
  Card, 
  Page, 
  BlockStack, 
  Text, 
  Button, 
  InlineStack,
  Badge,
  ResourceList,
  ResourceItem,
  Box,
  Filters,
  Tabs,
  Grid,
  Modal,
  Divider,
  DataTable,
  ButtonGroup
} from '@shopify/polaris';
import { useState, useCallback } from 'react';
import {
  CalendarIcon,
  MoneyIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@shopify/polaris-icons';

// Mock invoice data - in a real app this would come from APIs
const INVOICES_DATA = [
  {
    id: 'INV-2024-0089',
    orderNumber: '#ORD-4821',
    amount: 3250.00,
    status: 'due',
    issueDate: '2024-08-12',
    dueDate: '2024-09-11',
    paidDate: null,
    description: 'Industrial cleaning supplies',
    items: [
      { name: 'Heavy-duty floor cleaner', quantity: 10, unitPrice: 245.00, total: 2450.00 },
      { name: 'Safety equipment bundle', quantity: 2, unitPrice: 400.00, total: 800.00 }
    ],
    paymentMethod: null,
    daysOverdue: 0
  },
  {
    id: 'INV-2024-0088',
    orderNumber: '#ORD-4819',
    amount: 8750.00,
    status: 'paid',
    issueDate: '2024-07-28',
    dueDate: '2024-08-27',
    paidDate: '2024-08-25',
    description: 'Office furniture package',
    items: [
      { name: 'Executive desk set', quantity: 5, unitPrice: 1200.00, total: 6000.00 },
      { name: 'Ergonomic office chairs', quantity: 10, unitPrice: 275.00, total: 2750.00 }
    ],
    paymentMethod: 'Credit Card ending in 4567',
    daysOverdue: 0
  },
  {
    id: 'INV-2024-0087',
    orderNumber: '#ORD-4815',
    amount: 12450.00,
    status: 'overdue',
    issueDate: '2024-06-15',
    dueDate: '2024-07-15',
    paidDate: null,
    description: 'Manufacturing equipment parts',
    items: [
      { name: 'Precision bearings set', quantity: 50, unitPrice: 125.00, total: 6250.00 },
      { name: 'Industrial belts', quantity: 20, unitPrice: 310.00, total: 6200.00 }
    ],
    paymentMethod: null,
    daysOverdue: 58
  },
  {
    id: 'INV-2024-0086',
    orderNumber: '#ORD-4812',
    amount: 5680.00,
    status: 'partial',
    issueDate: '2024-08-01',
    dueDate: '2024-08-31',
    paidDate: null,
    description: 'Safety and maintenance supplies',
    items: [
      { name: 'Safety harnesses', quantity: 15, unitPrice: 180.00, total: 2700.00 },
      { name: 'Maintenance tools kit', quantity: 8, unitPrice: 372.50, total: 2980.00 }
    ],
    paymentMethod: 'ACH Transfer',
    paidAmount: 2840.00,
    daysOverdue: 11
  },
  {
    id: 'INV-2024-0085',
    orderNumber: '#ORD-4808',
    amount: 2100.00,
    status: 'paid',
    issueDate: '2024-07-10',
    dueDate: '2024-08-09',
    paidDate: '2024-08-08',
    description: 'Computer accessories',
    items: [
      { name: 'Wireless keyboards', quantity: 25, unitPrice: 60.00, total: 1500.00 },
      { name: 'USB hubs', quantity: 20, unitPrice: 30.00, total: 600.00 }
    ],
    paymentMethod: 'Credit Card ending in 4567',
    daysOverdue: 0
  }
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function getStatusBadge(status: string, daysOverdue?: number) {
  switch (status) {
    case 'paid':
      return <Badge tone="success" icon={CheckCircleIcon}>Paid</Badge>;
    case 'due':
      return daysOverdue && daysOverdue > 0 
        ? <Badge tone="critical" icon={AlertCircleIcon}>Overdue</Badge>
        : <Badge tone="attention" icon={ClockIcon}>Due</Badge>;
    case 'overdue':
      return <Badge tone="critical" icon={AlertCircleIcon}>Overdue ({daysOverdue} days)</Badge>;
    case 'partial':
      return <Badge tone="warning" icon={ClockIcon}>Partial payment</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceData {
  id: string;
  orderNumber: string;
  amount: number;
  status: string;
  issueDate: string;
  dueDate: string;
  paidDate: string | null;
  description: string;
  items: InvoiceItem[];
  paymentMethod: string | null;
  daysOverdue: number;
  paidAmount?: number;
}

function InvoiceDetailModal({ invoice, open, onClose }: {
  invoice: InvoiceData | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!invoice) return null;
  
  const subtotal = invoice.items.reduce((sum: number, item: InvoiceItem) => sum + item.total, 0);
  const tax = subtotal * 0.08; // Assuming 8% tax
  const total = subtotal + tax;
  
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Invoice ${invoice.id}`}
      primaryAction={{
        content: 'Pay now',
        onAction: () => console.log('Pay invoice', invoice.id),
        disabled: invoice.status === 'paid'
      }}
      secondaryActions={[
        {
          content: 'Download PDF',
          onAction: () => console.log('Download invoice', invoice.id)
        }
      ]}
      large
    >
      <Modal.Section>
        <BlockStack gap="600">
          {/* Invoice Header */}
          <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 2, lg: 4, xl: 4 }}>
              <BlockStack gap="200">
                <Text as="h3" variant="headingMd">
                  Invoice details
                </Text>
                <Box>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Invoice number
                  </Text>
                  <Text as="p" variant="bodyMd" fontWeight="medium">
                    {invoice.id}
                  </Text>
                </Box>
                <Box>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Order number
                  </Text>
                  <Text as="p" variant="bodyMd" fontWeight="medium">
                    {invoice.orderNumber}
                  </Text>
                </Box>
                <Box>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Description
                  </Text>
                  <Text as="p" variant="bodyMd" fontWeight="medium">
                    {invoice.description}
                  </Text>
                </Box>
              </BlockStack>
            </Grid.Cell>
            
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 2, lg: 4, xl: 4 }}>
              <BlockStack gap="200">
                <Text as="h3" variant="headingMd">
                  Payment details
                </Text>
                <Box>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Issue date
                  </Text>
                  <Text as="p" variant="bodyMd" fontWeight="medium">
                    {formatDate(invoice.issueDate)}
                  </Text>
                </Box>
                <Box>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Due date
                  </Text>
                  <Text as="p" variant="bodyMd" fontWeight="medium">
                    {formatDate(invoice.dueDate)}
                  </Text>
                </Box>
                {invoice.paidDate && (
                  <Box>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Paid date
                    </Text>
                    <Text as="p" variant="bodyMd" fontWeight="medium">
                      {formatDate(invoice.paidDate)}
                    </Text>
                  </Box>
                )}
                {invoice.paymentMethod && (
                  <Box>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Payment method
                    </Text>
                    <Text as="p" variant="bodyMd" fontWeight="medium">
                      {invoice.paymentMethod}
                    </Text>
                  </Box>
                )}
              </BlockStack>
            </Grid.Cell>
            
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 2, lg: 4, xl: 4 }}>
              <BlockStack gap="200">
                <Text as="h3" variant="headingMd">
                  Amount
                </Text>
                <Box>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Status
                  </Text>
                  <Box paddingBlockStart="100">
                    {getStatusBadge(invoice.status, invoice.daysOverdue)}
                  </Box>
                </Box>
                <Box>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Total amount
                  </Text>
                  <Text as="p" variant="headingMd" fontWeight="bold">
                    {formatCurrency(invoice.amount)}
                  </Text>
                </Box>
                {invoice.paidAmount && invoice.status === 'partial' && (
                  <>
                    <Box>
                      <Text as="p" variant="bodyMd" tone="subdued">
                        Amount paid
                      </Text>
                      <Text as="p" variant="bodyMd" fontWeight="medium">
                        {formatCurrency(invoice.paidAmount)}
                      </Text>
                    </Box>
                    <Box>
                      <Text as="p" variant="bodyMd" tone="subdued">
                        Amount due
                      </Text>
                      <Text as="p" variant="bodyMd" fontWeight="medium" tone="critical">
                        {formatCurrency(invoice.amount - invoice.paidAmount)}
                      </Text>
                    </Box>
                  </>
                )}
              </BlockStack>
            </Grid.Cell>
          </Grid>
          
          <Divider />
          
          {/* Invoice Items */}
          <BlockStack gap="400">
            <Text as="h3" variant="headingMd">
              Invoice items
            </Text>
            
            <DataTable
              columnContentTypes={['text', 'numeric', 'numeric', 'numeric']}
              headings={['Item', 'Quantity', 'Unit Price', 'Total']}
              rows={invoice.items.map((item: InvoiceItem) => [
                item.name,
                item.quantity.toString(),
                formatCurrency(item.unitPrice),
                formatCurrency(item.total)
              ])}
              totals={['', '', 'Subtotal:', formatCurrency(subtotal)]}
              showTotalsInFooter
            />
            
            <Box paddingInlineStart="800">
              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text as="p" variant="bodyMd">
                    Tax (8%)
                  </Text>
                  <Text as="p" variant="bodyMd">
                    {formatCurrency(tax)}
                  </Text>
                </InlineStack>
                <Divider />
                <InlineStack align="space-between">
                  <Text as="p" variant="bodyMd" fontWeight="bold">
                    Total
                  </Text>
                  <Text as="p" variant="bodyMd" fontWeight="bold">
                    {formatCurrency(total)}
                  </Text>
                </InlineStack>
              </BlockStack>
            </Box>
          </BlockStack>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}

export default function InvoicesPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [queryValue, setQueryValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const tabs = [
    {
      id: 'all-invoices',
      content: 'All invoices',
      panelID: 'all-invoices-panel'
    },
    {
      id: 'due-invoices', 
      content: 'Due & overdue',
      panelID: 'due-invoices-panel'
    },
    {
      id: 'paid-invoices',
      content: 'Paid',
      panelID: 'paid-invoices-panel'
    }
  ];
  
  const openInvoiceModal = useCallback((invoice: InvoiceData) => {
    setSelectedInvoice(invoice);
    setModalOpen(true);
  }, []);
  
  const closeInvoiceModal = useCallback(() => {
    setModalOpen(false);
    setSelectedInvoice(null);
  }, []);
  
  // Filter invoices based on search and filters
  const filteredInvoices = INVOICES_DATA.filter(invoice => {
    const matchesQuery = invoice.id.toLowerCase().includes(queryValue.toLowerCase()) ||
                        invoice.description.toLowerCase().includes(queryValue.toLowerCase());
    
    let matchesTab = true;
    if (selectedTab === 1) {
      matchesTab = invoice.status === 'due' || invoice.status === 'overdue' || invoice.status === 'partial';
    } else if (selectedTab === 2) {
      matchesTab = invoice.status === 'paid';
    }
    
    const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter.toLowerCase();
    
    return matchesQuery && matchesTab && matchesStatus;
  });
  
  // Calculate summary stats
  const totalOutstanding = INVOICES_DATA
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + (inv.status === 'partial' ? inv.amount - (inv.paidAmount || 0) : inv.amount), 0);
  
  const overdueAmount = INVOICES_DATA
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);
  
  const renderInvoiceItem = (invoice: InvoiceData) => {
    const { id, orderNumber, amount, status, issueDate, dueDate, description, daysOverdue, paidAmount } = invoice;
    
    return (
      <ResourceItem
        id={id}
        accessibilityLabel={`View details for invoice ${id}`}
        onClick={() => openInvoiceModal(invoice)}
      >
        <InlineStack align="space-between" blockAlign="center">
          <BlockStack gap="100">
            <InlineStack gap="200" align="start">
              <Text as="h3" variant="bodyMd" fontWeight="medium">
                {id}
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                {orderNumber}
              </Text>
            </InlineStack>
            <Text as="p" variant="bodySm">
              {description}
            </Text>
            <InlineStack gap="400">
              <Text as="p" variant="bodySm" tone="subdued">
                Issued: {formatDate(issueDate)}
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                Due: {formatDate(dueDate)}
              </Text>
            </InlineStack>
          </BlockStack>
          
          <InlineStack gap="400" align="end">
            <BlockStack gap="100" align="end">
              <Text as="p" variant="bodyMd" fontWeight="bold">
                {formatCurrency(amount)}
              </Text>
              {status === 'partial' && paidAmount && (
                <Text as="p" variant="bodySm" tone="subdued">
                  {formatCurrency(paidAmount)} paid
                </Text>
              )}
            </BlockStack>
            {getStatusBadge(status, daysOverdue)}
          </InlineStack>
        </InlineStack>
      </ResourceItem>
    );
  };
  
  return (
    <Page 
      title="Invoices & billing" 
      subtitle="View and manage your company's invoices and payments"
      primaryAction={
        <ButtonGroup>
          <Button>Export invoices</Button>
          <Button variant="primary">
            Set up auto-pay
          </Button>
        </ButtonGroup>
      }
    >
      <BlockStack gap="600">
        {/* Summary Cards */}
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 2, lg: 3, xl: 3 }}>
            <Card>
              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Total outstanding
                  </Text>
                  <MoneyIcon style={{ width: '20px', height: '20px', opacity: 0.6 }} />
                </InlineStack>
                <Text as="p" variant="heading2xl" fontWeight="bold">
                  {formatCurrency(totalOutstanding)}
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  {INVOICES_DATA.filter(inv => inv.status !== 'paid').length} unpaid invoices
                </Text>
              </BlockStack>
            </Card>
          </Grid.Cell>
          
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 2, lg: 3, xl: 3 }}>
            <Card>
              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Overdue amount
                  </Text>
                  <AlertCircleIcon style={{ width: '20px', height: '20px', opacity: 0.6 }} />
                </InlineStack>
                <Text as="p" variant="heading2xl" fontWeight="bold" tone={overdueAmount > 0 ? 'critical' : 'subdued'}>
                  {formatCurrency(overdueAmount)}
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  {INVOICES_DATA.filter(inv => inv.status === 'overdue').length} overdue invoices
                </Text>
              </BlockStack>
            </Card>
          </Grid.Cell>
          
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 2, lg: 3, xl: 3 }}>
            <Card>
              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text as="p" variant="bodyMd" tone="subdued">
                    This month paid
                  </Text>
                  <CheckCircleIcon style={{ width: '20px', height: '20px', opacity: 0.6 }} />
                </InlineStack>
                <Text as="p" variant="heading2xl" fontWeight="bold">
                  {formatCurrency(10850)}
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  2 invoices paid
                </Text>
              </BlockStack>
            </Card>
          </Grid.Cell>
          
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 2, lg: 3, xl: 3 }}>
            <Card>
              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Payment terms
                  </Text>
                  <CalendarIcon style={{ width: '20px', height: '20px', opacity: 0.6 }} />
                </InlineStack>
                <Text as="p" variant="heading2xl" fontWeight="bold">
                  30 days
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Standard terms
                </Text>
              </BlockStack>
            </Card>
          </Grid.Cell>
        </Grid>
        
        {/* Invoices List */}
        <Card>
          <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab} />
          
          <Box paddingBlockStart="400">
            <Filters
              queryValue={queryValue}
              queryPlaceholder="Search invoices..."
              onQueryChange={setQueryValue}
              onQueryClear={() => setQueryValue('')}
              filters={[]}
              onClearAll={() => {
                setQueryValue('');
                setStatusFilter('All');
              }}
            />
          </Box>
          
          <ResourceList
            resourceName={{ singular: 'invoice', plural: 'invoices' }}
            items={filteredInvoices}
            renderItem={renderInvoiceItem}
            showHeader
            totalItemsCount={filteredInvoices.length}
          />
        </Card>
        
        <InvoiceDetailModal
          invoice={selectedInvoice}
          open={modalOpen}
          onClose={closeInvoiceModal}
        />
      </BlockStack>
    </Page>
  );
}