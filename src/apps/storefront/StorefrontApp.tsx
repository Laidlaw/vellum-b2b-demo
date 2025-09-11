import { Routes, Route } from 'react-router-dom';
import { Page, Card, BlockStack, Text, Button, InlineStack } from '@shopify/polaris';
import { Link } from 'react-router-dom';

function StorefrontHome() {
  return (
    <Page title="B2B Storefront">
      <BlockStack gap="400">
        <Card>
          <BlockStack gap="200">
            <Text as="h2" variant="headingMd">
              Welcome to the B2B Storefront
            </Text>
            <Text as="p">
              This is where B2B shoppers browse products, add items to cart or quotes, and manage their orders.
            </Text>
            <InlineStack gap="200">
              <Link to="/storefront/products">
                <Button>Browse Products</Button>
              </Link>
              <Link to="/storefront/cart">
                <Button variant="secondary">View Cart</Button>
              </Link>
              <Link to="/storefront/quotes">
                <Button variant="secondary">My Quotes</Button>
              </Link>
            </InlineStack>
          </BlockStack>
        </Card>
        
        <Card>
          <BlockStack gap="200">
            <Text as="h3" variant="headingMd">Quick Links</Text>
            <InlineStack gap="200">
              <Link to="/customer-admin">
                <Button variant="plain">Customer Admin</Button>
              </Link>
              <Link to="/merchant-portal">
                <Button variant="plain">Merchant Portal</Button>
              </Link>
            </InlineStack>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}

function ProductsPage() {
  return (
    <Page 
      title="Products"
      backAction={{
        content: 'Storefront',
        url: '/storefront'
      }}
    >
      <Card>
        <Text as="p">Product catalog will be implemented here</Text>
      </Card>
    </Page>
  );
}

function CartPage() {
  return (
    <Page 
      title="Shopping Cart"
      backAction={{
        content: 'Storefront',
        url: '/storefront'
      }}
    >
      <Card>
        <Text as="p">Shopping cart will be implemented here</Text>
      </Card>
    </Page>
  );
}

function QuotesPage() {
  return (
    <Page 
      title="My Quotes"
      backAction={{
        content: 'Storefront',
        url: '/storefront'
      }}
    >
      <Card>
        <Text as="p">Quote management will be implemented here</Text>
      </Card>
    </Page>
  );
}

export default function StorefrontApp() {
  return (
    <Routes>
      <Route index element={<StorefrontHome />} />
      <Route path="products/*" element={<ProductsPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="quotes/*" element={<QuotesPage />} />
    </Routes>
  );
}