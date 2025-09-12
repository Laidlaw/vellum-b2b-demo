import {
  generateProduct,
  generateCompany,
  generateQuote,
  generateSalesperson,
  generateProductCategory,
  generateOrder,
  generateUser
} from './generators';
import type { Product, Company, Quote, Salesperson, ProductCategory, Order, User } from '../../shared/types';

// Generate seed data for the demo
export function generateSeedData() {
  // Generate categories
  const categories: ProductCategory[] = Array.from({ length: 8 }, generateProductCategory);
  
  // Generate salespeople
  const salespeople: Salesperson[] = Array.from({ length: 5 }, generateSalesperson);
  
  // Generate products (distribute across categories)
  const products: Product[] = [];
  categories.forEach(category => {
    const categoryProducts = Array.from({ length: 12 }, () => generateProduct(category.id));
    products.push(...categoryProducts);
  });
  
  // Generate companies - first one is the demo company
  const companies: Company[] = [
    generateCompany('acme-industrial-123'), // Demo company for the app
    ...Array.from({ length: 9 }, generateCompany) // Additional random companies
  ];
  
  // Generate additional users for the companies (beyond the ones created with companies)
  const users: User[] = [];
  companies.forEach(company => {
    // Companies already have users, but let's add the company users to our main users array
    users.push(...company.users);
    
    // Add a few more users for variety
    const extraUsers = Array.from({ 
      length: Math.floor(Math.random() * 3) + 1 
    }, () => {
      const roles: User['role'][] = ['admin', 'manager', 'purchaser', 'sub-contractor'];
      return generateUser(company.id, roles[Math.floor(Math.random() * roles.length)]);
    });
    users.push(...extraUsers);
  });
  
  // Generate quotes for companies
  const quotes: Quote[] = [];
  companies.forEach(company => {
    const companyQuotes = Array.from({ 
      length: Math.floor(Math.random() * 8) + 2 
    }, () => generateQuote(company.id, products));
    quotes.push(...companyQuotes);
  });
  
  // Generate orders for companies
  const orders: Order[] = [];
  companies.forEach(company => {
    const companyOrders = Array.from({ 
      length: Math.floor(Math.random() * 6) + 3 
    }, () => generateOrder(products, company.id, company.users[0]?.id || 'default-user'));
    orders.push(...companyOrders);
  });
  
  return {
    categories,
    products,
    companies,
    users,
    quotes,
    orders,
    salespeople
  };
}

// Static demo data that doesn't change
export const DEMO_DATA = generateSeedData();

// Helper functions to get specific data
export function getProductsByCategory(categoryId: string): Product[] {
  return DEMO_DATA.products.filter(p => p.category === categoryId);
}

export function getQuotesByCompany(companyId: string): Quote[] {
  return DEMO_DATA.quotes.filter(q => q.companyId === companyId);
}

export function getQuotesByStatus(status: Quote['status']): Quote[] {
  return DEMO_DATA.quotes.filter(q => q.status === status);
}

export function findProductById(productId: string): Product | undefined {
  return DEMO_DATA.products.find(p => p.id === productId);
}

export function findCompanyById(companyId: string): Company | undefined {
  return DEMO_DATA.companies.find(c => c.id === companyId);
}

export function findQuoteById(quoteId: string): Quote | undefined {
  return DEMO_DATA.quotes.find(q => q.id === quoteId);
}

export function getOrdersByCompany(companyId: string): Order[] {
  return DEMO_DATA.orders.filter(o => o.companyId === companyId);
}

export function getOrdersByStatus(status: string): Order[] {
  return DEMO_DATA.orders.filter(o => o.status === status);
}

export function findOrderById(orderId: string): Order | undefined {
  return DEMO_DATA.orders.find(o => o.id === orderId);
}

export function getUsersByCompany(companyId: string): User[] {
  return DEMO_DATA.users.filter(u => u.companyId === companyId);
}

export function getUsersByStatus(status: User['status']): User[] {
  return DEMO_DATA.users.filter(u => u.status === status);
}

export function getUsersByDepartment(department: string): User[] {
  return DEMO_DATA.users.filter(u => u.department === department);
}

export function findUserById(userId: string): User | undefined {
  return DEMO_DATA.users.find(u => u.id === userId);
}