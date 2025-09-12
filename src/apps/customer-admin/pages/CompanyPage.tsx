import { 
  Card, 
  Page, 
  BlockStack, 
  Text, 
  Button, 
  InlineStack,
  Grid,
  Box,
  Badge
} from '@shopify/polaris';
import {
  EditIcon,
  PhoneIcon,
  CreditCardIcon
} from '@shopify/polaris-icons';

// Mock company data - in a real app this would come from APIs
const COMPANY_DATA = {
  basicInfo: {
    name: 'Acme Industrial Solutions',
    industry: 'Manufacturing',
    businessNumber: 'BN-12345678',
    website: 'www.acme-industrial.com',
    phone: '+1 (555) 123-4567',
    email: 'contact@acme-industrial.com',
    establishedYear: '2010',
    employeeCount: '250-500',
    accountManager: 'John Smith'
  },
  addresses: {
    billing: {
      company: 'Acme Industrial Solutions',
      address1: '1234 Industrial Drive',
      address2: 'Suite 200',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'United States',
      phone: '+1 (555) 123-4567'
    },
    shipping: [
      {
        id: '1',
        name: 'Main Warehouse',
        company: 'Acme Industrial Solutions',
        address1: '1234 Industrial Drive',
        address2: 'Loading Dock B',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'United States',
        phone: '+1 (555) 123-4567',
        isDefault: true
      },
      {
        id: '2',
        name: 'East Coast Distribution',
        company: 'Acme Industrial Solutions',
        address1: '567 Atlantic Avenue',
        address2: '',
        city: 'Boston',
        state: 'MA',
        zipCode: '02110',
        country: 'United States',
        phone: '+1 (555) 987-6543',
        isDefault: false
      }
    ]
  },
  paymentInfo: {
    paymentTerms: '30 days',
    creditLimit: '$100,000',
    availableCredit: '$75,420',
    paymentMethods: [
      { type: 'Credit Card', last4: '4567', isDefault: true },
      { type: 'ACH Transfer', account: 'ending in 8901', isDefault: false }
    ]
  },
  preferences: {
    orderApprovalRequired: true,
    quoteApprovalThreshold: '$5,000',
    allowBackorders: true,
    preferredCurrency: 'USD',
    communicationPreference: 'Email'
  }
};

interface AddressData {
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

function AddressCard({ address, title, onEdit }: { address: AddressData; title: string; onEdit: () => void }) {
  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="space-between">
          <Text as="h3" variant="headingSm">
            {title}
          </Text>
          <Button 
            variant="plain" 
            icon={EditIcon}
            onClick={onEdit}
          >
            Edit
          </Button>
        </InlineStack>
        
        <BlockStack gap="200">
          {address.company && (
            <Text as="p" variant="bodyMd" fontWeight="medium">
              {address.company}
            </Text>
          )}
          <Text as="p" variant="bodyMd">
            {address.address1}
          </Text>
          {address.address2 && (
            <Text as="p" variant="bodyMd">
              {address.address2}
            </Text>
          )}
          <Text as="p" variant="bodyMd">
            {address.city}, {address.state} {address.zipCode}
          </Text>
          <Text as="p" variant="bodyMd">
            {address.country}
          </Text>
          {address.phone && (
            <InlineStack gap="200" align="start">
              <PhoneIcon style={{ width: '16px', height: '16px' }} />
              <Text as="p" variant="bodyMd">
                {address.phone}
              </Text>
            </InlineStack>
          )}
        </BlockStack>
      </BlockStack>
    </Card>
  );
}

interface ShippingAddressData extends AddressData {
  id: string;
  name: string;
  isDefault: boolean;
}

