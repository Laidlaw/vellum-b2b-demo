import { 
  Card, 
  Page, 
  BlockStack, 
  Text, 
  Button, 
  InlineStack,
  Grid,
  Box,
  Badge,
  Divider,
  ProgressBar,
} from '@shopify/polaris';
import { Link } from 'react-router-dom';
import {
  QuoteIcon,
  OrderIcon,
  PaymentIcon,
  TeamIcon,
  CheckCircleIcon
} from '@shopify/polaris-icons';

// Mock dashboard data - in a real app this would come from APIs
const DASHBOARD_DATA = {
  metrics: {
    pendingQuotes: { value: 8, change: '+2 this week', trend: 'up' },
    activeOrders: { value: 15, change: '+3 this month', trend: 'up' },
    outstandingInvoices: { value: '$24,580', change: '-$5,200 this month', trend: 'down' },
    teamMembers: { value: 12, change: '+1 new member', trend: 'neutral' }
  },
  recentActivity: [
    {
      id: '1',
      type: 'quote',
      title: 'Quote Q-2024-0156 submitted',
      description: 'Industrial cleaning supplies - $8,450',
      time: '2 hours ago',
      status: 'pending',
      urgent: true
    },
    {
      id: '2', 
      type: 'order',
      title: 'Order #ORD-4821 shipped',
      description: 'Office furniture package - $12,300',
      time: '1 day ago',
      status: 'shipped'
    },
    {
      id: '3',
      type: 'invoice',
      title: 'Invoice INV-2024-0089 due soon',
      description: 'Payment due in 3 days - $3,250',
      time: '2 days ago',
      status: 'due'
    },
    {
      id: '4',
      type: 'team',
      title: 'New team member added',
      description: 'Emily Johnson joined as Procurement Specialist',
      time: '1 week ago',
      status: 'completed'
    }
  ],
  quickStats: {
    quotesThisMonth: 23,
    averageOrderValue: '$5,680',
    paymentTerms: '30 days',
    accountStatus: 'Active',
    creditUtilization: 68
  }
};

function MetricCard({ title, value, change, trend }: {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}) {
  const trendColor = trend === 'up' ? 'success' : trend === 'down' ? 'critical' : 'subdued';
  
  return (
    <Card>
      <BlockStack gap="300">
        <InlineStack align="space-between">
          <Text as="h3" variant="headingSm" tone="subdued">
            {title}
          </Text>
          <Box background="bg-surface-secondary" borderRadius="200" padding="100">
            {/* Icon placeholder */}
          </Box>
        </InlineStack>
        <Text as="p" variant="heading2xl" fontWeight="bold">
          {value}
        </Text>
        <Text as="p" variant="bodySm" tone={trendColor}>
          {change}
        </Text>
      </BlockStack>
    </Card>
  );
}

interface ActivityData {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  status: string;
  urgent?: boolean;
}

function ActivityItem({ activity }: { activity: ActivityData }) {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'quote': return QuoteIcon;
      case 'order': return OrderIcon;
      case 'invoice': return PaymentIcon;
      case 'team': return TeamIcon;
      default: return CheckCircleIcon;
    }
  };
  
  const getStatusBadge = () => {
    switch (activity.status) {
      case 'pending': return <Badge tone={activity.urgent ? 'critical' : 'attention'}>Needs attention</Badge>;
      case 'shipped': return <Badge tone="success">Shipped</Badge>;
      case 'due': return <Badge tone="warning">Due soon</Badge>;
      case 'completed': return <Badge tone="info">Completed</Badge>;
      default: return null;
    }
  };
  
  const ActivityIcon = getActivityIcon();
  
  return (
    <Box>
      <InlineStack gap="400" align="space-between" blockAlign="start">
        <InlineStack gap="300" blockAlign="center">
          <Box background="bg-surface-secondary" borderRadius="200" padding="100">
            <ActivityIcon style={{ width: '16px', height: '16px' }} />
          </Box>
          <BlockStack gap="100">
            <Text as="p" variant="bodyMd" fontWeight="medium">
              {activity.title}
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              {activity.description}
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              {activity.time}
            </Text>
          </BlockStack>
        </InlineStack>
        <Box>
          {getStatusBadge()}
        </Box>
      </InlineStack>
    </Box>
  );
}

