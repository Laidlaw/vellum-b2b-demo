import { faker } from '@faker-js/faker';
import type {
  Product,
  Company,
  User,
  Quote,
  Salesperson,
  ProductCategory,
  VolumePrice,
  Review,
  Dimensions,
  QuoteItem,
  CartItem,
  Address,
  Order,
  OrderItem
} from '../../shared/types';

// Mock data generators using faker

export function generateDimensions(): Dimensions {
  return {
    length: faker.number.float({ min: 1, max: 100, fractionDigits: 1 }),
    width: faker.number.float({ min: 1, max: 100, fractionDigits: 1 }),
    height: faker.number.float({ min: 1, max: 50, fractionDigits: 1 }),
    weight: faker.number.float({ min: 0.1, max: 50, fractionDigits: 1 }),
    units: faker.helpers.arrayElement(['inches', 'cm'] as const),
    weightUnit: faker.helpers.arrayElement(['lbs', 'kg'] as const)
  };
}

export function generateReview(): Review {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    userName: faker.person.fullName(),
    rating: faker.number.int({ min: 1, max: 5 }),
    comment: faker.lorem.sentences(2),
    dateCreated: faker.date.past({ years: 1 }),
    verified: faker.datatype.boolean(0.8)
  };
}

export function generateVolumePrice(): VolumePrice {
  const minQuantity = faker.number.int({ min: 1, max: 100 });
  return {
    minQuantity,
    maxQuantity: faker.number.int({ min: minQuantity + 10, max: minQuantity + 500 }),
    pricePerUnit: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
    discountPercentage: faker.number.int({ min: 5, max: 25 })
  };
}

export function generateProduct(categoryId?: string): Product {
  const basePrice = faker.number.float({ min: 20, max: 2000, fractionDigits: 2 });
  
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    brand: faker.company.name(),
    model: faker.vehicle.model(),
    sku: faker.string.alphanumeric(8).toUpperCase(),
    description: faker.commerce.productDescription(),
    dimensions: generateDimensions(),
    reviews: Array.from({ length: faker.number.int({ min: 0, max: 10 }) }, generateReview),
    volumePricing: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, generateVolumePrice),
    category: categoryId || faker.string.uuid(),
    basePrice,
    imageUrl: faker.image.url({ width: 400, height: 400 }),
    inStock: faker.datatype.boolean(0.9),
    stockQuantity: faker.number.int({ min: 0, max: 500 })
  };
}

export function generateSalesperson(): Salesperson {
  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    territory: faker.location.state(),
    isActive: faker.datatype.boolean(0.95)
  };
}

export function generateUser(companyId: string, role: User['role'] = 'shopper'): User {
  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    role,
    companyId,
    isActive: faker.datatype.boolean(0.9),
    permissions: role === 'supervisor' ? ['approve_quotes', 'manage_users'] : ['create_quotes'],
    dateCreated: faker.date.past({ years: 2 }),
    lastLogin: faker.date.recent({ days: 30 })
  };
}

