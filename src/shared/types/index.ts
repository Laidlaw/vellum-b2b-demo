// Core data types for the B2B demo application

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
  units: 'inches' | 'cm';
  weightUnit: 'lbs' | 'kg';
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  dateCreated: Date;
  verified: boolean;
}

export interface VolumePrice {
  minQuantity: number;
  maxQuantity?: number;
  pricePerUnit: number;
  discountPercentage?: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  sku: string;
  description: string;
  dimensions: Dimensions;
  reviews: Review[];
  volumePricing: VolumePrice[];
  category: string;
  basePrice: number;
  imageUrl: string;
  imageId?: string; // New field for local image mapping
  inStock: boolean;
  stockQuantity: number;
  isFeatured?: boolean;
  isPremium?: boolean;
  isBestseller?: boolean;
  isNewProduct?: boolean;
  isSeasonalPromo?: boolean;
  certifications?: string[];
  tags?: string[];
}

export interface QuoteItem {
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  discount?: number;
  totalPrice: number;
}

export interface Quote {
  id: string;
  name: string;
  dateCreated: Date;
  dateExpired: Date;
  amount: number;
  purchaseOrderNumber?: string;
  status: 'draft' | 'pending' | 'approved' | 'expired' | 'rejected';
  items: QuoteItem[];
  companyId: string;
  salespersonId: string;
  integrationChannel?: 'salesforce' | 'hubspot' | 'manual';
  approxDeliveryDate?: Date;
  shippingAddress: Address;
  billingAddress: Address;
  orderRef?: string;
  timeUntilExpiration?: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  discount?: number;
}

export interface ShoppingCart {
  id: string;
  items: CartItem[];
  totalAmount: number;
  userId: string;
  companyId: string;
  dateCreated: Date;
  dateUpdated: Date;
}

export interface Address {
  id: string;
  type: 'billing' | 'shipping';
  company?: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'purchaser' | 'sub-contractor';
  department: string;
  location?: string;
  companyId: string;
  status: 'active' | 'inactive' | 'pending';
  permissions: string[];
  phone?: string;
  jobTitle?: string;
  dateCreated: Date;
  lastLogin?: Date;
}

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  industry: string;
  addresses: Address[];
  users: User[];
  salespersonId: string;
  integrationChannel?: 'salesforce' | 'hubspot' | 'manual';
  isActive: boolean;
  dateCreated: Date;
}

export interface Salesperson {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  territory?: string;
  isActive: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  imageUrl?: string;
  isActive: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Store types
export interface AppState {
  currentUser: User | null;
  currentCompany: Company | null;
  cart: ShoppingCart | null;
}

export interface QuoteFilters {
  status?: Quote['status'][];
  dateFrom?: Date;
  dateTo?: Date;
  salespersonId?: string;
  companyId?: string;
}

// Order types
export interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  dateCreated: Date;
  dateConfirmed?: Date;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentStatus: 'paid' | 'partial' | 'due' | 'overdue';
  paymentDueDate?: Date;
  companyId: string;
  userId: string;
  notes?: string;
}