import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Page, Card, BlockStack, Text, Button, InlineStack, Toast } from '@shopify/polaris';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// Import our new components
import { ProductCatalog } from '../../shared/components/ProductCatalog';
import { ProductDetails } from '../../shared/components/ProductDetails';
import { StorefrontNavigation } from '../../shared/components/StorefrontNavigation';
import { QuoteBuilder } from '../../shared/components/QuoteBuilder';
import { HeroSection } from '../../shared/components/HeroSection';
import { FeaturedProducts } from '../../shared/components/FeaturedProducts';
import { CategoryProductRows } from '../../shared/components/CategoryProductRows';
import { TrustSignals } from '../../shared/components/TrustSignals';

// Import types
import type { Product, ProductCategory, User, ShoppingCart, QuoteItem } from '../../shared/types';

// Mock current user and cart data (in real app, this would come from stores/context)
const mockUser: User = {
  id: '1',
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@acmecorp.com',
  role: 'purchaser',
  department: 'Operations',
  companyId: 'company-1',
  status: 'active',
  permissions: ['purchase', 'quote'],
  jobTitle: 'Procurement Specialist',
  dateCreated: new Date(),
  lastLogin: new Date()
};

function StorefrontHome() {
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false);
  const [pendingQuoteItems, setPendingQuoteItems] = useState<QuoteItem[]>([]);
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch products and categories for the homepage
  const { data: productsResponse, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      return response.json();
    }
  });

  const { data: categoriesResponse, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      return response.json();
    }
  });

  const products: Product[] = productsResponse?.data || [];
  const categories: ProductCategory[] = categoriesResponse?.data || [];

  const handleRequestQuote = () => {
    // Navigate to products page for quote building
    window.location.href = '/storefront/products';
  };

  const handleContactSales = () => {
    // In real app, this would open contact form or redirect
    setToastMessage('Contact form would open here - sales@company.com');
    setToastActive(true);
  };

  const handleAddToQuote = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const quoteItem: QuoteItem = {
        productId: product.id,
        product: product,
        quantity: 1,
        unitPrice: product.basePrice,
        totalPrice: product.basePrice
      };
      setPendingQuoteItems([quoteItem]);
      setShowQuoteBuilder(true);
    }
  };

  const handleViewDetails = (productId: string) => {
    window.location.href = `/storefront/products/${productId}`;
  };

  const handleSubmitQuote = () => {
    setToastMessage('Quote request submitted successfully');
    setToastActive(true);
    setPendingQuoteItems([]);
    setShowQuoteBuilder(false);
  };

  const toastMarkup = toastActive ? (
    <Toast content={toastMessage} onDismiss={() => setToastActive(false)} />
  ) : null;

  return (
    <>
      <Page title="Industrial Solutions">
        <BlockStack gap="600">
          {/* Hero Section */}
          <HeroSection 
            onRequestQuote={handleRequestQuote}
            onContactSales={handleContactSales}
          />

          {/* Featured Products */}
          <FeaturedProducts
            products={products}
            onAddToQuote={handleAddToQuote}
            onViewDetails={handleViewDetails}
            isLoading={isLoadingProducts}
          />

          {/* Category Product Rows */}
          <CategoryProductRows
            products={products}
            categories={categories}
            onAddToQuote={handleAddToQuote}
            onViewDetails={handleViewDetails}
            isLoading={isLoadingProducts || isLoadingCategories}
          />

          {/* Trust Signals & B2B Features */}
          <TrustSignals 
            onContactSales={handleContactSales}
          />

          {/* Quick Demo Links (for development only) */}
          <Card tone="subdued">
            <BlockStack gap="200">
              <Text as="h4" variant="headingMd">Demo Navigation</Text>
              <InlineStack gap="200" wrap>
                <Link to="/customer-admin">
                  <Button variant="plain" size="slim">Customer Admin</Button>
                </Link>
                <Link to="/merchant-portal">
                  <Button variant="plain" size="slim">Merchant Portal</Button>
                </Link>
                <Link to="/storefront/products">
                  <Button variant="plain" size="slim">Full Catalog</Button>
                </Link>
                <Link to="/storefront/cart">
                  <Button variant="plain" size="slim">Shopping Cart</Button>
                </Link>
                <Link to="/storefront/quotes">
                  <Button variant="plain" size="slim">My Quotes</Button>
                </Link>
              </InlineStack>
            </BlockStack>
          </Card>
        </BlockStack>
      </Page>

      <QuoteBuilder
        isOpen={showQuoteBuilder}
        onClose={() => setShowQuoteBuilder(false)}
        onSubmitQuote={handleSubmitQuote}
        initialItems={pendingQuoteItems}
      />

      {toastMarkup}
    </>
  );
}

