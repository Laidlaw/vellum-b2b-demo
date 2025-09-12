import { http, HttpResponse } from 'msw';
import { DEMO_DATA, getProductsByCategory, getQuotesByCompany, findProductById, findQuoteById, getOrdersByCompany, findOrderById } from '../mock/seed';
import type { ApiResponse, PaginatedResponse } from '../../shared/types';

// MSW API handlers for the demo app
export const handlers = [
  // Products endpoints
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '12');
    
    const products = category ? getProductsByCategory(category) : DEMO_DATA.products;
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedProducts = products.slice(start, end);
    
    const response: PaginatedResponse<typeof paginatedProducts[0]> = {
      data: paginatedProducts,
      total: products.length,
      page,
      limit,
      hasNext: end < products.length,
      hasPrevious: page > 1
    };
    
    return HttpResponse.json(response);
  }),
  
  http.get('/api/products/:id', ({ params }) => {
    const product = findProductById(params.id as string);
    if (!product) {
      return HttpResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    const response: ApiResponse<typeof product> = {
      data: product,
      success: true
    };
    
    return HttpResponse.json(response);
  }),
  
  // Categories endpoints
  http.get('/api/categories', () => {
    const response: ApiResponse<typeof DEMO_DATA.categories> = {
      data: DEMO_DATA.categories,
      success: true
    };
    
    return HttpResponse.json(response);
  }),
  
  // Companies endpoints
  http.get('/api/companies', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedCompanies = DEMO_DATA.companies.slice(start, end);
    
    const response: PaginatedResponse<typeof paginatedCompanies[0]> = {
      data: paginatedCompanies,
      total: DEMO_DATA.companies.length,
      page,
      limit,
      hasNext: end < DEMO_DATA.companies.length,
      hasPrevious: page > 1
    };
    
    return HttpResponse.json(response);
  }),
  
  // Quotes endpoints
  http.get('/api/quotes', ({ request }) => {
    const url = new URL(request.url);
    const companyId = url.searchParams.get('companyId');
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    let quotes = DEMO_DATA.quotes;
    
    if (companyId) {
      quotes = getQuotesByCompany(companyId);
    }
    
    if (status) {
      quotes = quotes.filter(q => q.status === status);
    }
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedQuotes = quotes.slice(start, end);
    
    const response: PaginatedResponse<typeof paginatedQuotes[0]> = {
      data: paginatedQuotes,
      total: quotes.length,
      page,
      limit,
      hasNext: end < quotes.length,
      hasPrevious: page > 1
    };
    
    return HttpResponse.json(response);
  }),
  
  http.get('/api/quotes/:id', ({ params }) => {
    const quote = findQuoteById(params.id as string);
    if (!quote) {
      return HttpResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      );
    }
    
    const response: ApiResponse<typeof quote> = {
      data: quote,
      success: true
    };
    
    return HttpResponse.json(response);
  }),
  
  http.post('/api/quotes/:id/approve', ({ params }) => {
    const quote = findQuoteById(params.id as string);
    if (!quote) {
      return HttpResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      );
    }
    
    // Simulate approval
    quote.status = 'approved';
    
    const response: ApiResponse<typeof quote> = {
      data: quote,
      success: true,
      message: 'Quote approved successfully'
    };
    
    return HttpResponse.json(response);
  }),
  
  // Salespeople endpoint
  http.get('/api/salespeople', () => {
    const response: ApiResponse<typeof DEMO_DATA.salespeople> = {
      data: DEMO_DATA.salespeople,
      success: true
    };
    
    return HttpResponse.json(response);
  }),
  
  // Cart endpoints (simulated - would normally be user-specific)
  http.get('/api/cart', () => {
    // Return empty cart for demo
    const response: ApiResponse<{ items: unknown[], total: number }> = {
      data: { items: [], total: 0 },
      success: true
    };
    
    return HttpResponse.json(response);
  }),
  
  http.post('/api/cart/add', async ({ request }) => {
    const body = await request.json() as { productId: string; quantity: number };
    const product = findProductById(body.productId);
    
    if (!product) {
      return HttpResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    const response: ApiResponse<{ message: string }> = {
      data: { message: 'Product added to cart' },
      success: true
    };
    
    return HttpResponse.json(response);
  }),

  // Orders endpoints
  http.get('/api/orders', ({ request }) => {
    const url = new URL(request.url);
    const companyId = url.searchParams.get('companyId');
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    let orders = DEMO_DATA.orders;
    
    if (companyId) {
      orders = getOrdersByCompany(companyId);
    }
    
    if (status) {
      const statusArray = status.split(',');
      orders = orders.filter(o => statusArray.includes(o.status));
    }
    
    // Sort by date created (newest first)
    orders = orders.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedOrders = orders.slice(start, end);
    
    const response: PaginatedResponse<typeof paginatedOrders[0]> = {
      data: paginatedOrders,
      total: orders.length,
      page,
      limit,
      hasNext: end < orders.length,
      hasPrevious: page > 1
    };
    
    return HttpResponse.json(response);
  }),
  
  http.get('/api/orders/:id', ({ params }) => {
    const order = findOrderById(params.id as string);
    if (!order) {
      return HttpResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    const response: ApiResponse<typeof order> = {
      data: order,
      success: true
    };
    
    return HttpResponse.json(response);
  })
];