function ShippingAddressCard({ address, onEdit, onSetDefault }: { address: ShippingAddressData; onEdit: () => void; onSetDefault: () => void }) {
  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="space-between">
          <BlockStack gap="100">
            <InlineStack gap="200" align="start">
              <Text as="h3" variant="headingSm">
                {address.name}
              </Text>
              {address.isDefault && <Badge>Default</Badge>}
            </InlineStack>
          </BlockStack>
          <InlineStack gap="200">
            {!address.isDefault && (
              <Button size="slim" onClick={onSetDefault}>
                Set as default
              </Button>
            )}
            <Button 
              size="slim"
              variant="plain" 
              icon={EditIcon}
              onClick={onEdit}
            >
              Edit
            </Button>
          </InlineStack>
        </InlineStack>
        
        <BlockStack gap="200">
          <Text as="p" variant="bodyMd" fontWeight="medium">
            {address.company}
          </Text>
          <Text as="p" variant="bodyMd">
            {address.address1}
          </Text>
          {address.address2 && (
            <Text as="p" variant="bodyMd">
              {address.address2}
            </Text>
          )}
          <Text as="p" variant="bodyMd">
            {address.city}, {address.state} {address.zipCode}
          </Text>
          <Text as="p" variant="bodyMd">
            {address.country}
          </Text>
          <InlineStack gap="200" align="start">
            <PhoneIcon style={{ width: '16px', height: '16px' }} />
            <Text as="p" variant="bodyMd">
              {address.phone}
            </Text>
          </InlineStack>
        </BlockStack>
      </BlockStack>
    </Card>
  );
}

