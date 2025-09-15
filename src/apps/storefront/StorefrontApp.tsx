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
import { ShoppingCart } from '../../shared/components/ShoppingCart';
import { CustomerQuotes } from '../../shared/components/CustomerQuotes';

// Import types and hooks
import type { Product, ProductCategory, User, ShoppingCart as ShoppingCartType, QuoteItem } from '../../shared/types';
import { useProducts, useCategories, useCart, useQuoteBuilder } from '../../shared/hooks';

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
  const navigate = useNavigate();
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Use custom hooks
  const { data: productsResponse, isLoading: isLoadingProducts } = useProducts();
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const products = productsResponse?.data || [];
  const { addItem: addToCart } = useCart();
  const {
    addToQuote,
    isBuilderOpen,
    openQuoteBuilder,
    closeQuoteBuilder,
    submitQuote
  } = useQuoteBuilder();

  const handleRequestQuote = () => {
    // Navigate to products page for quote building
    navigate('/storefront/products');
  };

  const handleContactSales = () => {
    // In real app, this would open contact form or redirect
    setToastMessage('Contact form would open here - sales@company.com');
    setToastActive(true);
  };

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart(product, 1);
      setToastMessage('Product added to cart');
      setToastActive(true);
    }
  };

  const handleAddToQuote = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToQuote(product, 1);
      openQuoteBuilder();
    }
  };

  const handleViewDetails = (productId: string) => {
    navigate(`/storefront/products/${productId}`);
  };

  const handleSubmitQuote = async () => {
    try {
      await submitQuote({
        name: `Quote ${new Date().toLocaleDateString()}`
      });
      setToastMessage('Quote request submitted successfully');
      setToastActive(true);
    } catch (error) {
      setToastMessage('Failed to submit quote');
      setToastActive(true);
    }
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
            onAddToCart={handleAddToCart}
            onAddToQuote={handleAddToQuote}
            onViewDetails={handleViewDetails}
            isLoading={isLoadingProducts}
          />

          {/* Category Product Rows */}
          <CategoryProductRows
            products={products}
            categories={categories}
            onAddToCart={handleAddToCart}
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
        isOpen={isBuilderOpen}
        onClose={closeQuoteBuilder}
        onSubmitQuote={handleSubmitQuote}
      />

      {toastMarkup}
    </>
  );
}

function ProductsPage() {
  const navigate = useNavigate();
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Use custom hooks
  const { data: productsResponse, isLoading: isLoadingProducts } = useProducts();
  const { data: categories = [] } = useCategories();
  const products = productsResponse?.data || [];
  const { addItem: addToCart } = useCart();
  const { addToQuote, isBuilderOpen, openQuoteBuilder, closeQuoteBuilder, submitQuote } = useQuoteBuilder();

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart(product, 1);
      setToastMessage('Product added to cart');
      setToastActive(true);
    }
  };

  const handleAddToQuote = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToQuote(product, 1);
      openQuoteBuilder();
    }
  };

  const handleViewDetails = (productId: string) => {
    navigate(`/storefront/products/${productId}`);
  };

  const handleSubmitQuote = async () => {
    try {
      await submitQuote({
        name: `Quote ${new Date().toLocaleDateString()}`
      });
      setToastMessage('Quote request submitted successfully');
      setToastActive(true);
    } catch (error) {
      setToastMessage('Failed to submit quote');
      setToastActive(true);
    }
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
        isOpen={isBuilderOpen}
        onClose={closeQuoteBuilder}
        onSubmitQuote={handleSubmitQuote}
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
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Navigate to checkout page (will implement later)
    console.log('Navigate to checkout');
  };

  const handleContinueShopping = () => {
    navigate('/storefront/products');
  };

  return (
    <ShoppingCart
      onCheckout={handleCheckout}
      onContinueShopping={handleContinueShopping}
    />
  );
}

function QuotesPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/storefront');
  };

  const handleCreateQuote = () => {
    navigate('/storefront/products');
  };

  return (
    <CustomerQuotes
      companyId={mockUser.companyId}
      onBack={handleBack}
      onCreateQuote={handleCreateQuote}
    />
  );
}

function StorefrontWithNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Use custom hooks
  const { data: categories = [] } = useCategories();
  const { items, totalAmount } = useCart();

  // Convert cart items to the format expected by navigation
  const mockCart: ShoppingCartType = {
    id: 'cart-1',
    items: items,
    totalAmount: totalAmount,
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