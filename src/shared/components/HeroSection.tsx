import { Card, BlockStack, InlineStack, Text, Button, Badge } from '@shopify/polaris';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  onRequestQuote?: () => void;
  onContactSales?: () => void;
}

export function HeroSection({ onRequestQuote, onContactSales }: HeroSectionProps) {
  return (
    <Card>
      <div style={{ 
        background: 'linear-gradient(135deg, #004c3f 0%, #006b5c 100%)',
        padding: '48px 32px',
        borderRadius: '8px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background pattern overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        <BlockStack gap="600" align="center">
          <BlockStack gap="400" align="center">
            <div style={{ textAlign: 'center' }}>
              <Text as="h1" variant="heading4xl" tone="inherit">
                Industrial Solutions for Your Business
              </Text>
              <div style={{ marginTop: '16px' }}>
                <Text as="p" variant="headingLg" tone="inherit" fontWeight="regular">
                  Professional-grade equipment, bulk pricing, and expert support for industrial operations
                </Text>
              </div>
            </div>
            
            {/* Value propositions */}
            <InlineStack gap="600" align="center" wrap={false}>
              <BlockStack gap="200" align="center">
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text as="span" variant="headingMd" tone="inherit">%</Text>
                </div>
                <Text as="p" variant="bodyMd" tone="inherit" alignment="center">
                  Volume Pricing
                </Text>
              </BlockStack>
              
              <BlockStack gap="200" align="center">
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text as="span" variant="headingMd" tone="inherit">⚡</Text>
                </div>
                <Text as="p" variant="bodyMd" tone="inherit" alignment="center">
                  Fast Shipping
                </Text>
              </BlockStack>
              
              <BlockStack gap="200" align="center">
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text as="span" variant="headingMd" tone="inherit">🔧</Text>
                </div>
                <Text as="p" variant="bodyMd" tone="inherit" alignment="center">
                  Expert Support
                </Text>
              </BlockStack>
              
              <BlockStack gap="200" align="center">
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text as="span" variant="headingMd" tone="inherit">🏢</Text>
                </div>
                <Text as="p" variant="bodyMd" tone="inherit" alignment="center">
                  B2B Focused
                </Text>
              </BlockStack>
            </InlineStack>
          </BlockStack>
          
          {/* Call-to-action buttons */}
          <InlineStack gap="400" align="center">
            <Link to="/storefront/products">
              <Button size="large" variant="primary">
                Browse Catalog
              </Button>
            </Link>
            <Button 
              size="large" 
              variant="secondary" 
              outline
              onClick={onRequestQuote}
            >
              Request Bulk Quote
            </Button>
            <Button 
              size="large" 
              variant="plain" 
              onClick={onContactSales}
              textColor="white"
            >
              Contact Sales Team
            </Button>
          </InlineStack>
          
          {/* Trust indicators */}
          <InlineStack gap="300" align="center" wrap>
            <Badge tone="info-strong">ISO 9001 Certified</Badge>
            <Badge tone="success-strong">Same-Day Shipping</Badge>
            <Badge tone="attention-strong">30+ Years Experience</Badge>
            <Badge tone="info-strong">24/7 Support</Badge>
          </InlineStack>
        </BlockStack>
      </div>
    </Card>
  );
}