export default function CompanyPage() {
  return (
    <Page 
      title="Company Information" 
      subtitle="Manage your company details, addresses, and account settings"
      primaryAction={
        <Button variant="primary" icon={EditIcon}>
          Edit company profile
        </Button>
      }
    >
      <BlockStack gap="600">
        {/* Company Details */}
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between">
              <Text as="h2" variant="headingMd">
                Company details
              </Text>
              <Button variant="plain" icon={EditIcon}>
                Edit
              </Button>
            </InlineStack>
            
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 2, lg: 4, xl: 4 }}>
                <BlockStack gap="300">
                  <Box>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Company name
                    </Text>
                    <Text as="p" variant="bodyMd" fontWeight="medium">
                      {COMPANY_DATA.basicInfo.name}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Industry
                    </Text>
                    <Text as="p" variant="bodyMd" fontWeight="medium">
                      {COMPANY_DATA.basicInfo.industry}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Business number
                    </Text>
                    <Text as="p" variant="bodyMd" fontWeight="medium">
                      {COMPANY_DATA.basicInfo.businessNumber}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Website
                    </Text>
                    <Text as="p" variant="bodyMd" fontWeight="medium">
                      {COMPANY_DATA.basicInfo.website}
                    </Text>
                  </Box>
                </BlockStack>
              </Grid.Cell>
              
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 2, lg: 4, xl: 4 }}>
                <BlockStack gap="300">
                  <Box>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Phone number
                    </Text>
                    <Text as="p" variant="bodyMd" fontWeight="medium">
                      {COMPANY_DATA.basicInfo.phone}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Email address
                    </Text>
                    <Text as="p" variant="bodyMd" fontWeight="medium">
                      {COMPANY_DATA.basicInfo.email}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Established
                    </Text>
                    <Text as="p" variant="bodyMd" fontWeight="medium">
                      {COMPANY_DATA.basicInfo.establishedYear}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Employee count
                    </Text>
                    <Text as="p" variant="bodyMd" fontWeight="medium">
                      {COMPANY_DATA.basicInfo.employeeCount}
                    </Text>
                  </Box>
                </BlockStack>
              </Grid.Cell>
              
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 2, lg: 4, xl: 4 }}>
                <BlockStack gap="300">
                  <Box>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Account manager
                    </Text>
                    <Text as="p" variant="bodyMd" fontWeight="medium">
                      {COMPANY_DATA.basicInfo.accountManager}
                    </Text>
                  </Box>
                </BlockStack>
              </Grid.Cell>
            </Grid>
          </BlockStack>
        </Card>
        
        {/* Addresses */}
        <BlockStack gap="400">
          <Text as="h2" variant="headingMd">
            Addresses
          </Text>
          
          <Grid>
            {/* Billing Address */}
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 6, xl: 6 }}>
              <AddressCard 
                address={COMPANY_DATA.addresses.billing}
                title="Billing address"
                onEdit={() => console.log('Edit billing address')}
              />
            </Grid.Cell>
            
            {/* Shipping Addresses */}
            {COMPANY_DATA.addresses.shipping.map((address) => (
              <Grid.Cell key={address.id} columnSpan={{ xs: 6, sm: 6, md: 3, lg: 6, xl: 6 }}>
                <ShippingAddressCard 
                  address={address}
                  onEdit={() => console.log('Edit shipping address', address.id)}
                  onSetDefault={() => console.log('Set as default', address.id)}
                />
              </Grid.Cell>
            ))}
          </Grid>
          
          <Box>
            <Button variant="secondary">
              Add shipping address
            </Button>
          </Box>
        </BlockStack>
        
        {/* Payment Information */}
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between">
              <Text as="h2" variant="headingMd">
                Payment information
              </Text>
              <Button variant="plain" icon={EditIcon}>
                Edit
              </Button>
            </InlineStack>
            
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 2, lg: 4, xl: 4 }}>
                <BlockStack gap="300">
                  <Box>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Payment terms
                    </Text>
                    <Text as="p" variant="bodyMd" fontWeight="medium">
                      {COMPANY_DATA.paymentInfo.paymentTerms}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Credit limit
                    </Text>
                    <Text as="p" variant="bodyMd" fontWeight="medium">
                      {COMPANY_DATA.paymentInfo.creditLimit}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Available credit
                    </Text>
                    <Text as="p" variant="bodyMd" fontWeight="medium" tone="success">
                      {COMPANY_DATA.paymentInfo.availableCredit}
                    </Text>
                  </Box>
                </BlockStack>
              </Grid.Cell>
              
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 2, lg: 8, xl: 8 }}>
                <BlockStack gap="300">
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Payment methods
                  </Text>
                  <BlockStack gap="200">
                    {COMPANY_DATA.paymentInfo.paymentMethods.map((method, index) => (
                      <InlineStack key={index} align="space-between" blockAlign="center">
                        <InlineStack gap="300" align="start">
                          <CreditCardIcon style={{ width: '20px', height: '20px' }} />
                          <BlockStack gap="050">
                            <InlineStack gap="200" align="start">
                              <Text as="p" variant="bodyMd" fontWeight="medium">
                                {method.type}
                              </Text>
                              {method.isDefault && <Badge tone="info">Default</Badge>}
                            </InlineStack>
                            <Text as="p" variant="bodySm" tone="subdued">
                              {method.last4 || method.account}
                            </Text>
                          </BlockStack>
                        </InlineStack>
                        <Button variant="plain" size="slim">
                          Edit
                        </Button>
                      </InlineStack>
                    ))}
                  </BlockStack>
                  
                  <Box paddingBlockStart="200">
                    <Button variant="secondary" size="slim">
                      Add payment method
                    </Button>
                  </Box>
                </BlockStack>
              </Grid.Cell>
            </Grid>
          </BlockStack>
        </Card>
        
        {/* Account Preferences */}
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between">
              <Text as="h2" variant="headingMd">
                Account preferences
              </Text>
              <Button variant="plain" icon={EditIcon}>
                Edit
              </Button>
            </InlineStack>
            
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 6, xl: 6 }}>
                <BlockStack gap="300">
                  <InlineStack align="space-between">
                    <Text as="p" variant="bodyMd">
                      Order approval required
                    </Text>
                    <Badge tone={COMPANY_DATA.preferences.orderApprovalRequired ? 'success' : 'critical'}>
                      {COMPANY_DATA.preferences.orderApprovalRequired ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </InlineStack>
                  
                  <InlineStack align="space-between">
                    <Text as="p" variant="bodyMd">
                      Quote approval threshold
                    </Text>
                    <Text as="p" variant="bodyMd" fontWeight="medium">
                      {COMPANY_DATA.preferences.quoteApprovalThreshold}
                    </Text>
                  </InlineStack>
                  
                  <InlineStack align="space-between">
                    <Text as="p" variant="bodyMd">
                      Allow backorders
                    </Text>
                    <Badge tone={COMPANY_DATA.preferences.allowBackorders ? 'success' : 'critical'}>
                      {COMPANY_DATA.preferences.allowBackorders ? 'Yes' : 'No'}
                    </Badge>
                  </InlineStack>
                </BlockStack>
              </Grid.Cell>
              
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 6, xl: 6 }}>
                <BlockStack gap="300">
                  <InlineStack align="space-between">
                    <Text as="p" variant="bodyMd">
                      Preferred currency
                    </Text>
                    <Text as="p" variant="bodyMd" fontWeight="medium">
                      {COMPANY_DATA.preferences.preferredCurrency}
                    </Text>
                  </InlineStack>
                  
                  <InlineStack align="space-between">
                    <Text as="p" variant="bodyMd">
                      Communication preference
                    </Text>
                    <Text as="p" variant="bodyMd" fontWeight="medium">
                      {COMPANY_DATA.preferences.communicationPreference}
                    </Text>
                  </InlineStack>
                </BlockStack>
              </Grid.Cell>
            </Grid>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}