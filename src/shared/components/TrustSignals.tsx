import { Card, BlockStack, InlineStack, Text, Button, Badge, Grid } from '@shopify/polaris';

interface TrustSignalsProps {
  onContactSales?: () => void;
}

export function TrustSignals({ onContactSales }: TrustSignalsProps) {
  const certifications = [
    { name: 'ISO 9001', description: 'Quality Management Certified', icon: '📋' },
    { name: 'ISO 14001', description: 'Environmental Management', icon: '🌱' },
    { name: 'OSHA Compliant', description: 'Workplace Safety Standards', icon: '🛡️' },
    { name: 'UL Listed', description: 'Safety & Performance Testing', icon: '✓' }
  ];

  const businessFeatures = [
    {
      title: 'Enterprise Accounts',
      description: 'Dedicated account management with custom pricing and payment terms',
      icon: '🏢'
    },
    {
      title: 'Bulk Order Discounts', 
      description: 'Volume pricing that scales with your business needs',
      icon: '📦'
    },
    {
      title: 'Fast Track Shipping',
      description: 'Priority fulfillment and same-day shipping on stock items',
      icon: '⚡'
    },
    {
      title: 'Technical Support',
      description: '24/7 expert support from certified technicians',
      icon: '🔧'
    },
    {
      title: 'Custom Integration',
      description: 'API access and ERP integration for seamless procurement',
      icon: '🔗'
    },
    {
      title: 'Compliance Documentation',
      description: 'Complete certification and compliance documentation',
      icon: '📄'
    }
  ];

  const stats = [
    { value: '50,000+', label: 'Products in Stock' },
    { value: '10,000+', label: 'Business Customers' },
    { value: '30+', label: 'Years in Business' },
    { value: '99.9%', label: 'Order Accuracy' }
  ];

  return (
    <BlockStack gap="500">
      {/* Business Statistics */}
      <Card>
        <BlockStack gap="400">
          <Text as="h3" variant="headingLg" alignment="center">
            Trusted by Industry Leaders
          </Text>
          <InlineStack gap="600" align="center" wrap>
            {stats.map((stat, index) => (
              <BlockStack gap="100" align="center" key={index}>
                <Text as="p" variant="heading2xl" fontWeight="bold">
                  {stat.value}
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued" alignment="center">
                  {stat.label}
                </Text>
              </BlockStack>
            ))}
          </InlineStack>
        </BlockStack>
      </Card>

      {/* Certifications & Compliance */}
      <Card>
        <BlockStack gap="400">
          <BlockStack gap="200" align="center">
            <Text as="h3" variant="headingLg">
              Industry Certifications
            </Text>
            <Text as="p" tone="subdued" alignment="center">
              All our products meet or exceed industry safety and quality standards
            </Text>
          </BlockStack>
          
          <InlineStack gap="400" align="center" wrap>
            {certifications.map((cert, index) => (
              <BlockStack gap="200" align="center" key={index}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#e6f3f7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  {cert.icon}
                </div>
                <BlockStack gap="50" align="center">
                  <Text as="p" variant="bodyMd" fontWeight="semibold">
                    {cert.name}
                  </Text>
                  <Text as="p" variant="bodyXs" tone="subdued" alignment="center">
                    {cert.description}
                  </Text>
                </BlockStack>
              </BlockStack>
            ))}
          </InlineStack>
        </BlockStack>
      </Card>

      {/* B2B Features Grid */}
      <Card>
        <BlockStack gap="500">
          <BlockStack gap="200">
            <Text as="h3" variant="headingLg">
              Built for Business
            </Text>
            <Text as="p" tone="subdued">
              Professional features designed for procurement teams and industrial operations
            </Text>
          </BlockStack>

          <Grid>
            {businessFeatures.map((feature, index) => (
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4, xl: 4 }} key={index}>
                <Card>
                  <BlockStack gap="300">
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      background: '#e6f3f7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      {feature.icon}
                    </div>
                    
                    <BlockStack gap="100">
                      <Text as="h4" variant="bodyMd" fontWeight="semibold">
                        {feature.title}
                      </Text>
                      <Text as="p" variant="bodyMd" tone="subdued">
                        {feature.description}
                      </Text>
                    </BlockStack>
                  </BlockStack>
                </Card>
              </Grid.Cell>
            ))}
          </Grid>
        </BlockStack>
      </Card>

      {/* Contact Sales CTA */}
      <Card tone="subdued">
        <BlockStack gap="400" align="center">
          <BlockStack gap="200" align="center">
            <Text as="h3" variant="headingMd">
              Ready to Get Started?
            </Text>
            <Text as="p" tone="subdued" alignment="center">
              Speak with our B2B specialists about custom pricing, bulk orders, and enterprise solutions
            </Text>
          </BlockStack>
          
          <InlineStack gap="300" align="center">
            <Button variant="primary" size="large" onClick={onContactSales}>
              Contact Sales Team
            </Button>
            <Button variant="secondary" size="large">
              Schedule Demo
            </Button>
          </InlineStack>
          
          <InlineStack gap="200" align="center">
            <Badge tone="success">Free Consultation</Badge>
            <Badge tone="info">Custom Pricing</Badge>
            <Badge tone="attention">Fast Setup</Badge>
          </InlineStack>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}