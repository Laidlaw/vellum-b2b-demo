import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StorefrontApp from './apps/storefront/StorefrontApp';
import CustomerAdminApp from './apps/customer-admin/CustomerAdminApp';
import MerchantPortalApp from './apps/merchant-portal/MerchantPortalApp';
import AppFooter from './shared/components/AppFooter';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider
        i18n={{
          Polaris: {
            Common: {
              checkbox: 'checkbox',
            },
            ResourceList: {
              sortingLabel: 'Sort by',
              defaultItemSingular: 'item',
              defaultItemPlural: 'items',
              showing: 'Showing {itemsCount} {resource}',
              Item: {
                viewItem: 'View details for {itemName}',
              },
            },
          },
        }}
      >
        <Router>
          <div style={{ minHeight: '100vh', paddingBottom: '60px', position: 'relative' }}>
            <Routes>
              <Route path="/storefront/*" element={<StorefrontApp />} />
              <Route path="/customer-admin/*" element={<CustomerAdminApp />} />
              <Route path="/merchant-portal/*" element={<MerchantPortalApp />} />
              <Route path="/" element={<Navigate to="/storefront" replace />} />
            </Routes>
            <AppFooter />
          </div>
        </Router>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