export default function DashboardPage() {
  return (
    <Page 
      title="Dashboard" 
      subtitle="Welcome back, Sarah! Here's what's happening with your account."
      primaryAction={
        <Link to="/customer-admin/quotes" style={{ textDecoration: 'none' }}>
          <Button variant="primary">Review pending quotes</Button>
        </Link>
      }
      secondaryActions={[
        {
          content: 'View reports',
          onAction: () => console.log('View reports')
        }
      ]}
    >
      <BlockStack gap="600">
        {/* Key Metrics */}
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <MetricCard
              title="Pending quotes"
              value={DASHBOARD_DATA.metrics.pendingQuotes.value}
              change={DASHBOARD_DATA.metrics.pendingQuotes.change}
              trend={DASHBOARD_DATA.metrics.pendingQuotes.trend}
            />
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <MetricCard
              title="Active orders"
              value={DASHBOARD_DATA.metrics.activeOrders.value}
              change={DASHBOARD_DATA.metrics.activeOrders.change}
              trend={DASHBOARD_DATA.metrics.activeOrders.trend}
            />
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <MetricCard
              title="Outstanding invoices"
              value={DASHBOARD_DATA.metrics.outstandingInvoices.value}
              change={DASHBOARD_DATA.metrics.outstandingInvoices.change}
              trend={DASHBOARD_DATA.metrics.outstandingInvoices.trend}
            />
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <MetricCard
              title="Team members"
              value={DASHBOARD_DATA.metrics.teamMembers.value}
              change={DASHBOARD_DATA.metrics.teamMembers.change}
              trend={DASHBOARD_DATA.metrics.teamMembers.trend}
            />
          </Grid.Cell>
        </Grid>
        
        <Grid>
          {/* Recent Activity */}
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 8, xl: 8 }}>
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between">
                  <Text as="h2" variant="headingMd">
                    Recent activity
                  </Text>
                  <Link to="/customer-admin/quotes" style={{ textDecoration: 'none' }}>
                    <Button variant="plain">View all</Button>
                  </Link>
                </InlineStack>
                
                <BlockStack gap="400">
                  {DASHBOARD_DATA.recentActivity.map((activity, index) => (
                    <Box key={activity.id}>
                      <ActivityItem activity={activity} />
                      {index < DASHBOARD_DATA.recentActivity.length - 1 && (
                        <Box paddingBlockStart="400">
                          <Divider />
                        </Box>
                      )}
                    </Box>
                  ))}
                </BlockStack>
              </BlockStack>
            </Card>
          </Grid.Cell>
          
          {/* Account Overview */}
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 2, lg: 4, xl: 4 }}>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Account overview
                </Text>
                
                <BlockStack gap="300">
                  <InlineStack align="space-between">
                    <Text as="p" variant="bodyMd">
                      Account status
                    </Text>
                    <Badge tone="success">{DASHBOARD_DATA.quickStats.accountStatus}</Badge>
                  </InlineStack>
                  
                  <InlineStack align="space-between">
                    <Text as="p" variant="bodyMd">
                      Quotes this month
                    </Text>
                    <Text as="p" variant="bodyMd" fontWeight="medium">
                      {DASHBOARD_DATA.quickStats.quotesThisMonth}
                    </Text>
                  </InlineStack>
                  
                  <InlineStack align="space-between">
                    <Text as="p" variant="bodyMd">
                      Avg. order value
                    </Text>
                    <Text as="p" variant="bodyMd" fontWeight="medium">
                      {DASHBOARD_DATA.quickStats.averageOrderValue}
                    </Text>
                  </InlineStack>
                  
                  <InlineStack align="space-between">
                    <Text as="p" variant="bodyMd">
                      Payment terms
                    </Text>
                    <Text as="p" variant="bodyMd" fontWeight="medium">
                      {DASHBOARD_DATA.quickStats.paymentTerms}
                    </Text>
                  </InlineStack>
                  
                  <Divider />
                  
                  <BlockStack gap="200">
                    <InlineStack align="space-between">
                      <Text as="p" variant="bodyMd">
                        Credit utilization
                      </Text>
                      <Text as="p" variant="bodyMd" fontWeight="medium">
                        {DASHBOARD_DATA.quickStats.creditUtilization}%
                      </Text>
                    </InlineStack>
                    <ProgressBar 
                      progress={DASHBOARD_DATA.quickStats.creditUtilization} 
                      tone={DASHBOARD_DATA.quickStats.creditUtilization > 80 ? 'critical' : 'primary'}
                    />
                  </BlockStack>
                </BlockStack>
              </BlockStack>
            </Card>
          </Grid.Cell>
        </Grid>
        
        {/* Quick Actions */}
        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              Quick actions
            </Text>
            <InlineStack gap="300" wrap={false}>
              <Link to="/customer-admin/quotes" style={{ textDecoration: 'none', flex: 1 }}>
                <Button size="large" fullWidth>
                  Review quotes
                </Button>
              </Link>
              <Link to="/customer-admin/orders" style={{ textDecoration: 'none', flex: 1 }}>
                <Button size="large" fullWidth variant="secondary">
                  Track orders
                </Button>
              </Link>
              <Link to="/customer-admin/invoices" style={{ textDecoration: 'none', flex: 1 }}>
                <Button size="large" fullWidth variant="secondary">
                  Pay invoices
                </Button>
              </Link>
              <Link to="/storefront" style={{ textDecoration: 'none', flex: 1 }}>
                <Button size="large" fullWidth variant="secondary">
                  Shop catalog
                </Button>
              </Link>
            </InlineStack>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}