function ProductsPage() {
  const navigate = useNavigate();
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false);
  const [pendingQuoteItems, setPendingQuoteItems] = useState<QuoteItem[]>([]);

  // Fetch products
  const { data: productsResponse, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      return response.json();
    }
  });

  // Fetch categories
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      return response.json();
    }
  });

  const products: Product[] = productsResponse?.data || [];
  const categories: ProductCategory[] = categoriesResponse?.data || [];

  const handleAddToCart = () => {
    // In real app, this would update cart store
    setToastMessage('Product added to cart');
    setToastActive(true);
  };

  const handleAddToQuote = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const quoteItem: QuoteItem = {
        productId: product.id,
        product: product,
        quantity: 1,
        unitPrice: product.basePrice,
        totalPrice: product.basePrice
      };
      setPendingQuoteItems([quoteItem]);
      setShowQuoteBuilder(true);
    }
  };

  const handleViewDetails = (productId: string) => {
    navigate(`/storefront/products/${productId}`);
  };

  const handleSubmitQuote = () => {
    // In real app, this would submit to API
    setToastMessage('Quote request submitted successfully');
    setToastActive(true);
    setPendingQuoteItems([]);
  };

  const toastMarkup = toastActive ? (
    <Toast content={toastMessage} onDismiss={() => setToastActive(false)} />
  ) : null;

  return (
    <>
      <ProductCatalog
        products={products}
        categories={categories}
        isLoading={isLoadingProducts}
        onAddToCart={handleAddToCart}
        onAddToQuote={handleAddToQuote}
        onViewDetails={handleViewDetails}
      />
      
      <QuoteBuilder
        isOpen={showQuoteBuilder}
        onClose={() => setShowQuoteBuilder(false)}
        onSubmitQuote={handleSubmitQuote}
        initialItems={pendingQuoteItems}
      />
      
      {toastMarkup}
    </>
  );
}

function ProductDetailsPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch single product
  const { data: productResponse, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      return response.json();
    },
    enabled: !!productId
  });

  const product: Product = productResponse?.data;

  const handleAddToCart = (productId: string, quantity: number) => {
    setToastMessage(`Added ${quantity} item(s) to cart`);
    setToastActive(true);
  };

  const handleAddToQuote = (productId: string, quantity: number) => {
    setToastMessage(`Added ${quantity} item(s) to quote request`);
    setToastActive(true);
  };

  const handleBack = () => {
    navigate('/storefront/products');
  };

  const toastMarkup = toastActive ? (
    <Toast content={toastMessage} onDismiss={() => setToastActive(false)} />
  ) : null;

  if (isLoading) {
    return (
      <Page title="Loading...">
        <Card>
          <Text as="p">Loading product details...</Text>
        </Card>
      </Page>
    );
  }

  if (!product) {
    return (
      <Page 
        title="Product Not Found"
        backAction={{
          content: 'Back to Products',
          onAction: handleBack
        }}
      >
        <Card>
          <Text as="p">The requested product could not be found.</Text>
        </Card>
      </Page>
    );
  }

  return (
    <>
      <ProductDetails
        product={product}
        onAddToCart={handleAddToCart}
        onAddToQuote={handleAddToQuote}
        onBack={handleBack}
      />
      {toastMarkup}
    </>
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
        <Text as="p">Shopping cart implementation coming soon...</Text>
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
        <Text as="p">Quote management implementation coming soon...</Text>
      </Card>
    </Page>
  );
}

function StorefrontWithNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Fetch categories for navigation
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      return response.json();
    }
  });

  const categories: ProductCategory[] = categoriesResponse?.data || [];
  const mockCart: ShoppingCart = {
    id: 'cart-1',
    items: [],
    totalAmount: 0,
    userId: mockUser.id,
    companyId: mockUser.companyId,
    dateCreated: new Date(),
    dateUpdated: new Date()
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    // In real app, this would clear user session
    console.log('Logout');
  };

  return (
    <StorefrontNavigation
      currentUser={mockUser}
      cart={mockCart}
      categories={categories}
      currentPath={location.pathname}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      <Routes>
        <Route index element={<StorefrontHome />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:productId" element={<ProductDetailsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="quotes/*" element={<QuotesPage />} />
      </Routes>
    </StorefrontNavigation>
  );
}

export default function StorefrontApp() {
  return <StorefrontWithNavigation />;
}