export function generateCompany(): Company {
  const companyId = faker.string.uuid();
  const salespersonId = faker.string.uuid();
  
  return {
    id: companyId,
    name: faker.company.name(),
    logoUrl: faker.image.url({ width: 200, height: 100 }),
    industry: faker.helpers.arrayElement([
      'Manufacturing',
      'Healthcare',
      'Technology',
      'Retail',
      'Construction',
      'Education'
    ]),
    addresses: [
      {
        id: faker.string.uuid(),
        type: 'billing' as const,
        company: faker.company.name(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        address1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: 'US',
        phone: faker.phone.number()
      }
    ],
    users: Array.from({ length: faker.number.int({ min: 2, max: 8 }) }, () => generateUser(companyId)),
    salespersonId,
    integrationChannel: faker.helpers.arrayElement(['salesforce', 'hubspot', 'manual']),
    isActive: faker.datatype.boolean(0.95),
    dateCreated: faker.date.past({ years: 3 })
  };
}

export function generateQuoteItem(product: Product): QuoteItem {
  const quantity = faker.number.int({ min: 1, max: 100 });
  const unitPrice = product.basePrice;
  const discount = faker.datatype.boolean(0.3) ? faker.number.float({ min: 0.05, max: 0.2, fractionDigits: 2 }) : 0;
  
  return {
    productId: product.id,
    product,
    quantity,
    unitPrice,
    discount,
    totalPrice: quantity * unitPrice * (1 - discount)
  };
}

function generateAddress(type: 'billing' | 'shipping'): Address {
  return {
    id: faker.string.uuid(),
    type,
    company: faker.company.name(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    address1: faker.location.streetAddress(),
    address2: faker.datatype.boolean(0.3) ? faker.location.secondaryAddress() : undefined,
    city: faker.location.city(),
    state: faker.location.state(),
    zipCode: faker.location.zipCode(),
    country: 'US',
    phone: faker.phone.number()
  };
}

function calculateTimeUntilExpiration(expiredDate: Date): string {
  const now = new Date();
  const diffMs = expiredDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Expired';
  if (diffDays === 0) return 'Expires today';
  if (diffDays === 1) return '1 day';
  if (diffDays < 30) return `${diffDays} days`;
  
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return '1 month';
  return `${diffMonths} months`;
}

export function generateQuote(companyId: string, products: Product[]): Quote {
  const items = Array.from({ 
    length: faker.number.int({ min: 1, max: 5 }) 
  }, () => generateQuoteItem(faker.helpers.arrayElement(products)));
  
  const amount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const dateCreated = faker.date.past({ years: 1 });
  
  // Generate expiration date 7-90 days from creation
  const expirationDays = faker.number.int({ min: 7, max: 90 });
  const dateExpired = new Date(dateCreated);
  dateExpired.setDate(dateExpired.getDate() + expirationDays);
  
  const shippingAddress = generateAddress('shipping');
  const billingAddress = generateAddress('billing');
  
  return {
    id: faker.string.uuid(),
    name: `Quote for ${faker.company.name()}`,
    dateCreated,
    dateExpired,
    amount,
    purchaseOrderNumber: faker.datatype.boolean(0.4) ? faker.string.alphanumeric(10).toUpperCase() : undefined,
    status: faker.helpers.arrayElement(['draft', 'pending', 'approved', 'expired', 'rejected'] as const),
    items,
    companyId,
    salespersonId: faker.string.uuid(),
    integrationChannel: faker.helpers.arrayElement(['salesforce', 'hubspot', 'manual']),
    approxDeliveryDate: faker.date.future({ refDate: dateExpired }),
    shippingAddress,
    billingAddress,
    orderRef: faker.string.alphanumeric(8).toUpperCase(),
    timeUntilExpiration: calculateTimeUntilExpiration(dateExpired)
  };
}

export function generateProductCategory(): ProductCategory {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.department(),
    description: faker.lorem.sentence(),
    imageUrl: faker.image.url({ width: 300, height: 200 }),
    isActive: faker.datatype.boolean(0.9)
  };
}

export function generateCartItem(product: Product): CartItem {
  return {
    productId: product.id,
    product,
    quantity: faker.number.int({ min: 1, max: 20 }),
    discount: faker.datatype.boolean(0.2) ? faker.number.float({ min: 0.05, max: 0.15, fractionDigits: 2 }) : undefined
  };
}

export function generateOrderItem(product: Product): OrderItem {
  const quantity = faker.number.int({ min: 1, max: 10 });
  const unitPrice = faker.number.float({ min: product.basePrice * 0.8, max: product.basePrice * 1.2, fractionDigits: 2 });
  
  return {
    productId: product.id,
    product,
    quantity,
    unitPrice,
    totalPrice: quantity * unitPrice
  };
}

export function generateOrder(products: Product[], companyId: string, userId: string): Order {
  const dateCreated = faker.date.past({ years: 1 });
  const dateConfirmed = faker.datatype.boolean(0.8) ? faker.date.between({ from: dateCreated, to: new Date() }) : undefined;
  
  // Generate 1-5 order items
  const itemCount = faker.number.int({ min: 1, max: 5 });
  const selectedProducts = faker.helpers.arrayElements(products, itemCount);
  const items = selectedProducts.map(product => generateOrderItem(product));
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  const shippingAddress = generateAddress('shipping');
  const billingAddress = generateAddress('billing');
  
  const status = faker.helpers.arrayElement(['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const);
  const paymentStatus = faker.helpers.arrayElement(['paid', 'partial', 'due', 'overdue'] as const);
  
  return {
    id: faker.string.uuid(),
    orderNumber: `#${faker.number.int({ min: 1000, max: 9999 })}`,
    status,
    dateCreated,
    dateConfirmed,
    items,
    totalAmount,
    shippingAddress,
    billingAddress,
    paymentStatus,
    paymentDueDate: paymentStatus === 'due' || paymentStatus === 'overdue' 
      ? faker.date.future({ days: 30 }) 
      : undefined,
    companyId,
    userId,
    notes: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : undefined
  };
}